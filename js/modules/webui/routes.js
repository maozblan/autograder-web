import * as Core from './core.js'
import * as Home from './home.js'
import * as Login from './login.js'

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

    // Set the default nav.
    Core.setNav();

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

function handlerNotFound(path, params) {
    document.querySelector('.content').innerHTML = `
        <h2>Location Not Found</h2>
        <p>We could not find the location '${path}'.</p>
    `;
}

function handlerAccount(path, params) {
    // TEST
    console.log("Account");
}

function handlerCourse(path, params) {
    // TEST
    console.log("Course");
    console.log(params);
}

const DEFAULT_ROUTE = handlerNotFound
const ROUTES = [
    [/^$/, Home.handlerHome],
    [/^login$/, Login.handlerLogin],
    [/^logout$/, Login.handlerLogout],
];

export {
    init,
    route,
}
