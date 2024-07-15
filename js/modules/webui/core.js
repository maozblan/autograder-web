let contextUser = undefined;

function getContextUser() {
    return contextUser;
}

function setContextUser(user) {
    contextUser = user;
}

function loading() {
    // TODO
    console.log("Loading");
}

function setNav(items) {
    let navHTML = [`<ul class='nav'>`];

    for (const [name, link] of items) {
        navHTML.push(`<li><a href='${link}'>${name}</a></li>`);
    }

    navHTML.push('<ul>');

    document.querySelector('.nav').innerHTML = navHTML.join('');
}

function redirect(path = '') {
    window.location.hash = path;
}

export {
    getContextUser,
    setContextUser,
    redirect,

    loading,
    setNav,
}
