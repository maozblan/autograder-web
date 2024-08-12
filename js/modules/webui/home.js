import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    Routes.addRoute(/^$/, handlerHome, 'home');
}

function handlerHome(path, params, context) {
    // The nav will change after we load a context user,
    // so explicitly refresh the nav.
    Core.setNav();

    let coursesHTML = [];
    for (const course of Core.getContextCourses()) {
        let link = Core.formHashPath('course', {'course-id': course.id});
        coursesHTML.push(`<a class='card' href='${link}'>${course.name}</a>`);
    }

    let html = '';
    if (coursesHTML.length === 0) {
        html = '<h3>No Enrolled Courses</h3>';
    } else {
        html = `
            <h3>Enrolled Courses:</h3>
            <div class='deck'>
                ${coursesHTML.join('')}
            </div>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

export {
    init,
}
