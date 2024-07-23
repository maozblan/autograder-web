import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    let requirements = {course: true};
    Routes.addRoute(/^course$/, handlerCourse, requirements);
}

function handlerCourse(path, params, context) {
    let actions = courseActions(context.courseID, context.course.role);

    let actionsHTML = [];
    for (const [label, link] of actions) {
        actionsHTML.push(`<li><a href='${link}'>${label}</a></li>`);
    }

    let html = '';
    if (actionsHTML.length == 0) {
        html = '<h3>No Course Actions</h3>';
    } else {
        html = `
            <h3>Course Actions:</h3>
            <ul class='action-list'>
                ${actionsHTML.join('')}
            </ul>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

function courseActions(courseID, roleString) {
    let role = Autograder.Users.getCourseRoleValue(roleString);
    let actions = [];

    if (role >= Autograder.Users.COURSE_ROLE_STUDENT) {
        actions.push(['Submit an Assignment', Core.formHashPath('submit', {'course-id': courseID})]);
        actions.push(['Peek a Previous Submission', Core.formHashPath('peek', {'course-id': courseID})]);
        actions.push(['View Submission History', Core.formHashPath('history', {'course-id': courseID})]);
    }

    return actions;
}

export {
    init,
}
