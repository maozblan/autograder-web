import * as Autograder from '../../../autograder/index.js';
import * as Core from '../../core/index.js';
import * as Icon from '../../icon.js';
import * as Input from '../../input.js';
import * as Render from '../../render.js';

function init() {
    Core.Routing.addRoute(/^course\/assignment\/remove$/, handlerSubmissionRemove, 'Remove Submission', Core.Routing.NAV_COURSES, {assignment: true});
}

function handlerSubmissionRemove(path, params, context, container) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];
    let userEmail = context.user.email;

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'targetEmail', 'Target User Email', {
            type: 'core.TargetCourseUserSelfOrGrader',
            placeholder: userEmail,
        }),
        new Input.FieldType(context, 'targetSubmission', 'Target Submission ID', {
            type: Input.INPUT_TYPE_STRING,
        }),
    ];

    Render.makePage(
            params, context, container, removeSubmission, {
                header: 'Remove Assignment Submission',
                description: 'Remove a specified submission. Defaults to the most recent submission.',
                inputs: inputFields,
                buttonName: 'Remove Submission',
                iconName: Icon.ICON_NAME_REMOVE,
            }
        )
    ;
}

function removeSubmission(params, context, container, inputParams) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];

    return Autograder.Courses.Assignments.Submissions.remove(
            course.id, assignment.id,
            inputParams.targetEmail, inputParams.targetSubmission,
        )
        .then(function(result) {
            let html = "";

            if (!result['found-user']) {
                html = `<p>Could not find user.</p>`;
            } else if (!result['found-submission']) {
                html = `<p>Could not find submission.</p>`;
            } else {
                html = `<p>Submission removed successfully.</p>`;
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
