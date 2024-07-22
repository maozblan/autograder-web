import * as Autograder from '/js/modules/autograder/base.js'
import * as Util from './util.js'

let contextUser = undefined;

function getContextUser() {
    return contextUser;
}

function setContextUser(user) {
    contextUser = user;
}

function clearContextUser() {
    contextUser = undefined;
}

// Get the (sorted) list of courses for the context user,
// undefined if there is no context user.
function getContextCourses() {
    if (!contextUser) {
        return undefined;
    }

    let sortedCourses = Object.values(contextUser.courses).sort(function(a, b) {
        return Util.caseInsensitiveStringCompare(a.name, b.name);
    });

    return sortedCourses;
}

// Form a path (location.hash).
// The returned path will be standardized so it can be compared directly,
// and include a leading hash symbol.
function formHashPath(path, params = {}) {
    path = basicPathClean(path);

    // Create a fake URL for parsing and formatting.
    let url = URL.parse(path, 'http://localhost');

    // Add the params.
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
    }

    // Sort the params.
    url.searchParams.sort();

    // Pull out the path (which comes with a leading slash).
    path = url.pathname.replace(/^\//, '');

    // Add on the params
    // (empty if there are none and includes the leading '?' if there are).
    path += url.search;

    return '#' + path;
}

function basicPathClean(path) {
    path = path.trim();

    // Remove leading hashes, slashes, and spaces.
    path = path.replace(/^[\s\/#]+/, '');

    // Remove tailing slashes and spaces.
    path = path.replace(/[\/\s]+$/, '');

    return path;
}

function loading() {
    // TODO
    console.log("Loading");
}

// Add the base navigation items (e.g., home and login/logout)
// to the given name items and return the modified list.
function getBaseNav(items = []) {
    if (Autograder.hasCredentials()) {
        items.unshift(['Home', formHashPath('')]);
        items.push(['Account', formHashPath('account')]);
        items.push(['Logout', formHashPath('logout')]);
    } else {
        items.push(['Login', formHashPath('login')]);
    }

    return items;
}

// Add the navigation items (e.g. courses) for the context user
// to the given name items and return the modified list.
function getContextUserNav(items = []) {
    if (!contextUser) {
        return items;
    }

    for (const courseInfo of getContextCourses()) {
        items.push([courseInfo.name, formHashPath('course', {id: courseInfo.id})]);
    }

    return items;
}

// The passed in items should be: [[name, link], ...].
// If not deselected, most nav items will be handled automatically.
function setNav(items = [], includeContextUser = true, includeBase = true) {
    if (includeContextUser) {
        items = getContextUserNav(items);
    }

    if (includeBase) {
        items = getBaseNav(items);
    }

    let currentHash = Util.getLocationHash();
    let navHTML = [`<ul class='nav'>`];

    for (const [name, link] of items) {
        let classes = [];

        // Check to see if this nav item is the active one.
        if (link === currentHash) {
            classes.push('active');
        }

        navHTML.push(`<li><a class='${classes.join(' ')}' href='${link}'>${name}</a></li>`);
    }

    navHTML.push('<ul>');

    document.querySelector('.nav').innerHTML = navHTML.join('');
}

function redirect(path = '') {
    window.location.hash = path;
}

// Common redirection shortcuts.

function redirectHome() {
    redirect('');
}

function redirectLogin() {
    redirect('login');
}

function redirectLogout() {
    redirect('logout');
}

export {
    basicPathClean,
    clearContextUser,
    formHashPath,
    getContextCourses,
    getContextUser,
    setContextUser,
    redirect,
    redirectHome,
    redirectLogin,
    redirectLogout,

    loading,
    setNav,
}
