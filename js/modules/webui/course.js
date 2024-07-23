import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    let requirements = {course: true};
    Routes.addRoute(/^course$/, handlerCourse, requirements);
}

function handlerCourse(path, params, context) {
    Core.loading();

    return Autograder.Assignments.list(context.courseID)
        .then(function(result) {
            render(context, result.assignments);
            return result.assignments;
        })
        .catch(function(result) {
            Util.warn(result);
            return Core.redirectHome();
        });
}

function render(context, assignments) {
    let html = '';

    if (assignments.length > 0) {
        let lines = [];
        for (const assignment of assignments) {
            let params = {
                'course-id': context.courseID,
                'assignment-id': assignment.id,
            };
            let link = Core.formHashPath('course/assignment', params);

            lines.push(`<li><a href='${link}'>${assignment.name}</a></li>`);
        }

        html += `
            <h3>Assignments:</h3>
            <ul class='assignment-list'>
                ${lines.join('')}
            </ul>
        `
    }

    let courseActions = getCourseActions(context.courseID, context.course.role);
    if (courseActions.length > 0) {
        let lines = [];
        for (const [label, link] of actions) {
            lines.push(`<li><a href='${link}'>${label}</a></li>`);
        }

        html += `
            <h3>Course Actions:</h3>
            <ul class='action-list'>
                ${lines.join('')}
            </ul>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

function getCourseActions(courseID, roleString) {
    let role = Autograder.Users.getCourseRoleValue(roleString);
    let actions = [];

    // TODO - Grader/Admin Actions.
    /* TEST
    if (role >= Autograder.Users.COURSE_ROLE_STUDENT) {
        actions.push(['Submit an Assignment', Core.formHashPath('submit', {'course-id': courseID})]);
        actions.push(['Peek a Previous Submission', Core.formHashPath('peek', {'course-id': courseID})]);
        actions.push(['View Submission History', Core.formHashPath('history', {'course-id': courseID})]);
    }
    */

    return actions;
}

export {
    init,
}
