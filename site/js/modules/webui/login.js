import * as Autograder from '../autograder/base.js'

import * as Context from './context.js'
import * as Render from './render.js'
import * as Routing from './routing.js'

function init() {
    Routing.addRoute(/^login$/, handlerLogin, 'Login', {login: false});
    Routing.addRoute(/^logout$/, handlerLogout, 'Logout');
}

function handlerLogin(path, params, context, container) {
    container.innerHTML = `
        <div class='login'>
            <div class='login-controls page-controls'>
                <div>
                    <label for='email'>Email:</label>
                    <input type='email' name='email' placeholder='email' autofocus />
                </div>
                <div>
                    <label for='password'>Password:</label>
                    <input type='password' name='password' placeholder='password' />
                </div>
                <button>Login</button>
            </div>
            <div class='login-results'>
            </div>
        </div>
    `;

    let button = container.querySelector('.login-controls button');
    let emailInput = container.querySelector('.login-controls input[name="email"]');
    let passwordInput = container.querySelector('.login-controls input[name="password"]');
    let results = container.querySelector('.login-results');

    function doLogin() {
        let email = emailInput.value;
        let password = passwordInput.value;

        if (!email || !password) {
            return;
        }

        // Avoid duplicate submissions.
        emailInput.value = '';
        passwordInput.value = '';

        login(email, password, results);
    }

    container.querySelectorAll('.login-controls input').forEach(function(element) {
        element.addEventListener('keydown', function(event) {
            if (!['Enter', 'NumpadEnter'].includes(event.code)) {
                return
            }

            doLogin()
        });
    });

    button.addEventListener('click', function(event) {
        doLogin()
    });
}

function handlerLogout(path, params, context, container) {
    Context.clear();
    Autograder.clearCredentials();
    Routing.redirectLogin();
}

function login(email, cleartext, container) {
    if (Autograder.hasCredentials()) {
        container.innerHTML = `
            <p>Already logged in.</p>
            <p>Logout first to login again.</p>
        `;
        return;
    }

    if (email.length < 1) {
        container.innerHTML = `<p>No email provided for login.</p>`;
        return;
    }

    if (cleartext.length < 1) {
        container.innerHTML = `<p>No password provided for login.</p>`;
        return;
    }

    Routing.loadingStart(container);

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            container.innerHTML = `<p>Successfully logged in.</p>`;
            Routing.redirectHome();
        })
        .catch(function(message) {
            container.innerHTML = Render.autograderError(message);
        })
    ;
}

export {
    init,
    login,
}
