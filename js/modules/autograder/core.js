import * as Util from './util.js'

const API_VESION = 'v03';
const CREDENTIALS_KEY = 'AUTOGRADER.CREDENTIALS';

const REQUEST_USER_EMAIL_KEY = 'user-email';
const REQUEST_USER_PASS_KEY = 'user-pass';

let cache = {};

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

function clearCredentials(sendDelete = true) {
    let credentials = getCredentials();
    localStorage.removeItem(CREDENTIALS_KEY);

    if (!credentials) {
        return Promise.resolve({'found': false});
    }

    if (!sendDelete) {
        return Promise.resolve({'found': true});
    }

    return deleteToken(credentials);
}

// Delete the context token.
function deleteToken(credentials) {
    let args = {
        [REQUEST_USER_EMAIL_KEY]: credentials['email'],
        'token-id': credentials['token-id'],
        [REQUEST_USER_PASS_KEY]: credentials['token'],
    };

    return sendRequest({
        endpoint: 'users/tokens/delete',
        payload: args,
        cache: false,
    });
}

async function resolveAPIResponse(response) {
    let body = await response.json();

    if (!body.success) {
        if (response.status == 401) {
            // Clear any credentials in the cache.
            clearCredentials(false);

            // Shorten the message for auth error.
            return Promise.reject(body.message);
        }

        return Promise.reject(`Autograder API call failed: '${body.message}'.`);
    }

    return Promise.resolve(body.content);
}

async function resolveAPIError(response) {
    console.error("Failed to send API request to autograder.");
    console.error(response);

    if (!response.text) {
        return Promise.reject(response);
    }

    let body = await response.text();
    console.error(body);

    return Promise.reject(body);
}

function sendRequest({
        endpoint = undefined,
        payload = {}, files = [],
        override_email = undefined, override_cleartext = undefined,
        cache = true,
        }) {
    if (!endpoint) {
        throw new Error("Endpoint not specified.")
    }

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

    for (const file of files) {
        body.append(file.name, file);
    }

    if (cache) {
        let cacheResponse = fetchCache(url, payload);
        if (cacheResponse) {
            return Promise.resolve(cacheResponse);
        }
    }

    let response = fetch(url, {
        'method': 'POST',
        'body': body,
    });

    let resolveSuccess = resolveAPIResponse;
    if (cache) {
        resolveSuccess = function(result) {
            return resolveAPIResponse(result).then(function(content) {
                saveCache(url, payload, content);
                return Promise.resolve(content);
            });
        }
    }

    return response.then(resolveSuccess, resolveAPIError);
}

function fetchCache(url, payload) {
    let key = makeCacheKey(url, payload);
    let entry = cache[key];
    if (!entry) {
        return undefined;
    }

    entry.accessed = new Date();
    return entry.content;
}

function saveCache(url, payload, content) {
    let now = Date.now();

    let key = makeCacheKey(url, payload);
    let entry = {
        content: content,
        created: now,
        accessed: now,
    }

    cache[key] = entry;
}

function makeCacheKey(url, payload) {
    let key = {
        url: url,
        payload: payload,
    };

    return JSON.stringify(key);
}

export {
    hasCredentials,
    setCredentials,
    clearCredentials,

    sendRequest,
}
