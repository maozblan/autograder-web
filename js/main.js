import * as Autograder from './modules/autograder/base.js'

function notify(message) {
    console.info(message);
    alert(message);
}

function warn(message) {
    console.warn(message);
    alert(message);
}

function login(button) {
    if (Autograder.hasCredentials()) {
        warn("Already logged in. Logout first to login again.");
        return;
    }

    let email = button.parentElement.querySelector('input[name="email"]').value;
    let cleartext = button.parentElement.querySelector('input[name="password"]').value;

    if (email.length < 1) {
        warn("No email provided for login.");
        return;
    }

    if (cleartext.length < 1) {
        warn("No password provided for login.");
        return;
    }

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            notify("Logged In");
        })
        .catch(warn);
}

function history(button) {
    if (!Autograder.hasCredentials()) {
        warn("Must login first.");
        return;
    }

    let course = button.parentElement.querySelector('input[name="course"]').value;
    let assignment = button.parentElement.querySelector('input[name="assignment"]').value;

    if (course.length < 1) {
        warn("No course provided for history.");
        return;
    }

    if (assignment.length < 1) {
        warn("No assignment provided for history.");
        return;
    }

    Autograder.Submissions.history(course, assignment)
        .then(function(result) {
            let text = JSON.stringify(result, null, 4);
            button.parentElement.querySelector('.result-area').textContent = text;
        })
        .catch(warn);
}

function peek(button) {
    if (!Autograder.hasCredentials()) {
        warn("Must login first.");
        return;
    }

    let course = button.parentElement.querySelector('input[name="course"]').value;
    let assignment = button.parentElement.querySelector('input[name="assignment"]').value;
    let submission = button.parentElement.querySelector('input[name="submission"]').value;

    if (course.length < 1) {
        warn("No course provided for peek.");
        return;
    }

    if (assignment.length < 1) {
        warn("No assignment provided for peek.");
        return;
    }

    if (submission.length < 1) {
        submission = null;
    }

    Autograder.Submissions.peek(course, assignment, submission)
        .then(function(result) {
            let text = JSON.stringify(result, null, 4);
            button.parentElement.querySelector('.result-area').textContent = text;
        })
        .catch(warn);
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
    window.ag.handlers.history = history;
    window.ag.handlers.peek = peek;
}

function main() {
    initHandlers();
}

document.addEventListener("DOMContentLoaded", main);
