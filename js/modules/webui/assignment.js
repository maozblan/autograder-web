import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    let requirements = {assignment: true};
    Routes.addRoute(/^course\/assignment$/, handlerAssignment, requirements);
}

function handlerAssignment(path, params, context) {
    let html = `
        <h2>Assignment: ${context.assignment.name}</h2>
    `;

    let actions = assignmentActions(context);
    if (actions.length > 0) {
        let actionsHTML = [];
        for (const [label, link] of actions) {
            actionsHTML.push(`<li><a href='${link}'>${label}</a></li>`);
        }

        html += `
            <h3>Assignment Actions:</h3>
            <ul class='action-list'>
                ${actionsHTML.join('')}
            </ul>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

function assignmentActions(context) {
    let role = Autograder.Users.getCourseRoleValue(context.course.role);
    let actions = [];

    if (role >= Autograder.Users.COURSE_ROLE_STUDENT) {
        let params = {
            'course-id': context.courseID,
            'assignment-id': context.assignmentID,
        };

        actions.push(['Submit', Core.formHashPath('course/assignment/submit', params)]);
        actions.push(['Peek a Previous Submission', Core.formHashPath('course/assignment/peek', params)]);
        actions.push(['View Submission History', Core.formHashPath('course/assignment/history', params)]);
    }

    return actions;
}

export {
    init,
}
