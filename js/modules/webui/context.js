import * as Autograder from '/js/modules/autograder/base.js'
import * as Util from './util.js'

let context = undefined;

// Load the core context from the server.
// Will return a promise that will resolve to null on success, and reject on error.
// After the returned promise resolves, calls to this modules get methods will return real values.
// If a context is already loaded, then the promise will instantly resolve.
function load() {
    if (context) {
        return Promise.resolve(null);
    }

    return Autograder.Users.get()
        .then(function(result) {
            if (!result.found) {
                Log.warn("Server could not find context user.");
                return Promist.reject(result);
            }

            context = {
                user: result.user,
                courses: result.courses,
            };

            return null;
        })
        .catch(function(result) {
            Log.warn('Failed to get user.', result);
            return result;
        })
    ;
}

function exists() {
    return (context !== undefined);
}

function get() {
    return context;
}

function clear() {
    context = undefined;
}

export {
    clear,
    exists,
    get,
    load,
}
