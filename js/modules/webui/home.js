import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    Routes.addRoute(/^$/, _handlerHome);
}

function _handlerHome(path, params) {
    // The nav will change after we load a context user,
    // so explicitly refresh the nav.
    Core.setNav();

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
    init,
}
