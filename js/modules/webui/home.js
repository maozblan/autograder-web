import * as Routing from './routing.js'

function init() {
    Routing.addRoute(/^$/, handlerHome, 'Home');
}

function handlerHome(path, params, context, container) {
    // TEST
    container.innerHTML = `
        <p>Welcome to the EduLinq Autograder.</p>
        <p>TODO: Intorduction</p>
        <p>TODO: Basic Instructions</p>
        <p>TODO: Links to other resources</p>
    `;
}

export {
    init,
}
