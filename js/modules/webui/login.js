import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Log from './log.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    Routes.addRoute(/^login$/, handlerLogin, {login: false});
    Routes.addRoute(/^logout$/, handlerLogout);
}

function handlerLogin(path, params, context) {
    let content = `
        <h2>Login</h2>
        <div class='login'>
            <div>
                <label for='email'>Email:</label>
                <input type='email' name='email' placeholder='email'
                        onkeypress='window.ag.util.onKeyEvent(event, this, ["Enter"], window.ag.handlers.login)' />
            </div>
            <div>
                <label for='password'>Password:</label>
                <input type='password' name='password' placeholder='password'
                        onkeypress='window.ag.util.onKeyEvent(event, this, ["Enter"], window.ag.handlers.login)' />
            </div>
            <button onclick='window.ag.handlers.login(null, this)'>Login</button>
        </div>
    `;

    document.querySelector('.content').innerHTML = content;
}

function handlerLogout(path, params, context) {
    Core.clearContextUser();
    Autograder.clearCredentials();
    return Core.redirectLogin();
}

function login(event, context) {
    if (Autograder.hasCredentials()) {
        Log.warn("Already logged in. Logout first to login again.", context);
        return;
    }

    let container = Util.queryAncestor(context, 'div.login');
    let email = container.querySelector('input[name="email"]').value;
    let cleartext = container.querySelector('input[name="password"]').value;

    if (email.length < 1) {
        Log.warn("No email provided for login.", context);
        return;
    }

    if (cleartext.length < 1) {
        Log.warn("No password provided for login.", context);
        return;
    }

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            Core.redirectHome();
        })
        .catch(Log.warn);
}

export {
    init,
    login,
}
