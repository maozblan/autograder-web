import * as Autograder from './modules/autograder/base.js'
import * as WebUI from './modules/webui/base.js'

// TEST - Remove these.

function login(button) {
    if (Autograder.hasCredentials()) {
        WebUI.Util.warn("Already logged in. Logout first to login again.");
        return;
    }

    let email = button.parentElement.querySelector('input[name="email"]').value;
    let cleartext = button.parentElement.querySelector('input[name="password"]').value;

    if (email.length < 1) {
        WebUI.Util.warn("No email provided for login.");
        return;
    }

    if (cleartext.length < 1) {
        WebUI.Util.warn("No password provided for login.");
        return;
    }

    Autograder.Users.createToken(email, cleartext)
        .then(function(token) {
            Autograder.setCredentials(email, token['token-id'], token['token-cleartext']);
            WebUI.Util.notify("Logged In");
        })
        .catch(WebUI.Util.warn);
}

function history(button) {
    if (!Autograder.hasCredentials()) {
        WebUI.Util.warn("Must login first.");
        return;
    }

    let course = button.parentElement.querySelector('input[name="course"]').value;
    let assignment = button.parentElement.querySelector('input[name="assignment"]').value;

    if (course.length < 1) {
        WebUI.Util.warn("No course provided for history.");
        return;
    }

    if (assignment.length < 1) {
        WebUI.Util.warn("No assignment provided for history.");
        return;
    }

    Autograder.Submissions.history(course, assignment)
        .then(function(result) {
            let text = JSON.stringify(result, null, 4);
            button.parentElement.querySelector('.result-area').textContent = text;
        })
        .catch(WebUI.Util.warn);
}

function peek(button) {
    if (!Autograder.hasCredentials()) {
        WebUI.Util.warn("Must login first.");
        return;
    }

    let course = button.parentElement.querySelector('input[name="course"]').value;
    let assignment = button.parentElement.querySelector('input[name="assignment"]').value;
    let submission = button.parentElement.querySelector('input[name="submission"]').value;

    if (course.length < 1) {
        WebUI.Util.warn("No course provided for peek.");
        return;
    }

    if (assignment.length < 1) {
        WebUI.Util.warn("No assignment provided for peek.");
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
        .catch(WebUI.Util.warn);
}

function submit(button) {
    if (!Autograder.hasCredentials()) {
        WebUI.Util.warn("Must login first.");
        return;
    }

    let course = button.parentElement.querySelector('input[name="course"]').value;
    let assignment = button.parentElement.querySelector('input[name="assignment"]').value;
    let files = button.parentElement.querySelector('input[name="files"]').files;

    if (course.length < 1) {
        WebUI.Util.warn("No course provided for peek.");
        return;
    }

    if (assignment.length < 1) {
        WebUI.Util.warn("No assignment provided for peek.");
        return;
    }

    if (files.length < 1) {
        WebUI.Util.warn("No submission files provided.");
        return;
    }

    Autograder.Submissions.submit(course, assignment, files)
        .then(function(result) {
            let text = JSON.stringify(result, null, 4);
            button.parentElement.querySelector('.result-area').textContent = text;
        })
        .catch(WebUI.Util.warn);
}

function logout() {
    Autograder.clearCredentials();
}

function getContextUser(button) {
    Autograder.Users.get()
        .then(function(result) {
            let text = JSON.stringify(result, null, 4);
            button.parentElement.querySelector('.result-area').textContent = text;
        })
        .catch(WebUI.Util.warn);
}

function initHandlers() {
    window.ag = window.ag || {};
    window.ag.handlers = window.ag.handlers || {};

    // window.ag.handlers.login = login;
    window.ag.handlers.logout = logout;
    window.ag.handlers.history = history;
    window.ag.handlers.peek = peek;
    window.ag.handlers.submit = submit;
    window.ag.handlers.getContextUser = getContextUser;
}

function main() {
    initHandlers();
    WebUI.init();
}

document.addEventListener("DOMContentLoaded", main);
