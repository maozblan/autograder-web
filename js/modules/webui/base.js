import * as Core from './core.js'
import * as Course from './course.js'
import * as Home from './home.js'
import * as Login from './login.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    _initHandlers();

    // Init utils first.
    Util.init();

    Course.init();
    Home.init();
    Login.init();

    // Init routes last (since it will route).
    Routes.init();
}

function _initHandlers() {
    window.ag = window.ag || {};
    window.ag.handlers = window.ag.handlers || {};

    window.ag.handlers.login = Login.login;
}

export {
    Routes,
    Util,

    init,
}
