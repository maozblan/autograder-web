import * as Core from './core.js'
import * as Login from './login.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    _initHandlers();

    Routes.init();
    Util.init();
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
