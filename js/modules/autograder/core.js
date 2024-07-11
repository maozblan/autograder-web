import * as Util from './util.js'

const API_VESION = 'v03';
const CREDENTIALS_KEY = 'AUTOGRADER.CREDENTIALS';

const REQUEST_USER_EMAIL_KEY = 'user-email';
const REQUEST_USER_PASS_KEY = 'user-pass';

function hasCredentials() {
    return Boolean(localStorage.getItem(CREDENTIALS_KEY));
}

function getCredentials() {
    let credentials = localStorage.getItem(CREDENTIALS_KEY);
    if (credentials) {
        return JSON.parse(credentials);
    }

    return undefined;
}

function setCredentials(email, id, cleartext) {
    let credentials = {
        'email': email,
        'token-id': id,
        'token': Util.sha256(cleartext),
    };

    return localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(credentials));
}

function clearCredentials() {
    localStorage.removeItem(CREDENTIALS_KEY);
}

async function _resolveAPIResponse(response) {
    let body = await response.json();

    if (!body.success) {
        if (response.status == 401) {
            // Shorten the message for auth error.
            return Promise.reject(body.message);
        }

        return Promise.reject(`Autograder API call failed: '${body.message}'.`);
    }

    return Promise.resolve(body.content);
}

async function _resolveAPIError(response) {
    console.error("Failed to send API request to autograder.");
    console.error(response);

    let body = await response.text();
    console.error(body);

    return Promise.reject(body);
}

function sendRequest(endpoint, payload = {},
        override_email = undefined, override_cleartext = undefined) {
    let credentials = getCredentials();

    if (credentials) {
        payload[REQUEST_USER_EMAIL_KEY] = credentials.email;
        payload[REQUEST_USER_PASS_KEY] = credentials.token;
    }

    if (override_email) {
        payload[REQUEST_USER_EMAIL_KEY] = override_email;
    }

    if (override_cleartext) {
        payload[REQUEST_USER_PASS_KEY] = Util.sha256(override_cleartext);
    }

    let url = `/api/${API_VESION}/${endpoint}`;

    let body = new FormData();
    body.set('content', JSON.stringify(payload));

    let response = fetch(url, {
        'method': 'POST',
        'body': body,
    });

    return response.then(_resolveAPIResponse, _resolveAPIError);
}

export {
    hasCredentials,
    setCredentials,
    clearCredentials,

    sendRequest,
}
