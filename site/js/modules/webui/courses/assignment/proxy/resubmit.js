import * as Autograder from '../../../../autograder/index.js';

import * as Icon from '../../../icon.js';
import * as Input from '../../../input.js';
import * as Render from '../../../render.js';
import * as Routing from '../../../routing.js';
import * as Submit from '../submit.js';

function init() {
    Routing.addRoute(/^course\/assignment\/proxy-resubmit$/, handlerProxyResubmit, 'Assignment Proxy Resubmit', Routing.NAV_COURSES, {assignment: true});
}

function handlerProxyResubmit(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'email', 'Target User', {
            type: Input.INPUT_TYPE_EMAIL,
            required: true,
            placeholder: 'Email',
        }),
        new Input.FieldType(context, 'time', 'Proxy Time', {
            type: Input.INPUT_TYPE_INT,
        }),
        new Input.FieldType(context, 'submission', 'Submission', {
            placeholder: 'Most Recent',
        }),
    ];

    Render.makePage(
            params, context, container, proxyResubmit,
            {
                header: 'Proxy Resubmit',
                description: 'Proxy resubmit an assignment submission to the autograder.',
                inputs: inputFields,
                buttonName: 'Resubmit',
                iconName: Icon.ICON_NAME_PROXY_RESUBMIT,
            },
        )
    ;
}

function proxyResubmit(params, context, container, inputParams) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    return Autograder.Courses.Assignments.Submissions.Proxy.resubmit(
            course.id, assignment.id,
            inputParams.email, inputParams.submission, inputParams.time,
        )
        .then(function(result) {
            return Submit.getSubmissionResultHTML(course, assignment, result);
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

init();
