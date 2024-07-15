import * as Core from './core.js'

function createToken(email, cleartext) {
    return Core.sendRequest('users/tokens/create',
            {}, [], email, cleartext);
}

function get() {
    return Core.sendRequest('users/get');
}

export {
    createToken,
    get,
}
