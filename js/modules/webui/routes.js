import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Log from './log.js'
import * as Util from './util.js'

let routes = [];

const DEFAULT_HANDLER = handlerNotFound

// The current hash/location we are routed to.
// Should be prefixed with a hash symbol.
let currentHash = undefined;

// Start listening for routing events and do an initial route.
function init() {
    window.addEventListener("hashchange", function() {
        route();
    });

    route();
}

// Add a route to the router.
// Handlers should take three parameters: handler(path, pathParams, context).
// Where |path| the the canonical path being handle (without any query parameters),
// |pathParams| are any query parameters on the original path,
// and |context| is any context resolved by the router while preparing the request.
// Possible fields for |context| are: user, courseID, course, and assignmentID.
function addRoute(pattern, handler,
        pageName = undefined,
        requirements = {login: true, course: false, assignment: false}) {
    // Fill in any holes in requirements.
    requirements.course = requirements.course || requirements.assignment;
    requirements.login = requirements.login || requirements.course;

    routes.push([pattern, handler, requirements, pageName]);
}

// Route the page content to a path specified in an argument or window.location.hash.
// For routes that require an additional load/request (non-trivial routes),
// the loading page will be activated when the request it made.
function route(rawPath = undefined) {
    if (!rawPath) {
        rawPath = Util.getLocationHash();
    }

    let [path, params] = parsePath(rawPath);

    // Form the canonical path we are on.
    let newHash = Core.formHashPath(path, params);

    // Skip any routing if we are on the current path.
    // This let's us avoid infinite loops when routing internally.
    if (newHash == currentHash) {
        return;
    }

    // Set the hash to the cleaned-up value.
    currentHash = newHash;
    window.location.hash = newHash;

    // Check all known routes.
    for (const [pattern, handler, requirements, pageName] of routes) {
        if (path.match(pattern)) {
            console.debug(`Routing '${path}' to ${handler.name}.`);
            return handlerWrapper(handler, path, params, pageName, requirements);
        }
    }

    // Fallback to the default route.
    console.warn(`Unknown path '${path}'. Falling back to default route.`);
    return handlerWrapper(DEFAULT_HANDLER, path, params, undefined, {});
}

// Parse a raw path (which may have come from a hash)
// into a clean path and params (which can be empty).
function parsePath(rawPath) {
    rawPath = Core.basicPathClean(rawPath);

    // Parse the raw path as a url to pull out parameters.
    let url = URL.parse(rawPath, 'http://localhost');

    // Pull out the path (which comes with a leading slash).
    let path = url.pathname.replace(/^\//, '');

    // Pull out the params into a simple object.
    let rawParams = url.searchParams;
    rawParams.sort();

    let params = {};
    for (const [key, value] of rawParams.entries()) {
        params[key] = value;
    }

    return [path, params];
}

// Do any setup for a handler, call the handler, then do any teardown.
function handlerWrapper(handler, path, params, pageName, requirements, context = {}) {
    let loggedIn = Autograder.hasCredentials();

    // Redirect to a login if required.
    if (requirements.login && !loggedIn) {
        return Core.redirectLogin();
    }

    // Anything that needs a login also needs a context user.
    context.user = Core.getContextUser();
    if (requirements.login && !context.user) {
        return fetchContextUser()
            .then(function(result) {
                // Call this function again to complete all checks.
                return handlerWrapper(handler, path, params, pageName, requirements);
            })
            .catch(function(result) {
                return Core.redirectLogout();
            });
    }

    // Check course.
    if (requirements.course) {
        context.courseID = params['course-id'];
        if (!context.courseID) {
            Log.warn(`No course id specified for path '${path}'.`, context);
            return Core.redirectHome();
        }

        context.course = context.user.courses[context.courseID];
        if (!context.course) {
            Log.warn(`Could not find specified course ('${context.courseID}') for path '${path}'.`, context);
            return Core.redirectHome();
        }
    }

    // Check assignment.
    if (requirements.assignment) {
        context.assignmentID = params['assignment-id'];
        if (!context.assignmentID) {
            Log.warn(`No assignment id specified for path '${path}'.`, context);
            return Core.redirectHome();
        }

        // Fetch the assignment and re-call the wrapper (with additional context).
        if (!context.assignment) {
            // Non-trivial route.
            Core.loading();

            return Autograder.Assignments.get(context.courseID, context.assignmentID)
                .then(function(result) {
                    context.assignment = result.assignment;
                    return handlerWrapper(handler, path, params, pageName, requirements, context);
                })
                .catch(function(result) {
                    Log.warn(result, context);
                    return Core.redirectHome();
                });
        }
    }

    // This path has everything it needs.

    // Set the nav menu.
    Core.setNav();

    // Set the context user.
    if (context.user) {
        let name = context.user.name ?? context.user.email;
        document.querySelector('.header .current-user').innerHTML = `
            <div>
                <span>Logged in as</span>
                <br />
                <span>${name}</span>
            </div>
        `;
    }

    // Set the page inforamtion.
    if (pageName) {
        document.querySelector('.content').setAttribute('data-page', pageName);
    }

    // Call the handler.
    return handler(path, params, context);
}

function fetchContextUser() {
    if (Core.getContextUser()) {
        return Promise.resolve(Core.getContextUser());
    }

    // Non-trivial route.
    Core.loading();

    return Autograder.Users.get()
        .then(function(result) {
            if (!result.found) {
                Log.warn("Server could not find context user.");
                return Promist.reject(result);
            }

            Core.setContextUser(result.user);
            return result.user;
        })
        .catch(function(result) {
            Log.warn(result);
            return result;
        });
}

function handlerNotFound(path, params) {
    document.querySelector('.content').innerHTML = `
        <h2>Location Not Found</h2>
        <p>We could not find the location '${path}'.</p>
    `;
}

export {
    init,
    addRoute,
    route,
}
