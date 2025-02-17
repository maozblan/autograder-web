import * as Autograder from '../autograder/base.js'
import * as Context from './context.js'
import * as Log from './log.js'
import * as Routing from './routing.js'

function init() {
    Routing.addRoute(/^login$/, handlerLogin, 'Login', {login: false});
    Routing.addRoute(/^logout$/, handlerLogout, 'Logout');
}

function handlerLogin(path, params, context, container) {
    container.innerHTML = `
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
            <button>Login</button>
        </div>
    `;

    container.querySelectorAll('.login input').forEach(function(element) {
        element.addEventListener('keydown', function(event) {
            if (event.code != 'Enter') {
                return
            }

            let email = container.querySelector('input[name="email"]').value;
            let cleartext = container.querySelector('input[name="password"]').value;

            login(email, cleartext);
        });
    });

    container.querySelector('.login button').addEventListener('click', function(event) {
        let email = container.querySelector('input[name="email"]').value;
        let cleartext = container.querySelector('input[name="password"]').value;

        login(email, cleartext);
    });
}

function handlerLogout(path, params, context, container) {
    Context.clear();
    Autograder.clearCredentials();
    Routing.redirectLogin();
}

function login(email, cleartext) {
    if (Autograder.hasCredentials()) {
        Log.warn("Already logged in. Logout first to login again.");
        return;
    }

    if (email.length < 1) {
        Log.warn("No email provided for login.")
        return;
    }

    if (cleartext.length < 1) {
        Log.warn("No password provided for login.")
        return;
    }

    Routing.loadingStart();

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            Routing.redirectHome();
        })
        .catch(function(result) {
            Log.warn("Unable to login.", result);
        })
        .finally(function() {
            Routing.loadingStop();
        })
    ;
}

export {
    init,
    login,
}
