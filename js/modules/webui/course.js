import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Log from './log.js'
import * as Routes from './routes.js'

function init() {
    let requirements = {course: true};
    Routes.addRoute(/^course$/, handlerCourse, 'course', requirements);
}

function handlerCourse(path, params, context) {
    setContextNav(path, params, context);
    Core.loading();

    return Autograder.Assignments.list(context.courseID)
        .then(function(result) {
            render(context, result.assignments);
            return result.assignments;
        })
        .catch(function(result) {
            Log.warn(result, context);
            return Core.redirectHome();
        });
}

function setContextNav(path, params, context) {
    let breadcrumbs = [
        Core.makeNavItem(context.course.name, Core.formHashPath('course',
                {'course-id': context.courseID})),
    ];

    Core.renderBreadcrumbs(breadcrumbs);
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

            lines.push(`<li><a class='card' href='${link}'>${assignment.name}</a></li>`);
        }

        html += `
            <h3>Assignments:</h3>
            <ul class='soft-list'>
                ${lines.join('')}
            </ul>
        `
    }

    let courseActions = getCourseActions(context);
    if (courseActions.length > 0) {
        let lines = [];
        for (const [label, link] of actions) {
            lines.push(`<li><a class='card' href='${link}'>${label}</a></li>`);
        }

        html += `
            <h3>Course Actions:</h3>
            <ul class='soft-list'>
                ${lines.join('')}
            </ul>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

function getCourseActions(context) {
    let role = Autograder.Users.getCourseRoleValue(context.course.role);
    let actions = [];

    // TODO - Grader/Admin Actions.

    return actions;
}

export {
    init,
}
