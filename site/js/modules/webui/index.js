import * as Courses from './courses/index.js';
import * as Home from './home.js';
import * as Login from './login.js';
import * as Routing from './routing.js';
import * as Server from './server/index.js';
import * as System from './system.js';
import * as Util from './util/index.js';

function init(initialRoute = false) {
    // TEST - initial route (modules will self-init now).
    // TEST - Maybe main.js should just route() instead?


    // Init base libs.
    System.init();

    // Init handlers.
    Home.init();
    Login.init();

    // Init routes last (since it will route).
    Routing.init(initialRoute);
}

export {
    init,
};
