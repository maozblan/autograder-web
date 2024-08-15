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
    document.querySelector('.content').innerHTML = '<h1>LOADING ...</h1>';
}

// Add the base navigation items (e.g., home and login/logout)
// to the given name items and return the modified list.
function getBaseNav(items = []) {
    if (Autograder.hasCredentials()) {
        items.unshift(makeNavItem('Home', formHashPath('')));
        items.push(makeNavItem('Account', formHashPath('account')));
        items.push(makeNavItem('Logout', formHashPath('logout')));
    } else {
        items.push(makeNavItem('Login', formHashPath('login')));
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
        items.push(makeNavItem(courseInfo.name, formHashPath('course', {'course-id': courseInfo.id})));
    }

    return items;
}

// The elements in |items|, |breadcrumbs|, and the elements in the values of |submenus|
// should all be constructed via makeNavItem().
// If not deselected, most nav items will be handled automatically.
// |submenus| allows for callers to insert items below an existing nav item (a submenu),
// formatted as follows: {<parent name>: [[name, link], ...], ...}.
// When a submenu is active, the parent will also be active.
function setNav(items = [],
        includeContextUser = true, includeBase = true,
        submenus = {}, breadcrumbs = []) {
    renderNav(items, includeContextUser, includeBase, submenus);
    renderBreadcrumbs(breadcrumbs);
}

function renderNav(items, includeContextUser, includeBase, submenus) {
    let nodes = buildNavTree(items, includeContextUser, includeBase, submenus);

    let navHTML = [`<div class='nav-items'>`];
    for (const node of nodes) {
        navHTML.push(navNodeToHTML(node));
    }
    navHTML.push('</div>');

    document.querySelector('.nav').innerHTML = navHTML.join('');
}

function renderBreadcrumbs(breadcrumbs, includeHome = true) {
    if (includeHome) {
        breadcrumbs.unshift(makeNavItem('Home', ''));
    }

    let breadcrumbsHTML = [];
    for (let i = 0; i < breadcrumbs.length; i++) {
        let breadcrumb = breadcrumbs[i];

        if (i > 0) {
            breadcrumbsHTML.push(`<span class='breadcrumb-delim'>&gt;&gt;</span>`);
        }

        breadcrumbsHTML.push(`
            <a class='breadcrumb' href='${breadcrumb.link}'>${breadcrumb.name}</a>
        `);
    }

    let html = `
        <div>
            ${breadcrumbsHTML.join('')}
        </div>
    `;

    document.querySelector('.breadcrumbs').innerHTML = html;
}

// Add all context nav items, add submenus, and mark entries as active.
function buildNavTree(items, includeContextUser, includeBase, submenus) {
    if (includeContextUser) {
        items = getContextUserNav(items);
    }

    if (includeBase) {
        items = getBaseNav(items);
    }

    let [nodes, _] = makeNavNodes(items, submenus);
    return nodes;
}

// Return true if one of the nodes is active.
function makeNavNodes(items = [], submenus = {}) {
    if (!items) {
        return [[], false];
    }

    let currentHash = Util.getLocationHash();

    let nodes = [];
    let foundActive = false;

    for (const item of items) {
        let pathActive = (item.link === currentHash);
        let [children, childrenActive] = makeNavNodes(submenus[item.name], submenus);
        let active = item.active || pathActive || childrenActive;

        let node = {
            name: item.name,
            link: item.link,
            active: active,
            children: children,
        };

        nodes.push(node);
        foundActive = foundActive || active;
    }

    return [nodes, foundActive];
}

function navNodeToHTML(node) {
    let classes = [];
    if (node.active) {
        classes.push('active');
    }

    let lines = [
        `<div class='nav-item'>
            <a class='${classes.join(' ')}' data-name='${node.name}' href='${node.link}'>${node.name}</a>
        `,
    ];

    if (node.children && (node.children.length > 0)) {
        lines.push(`<div class='nav-children'>`);
        for (const child of node.children) {
            lines.push(navNodeToHTML(child));
        }
        lines.push('</div>');
    }

    lines.push('</div>');

    return lines.join('');
}

function makeNavItem(name, link, active = false) {
    return {
        name: name,
        link: link,
        active: active,
    };
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
    renderBreadcrumbs,

    loading,
    setNav,

    makeNavItem,
}
