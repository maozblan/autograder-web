import * as Autograder from '../../../autograder/index.js';
import * as Core from '../../core/index.js';
import * as Icon from '../../icon.js';
import * as Render from '../../render.js';

function init() {
    Core.Routing.addRoute(/^course\/assignment\/history$/, handlerHistory, 'Assignment History', Core.Routing.NAV_COURSES, {assignment: true});
}

function handlerHistory(path, params, context, container) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    Render.makePage(
            params, context, container, historyCallback,
            {
                header: 'Fetch Submission History',
                buttonName: 'Fetch',
                iconName: Icon.ICON_NAME_HISTORY,
            },
        )
    ;
}

function historyCallback(params, context, container, inputParams) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];

    let targetEmail = inputParams.targetUser ?? context.user.email;

    return Autograder.Courses.Assignments.Submissions.Fetch.User.history(course.id, assignment.id, targetEmail)
        .then(function(result) {
            let html = "";

            if (!result['found-user']) {
                html = `<p>Could not find user: '${targetEmail}'.</p>`;
            } else {
                html = Render.submissionHistory(course, assignment, result['history']);
            }

            return html;
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

init();

export {
    historyCallback,
};
