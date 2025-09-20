import * as Autograder from '../../../autograder/index.js';
import * as Core from '../../core/index.js';
import * as Icon from '../../icon.js';
import * as Input from '../../input.js';
import * as Render from '../../render.js';
import * as Util from '../../util/index.js';

function init() {
    Core.Routing.addRoute(/^course\/assignment\/submit$/, handlerSubmit, 'Assignment Submit', Core.Routing.NAV_COURSES, {assignment: true});
}

function handlerSubmit(path, params, context, container) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'files', 'Files', {
            type: Input.INPUT_TYPE_FILE,
            required: true,
            placeholder: 'Submission Files',
            additionalAttributes: ' multiple="true"',
        }),
        new Input.FieldType(context, 'message', 'Message', {
            type: Input.INPUT_TYPE_STRING,
        }),
        new Input.FieldType(context, 'allowLate', 'Allow Late', {
            type: Input.INPUT_TYPE_BOOL,
        }),
    ];

    Render.makePage(
            params, context, container, doSubmit,
            {
                header: 'Submit Assignment',
                inputs: inputFields,
                buttonName: 'Submit',
                iconName: Icon.ICON_NAME_SUBMIT,
            }
        )
    ;
}

function doSubmit(params, context, container, inputParams) {
    let course = context.courses[params[Core.Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Core.Routing.PARAM_ASSIGNMENT]];

    return Autograder.Courses.Assignments.Submissions.submit(course.id, assignment.id, inputParams.files, inputParams.allowLate, inputParams.message)
        .then(function(result) {
            return getSubmissionResultHTML(course, assignment, result);
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

function getSubmissionResultHTML(course, assignment, result) {
    result.message = Util.messageTimestampsToPretty(result.message);

    if (result.rejected) {
        return getSubmissionErrorHTML('Submission Rejected', result);
    } else if (!result['grading-success']) {
        return getSubmissionErrorHTML('Grading Failed', result);
    } else {
        return Render.submission(course, assignment, result.result);
    }
}

function getSubmissionErrorHTML(header, submission) {
    return `
        <div class="submission">
            <div class="secondary-color drop-shadow">
                <h3>${header}</h3>
                <p>User ${submission['found-user'] ? '' : 'not '}found.</p>
                <p>Submission ${submission['found-submission'] ? '' : 'not '}found.</p>
                <p>${submission.message}</p>
            </div>
        </div>
    `;
}

init();

export {
    getSubmissionResultHTML,
};
