import * as Core from './core.js'
import * as Util from './util.js'

function createToken(email, cleartext) {
    return Core.sendRequest('users/tokens/create', {}, email, cleartext)
        .then(function(response) {
            if (!response.success) {
                return Promise.reject(response.message);
            }

            return Promise.resolve(response.content);
        })
        .catch(function(response) {
            console.error("Failed to create token.");
            return Promise.reject(response);
        });
}

export {
    createToken
}
