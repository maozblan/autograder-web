import * as Assignment from './assignment.js'
import * as Core from './core.js'
import * as Course from './course.js'
import * as Home from './home.js'
import * as Log from './log.js'
import * as Login from './login.js'
import * as Routing from './routing.js'
import * as User from './user.js'
import * as Util from './util.js'

function init() {
    initHandlers();

    // Init utils first.
    Log.init();
    Util.init();

    Assignment.init();
    Course.init();
    Home.init();
    Login.init();
    User.init();

    // Init routes last (since it will route).
    Routing.init();
}

function initHandlers() {
    window.ag = window.ag || {};
    window.ag.handlers = window.ag.handlers || {};

    window.ag.handlers.login = Login.login;
}

export {
    Routing,
    Util,

    init,
}
