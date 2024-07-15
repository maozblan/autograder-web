import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Util from './util.js'

function handlerLogin(path, params) {
    Core.setNav([
        ['Login', '#login'],
    ]);

    let content = `
        <h2>Login</h2>
        <div class='login'>
            <div>
                <label for='email'>Email:</label>
                <input type='email' name='email' placeholder='email' />
            </div>
            <div>
                <label for='password'>Password:</label>
                <input type='password' name='password' placeholder='password' />
            </div>
            <button onclick='window.ag.handlers.login(this)'>Login</button>
        </div>
    `;

    document.querySelector('.content').innerHTML = content;
}

function handlerLogout(path, params) {
    Autograder.clearCredentials();
    return handlerLogin(path, params);
}

function login(button) {
    if (Autograder.hasCredentials()) {
        Util.warn("Already logged in. Logout first to login again.");
        return;
    }

    let email = button.parentElement.querySelector('input[name="email"]').value;
    let cleartext = button.parentElement.querySelector('input[name="password"]').value;

    if (email.length < 1) {
        Util.warn("No email provided for login.");
        return;
    }

    if (cleartext.length < 1) {
        Util.warn("No password provided for login.");
        return;
    }

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            Core.redirect();
        })
        .catch(Util.warn);
}

export {
    handlerLogin,
    handlerLogout,
    login,
}
