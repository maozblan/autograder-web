import * as Home from './home.js'
import * as Login from './login.js'
import * as Routing from './routing.js'
import * as System from './system.js'
import * as Util from './util.js'

function init() {
    System.init();
    Home.init();
    Login.init();

    // Init routes last (since it will route).
    Routing.init();
}

export {
    init,
}
