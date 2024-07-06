import * as Autograder from './modules/autograder/base.js'

function notify(message) {
    console.warn(message);
    alert(message);
}

function login(button) {
    if (Autograder.hasCredentials()) {
        notify("Already logged in. Logout first to login again.");
        return;
    }

    let email = button.parentElement.querySelector('input[name="email"]').value;
    let cleartext = button.parentElement.querySelector('input[name="password"]').value;

    if (email.length < 1) {
        notify("No email provided for login.");
        return;
    }

    if (cleartext.length < 1) {
        notify("No password provided for login.");
        return;
    }

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
        })
        .catch(notify);
}

function logout() {
    Autograder.clearCredentials();

    // TODO(eriq): Destroy the token on the server side.
}

function initHandlers() {
    window.ag = window.ag || {};
    window.ag.handlers = window.ag.handlers || {};

    window.ag.handlers.login = login;
    window.ag.handlers.logout = logout;
}

function main() {
    initHandlers();
}

document.addEventListener("DOMContentLoaded", main);
