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
                    return Core.redirect('logout');
                }

                Core.setContextUser(result.user);
                return handlerHome(path, params);
            })
            .catch(function(result) {
                Util.warn(result);
                return Core.redirect('logout');
            });

        return;
    }

    _handlerHomeWithContext(path, params);
}

// Render home asuming there is a context user.
function _handlerHomeWithContext(path, params) {
    let contextUser = Core.getContextUser();

    let coursesHTML = [];
    for (const course of Core.getContextCourses()) {
        let link = `#course?id=${course.id}`;
        coursesHTML.push(`<li><a href='${link}'>${course.name}</a></li>`);
    }

    if (coursesHTML.length === 0) {
        document.querySelector('.content').innerHTML = '<h3>No Enrolled Courses</h3>';
        return;
    }

    let html = `
        <h3>Enrolled Courses:</h3>
        <ul class='course-list'>
            ${coursesHTML.join('')}
        </ul>
    `;

    document.querySelector('.content').innerHTML = html;
}

export {
    handlerHome,
}
