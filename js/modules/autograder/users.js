import * as Core from './core.js'

function createToken(email, cleartext) {
    return Core.sendRequest('users/tokens/create',
            {}, {}, email, cleartext);
}

export {
    createToken
}
