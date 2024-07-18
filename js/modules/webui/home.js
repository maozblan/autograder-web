import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Util from './util.js'

function handlerHome(path, params) {
    // Go to login page if not logged in.
    if (!Autograder.hasCredentials()) {
        return Core.redirect('login');
    }

    // The nav will change after we load a context user,
    // so explicitly refresh the nav.
    Core.setNav();

    // Fetch context user if not currently set (then retry this handler).
    if (!Core.getContextUser()) {
        Core.loading();

        Autograder.Users.get()
            .then(function(result) {
                if (!result.found) {
                    Util.warn("Server could not find context user.");
                    return handlerLogout(path, params);
                }

                Core.setContextUser(result.user);
                return handlerHome(path, params);
            })
            .catch(function(result) {
                Util.warn(result);
                return handlerLogout(path, params);
            });

        return;
    }

    _handlerHomeWithContext(path, params);
}

// Render home asuming there is a context user.
function _handlerHomeWithContext(path, params) {
    let contextUser = Core.getContextUser();

    // TODO
    let text = JSON.stringify(contextUser, null, 4);
    document.querySelector('.content').innerHTML = `<pre>${text}</pre>`;
}

export {
    handlerHome,
}
