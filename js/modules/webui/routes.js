import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Util from './util.js'

let routes = [];

const DEFAULT_HANDLER = _handlerNotFound

// The current hash/location we are routed to.
// Should be prefixed with a hash symbol.
let _currentHash = undefined;

// Start listening for routing events and do an initial route.
function init() {
    window.addEventListener("hashchange", function() {
        route();
    });

    route();
}

function addRoute(pattern, handler, requiresLogin = true) {
    routes.push([pattern, handler, requiresLogin]);
}

// Route the page content to a path specified in an argument or window.location.hash.
function route(rawPath = undefined) {
    if (!rawPath) {
        rawPath = Util.getLocationHash();
    }

    let [path, params] = _parsePath(rawPath);

    // Form the canonical path we are on.
    let newHash = Core.formHashPath(path, params);

    // Skip any routing if we are on the current path.
    // This let's us avoid infinite loops when routing internally.
    if (newHash == _currentHash) {
        return;
    }

    // Set the hash to the cleaned-up value.
    _currentHash = newHash;
    window.location.hash = newHash;

    // Check all known routes.
    for (const [pattern, handler, requiresLogin] of routes) {
        if (path.match(pattern)) {
            console.debug(`Routing '${path}' to ${handler.name}.`);
            return _handlerWrapper(handler, path, params, requiresLogin);
        }
    }

    // Fallback to the default route.
    console.warn(`Unknown path '${path}'. Falling back to default route.`);
    return _handlerWrapper(DEFAULT_HANDLER, path, params, requiresLogin);
}

// Parse a raw path (which may have come from a hash)
// into a clean path and params (which can be empty).
function _parsePath(rawPath) {
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
function _handlerWrapper(handler, path, params, requiresLogin) {
    let loggedIn = Autograder.hasCredentials();

    // Redirect to a login if required.
    if (requiresLogin && !loggedIn) {
        return Core.redirectLogin();
    }

    // Anything that needs a login also needs a context user.
    if (requiresLogin && !Core.getContextUser()) {
        return _fetchContextUser()
            .then(function(result) {
                Core.setNav();
                return handler(path, params);
            })
            .catch(function(result) {
                return Core.redirectLogout();
            });
    }

    // This path has everything it needs.
    Core.setNav();
    return handler(path, params);
}

function _fetchContextUser() {
    if (Core.getContextUser()) {
        return Promise.resolve(Core.getContextUser());
    }

    Core.loading();

    return Autograder.Users.get()
        .then(function(result) {
            if (!result.found) {
                Util.warn("Server could not find context user.");
                return Promist.reject(result);
            }

            Core.setContextUser(result.user);
            return result.user;
        })
        .catch(function(result) {
            Util.warn(result);
            return result;
        });
}

function _handlerNotFound(path, params) {
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
