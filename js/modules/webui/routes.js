import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Login from './login.js'
import * as Util from './util.js'

let currentHash = undefined;

// Start listening for routing events and do an initial route.
function init() {
    window.addEventListener("hashchange", function() {
        route();
    });

    route();
}

// Route the page content to a path specified in an argument or window.location.hash.
function route(rawPath = undefined) {
    if (!rawPath) {
        rawPath = window.location.hash;
    }

    // Clean the raw path and remove a leading hash.
    rawPath = rawPath.trim().replace(/^#\s*/, '');

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

    // Form the canonical path we are on.
    let newHash = path;
    if (rawParams.length > 0) {
        newHash += `?${rawParams.toString}`;
    }

    // Skip any routing if we are on the current path.
    // This let's is avoid infinite loops when routing internally.
    if (newHash == currentHash) {
        return;
    }

    // Set the hash to the cleaned-up value.
    currentHash = newHash;
    window.location.hash = newHash;

    // Check all known routes.
    for (const [pattern, handler] of ROUTES) {
        if (path.match(pattern)) {
            console.debug(`Routing '${path}' to ${handler.name}.`);
            return handler(path, params);
        }
    }

    // Fallback to the default route.
    console.warn(`Unknown path '${path}'. Falling back to default route.`);
    return DEFAULT_ROUTE(path, params);
}

function handlerHome(path, params) {
    // Go to login page if not logged in.
    if (!Autograder.hasCredentials()) {
        return route('login');
    }

    Core.setNav([
        ['Logout', '#logout'],
    ]);

    // Fetch context user if not currently set (then retry this handler).
    if (!Core.getContextUser()) {
        Core.loading();

        Autograder.Users.get()
            .then(function(result) {
                if (!result.found) {
                    Util.warn("Server could not find context user.");
                    return handlerLogout(path, params);
                }

                Core.setContextUser(result.user);
                return handlerHome(path, params);
            })
            .catch(function(result) {
                Util.warn(result);
                return handlerLogout(path, params);
            });

        return;
    }

    // TODO
    let text = JSON.stringify(Core.getContextUser(), null, 4);
    document.querySelector('.content').innerHTML = `<pre>${text}</pre>`;
}

const DEFAULT_ROUTE = handlerHome
const ROUTES = [
    [/^$/, handlerHome],
    [/^login$/, Login.handlerLogin],
    [/^logout$/, Login.handlerLogout],
];

export {
    init,
    route,
}
