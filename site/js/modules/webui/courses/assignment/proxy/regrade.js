import * as Autograder from '../../../../autograder/index.js';

import * as Icon from '../../../icon.js';
import * as Input from '../../../input.js';
import * as Render from '../../../render.js';
import * as Routing from '../../../routing.js';

function init() {
    Routing.addRoute(/^course\/assignment\/proxy-regrade$/, handlerProxyRegrade, 'Assignment Proxy Regrade', Routing.NAV_COURSES, {assignment: true});
}

function handlerProxyRegrade(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'dryRun', 'Dry Run', {
            type: Input.INPUT_TYPE_BOOL,
        }),
        new Input.FieldType(context, 'overwrite', 'Overwrite Records', {
            type: Input.INPUT_TYPE_BOOL,
        }),
        new Input.FieldType(context, 'cutoff', 'Regrade Cutoff', {
            type: Input.INPUT_TYPE_INT,
        }),
        new Input.FieldType(context, 'users', 'Target Users', {
            type: Input.COURSE_USER_REFERENCE_LIST_FIELD_TYPE,
            placeholder: '< All Users in Course >',
        }),
        new Input.FieldType(context, 'wait', 'Wait for Completion', {
            type: Input.INPUT_TYPE_BOOL,
        })
    ];

    Render.makePage(
            params, context, container, proxyRegrade,
            {
                header: 'Proxy Regrade',
                description: 'Proxy regrade an assignment for all target users using their most recent submission.',
                inputs: inputFields,
                buttonName: 'Regrade',
                iconName: Icon.ICON_NAME_PROXY_REGRADE,
            },
        )
    ;
}

function proxyRegrade(params, context, container, inputParams) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    return Autograder.Courses.Assignments.Submissions.Proxy.regrade(
            course.id, assignment.id,
            inputParams.dryRun, inputParams.overwrite, inputParams.wait,
            inputParams.cutoff, inputParams.users,
        )
        .then(function(result) {
            return Render.codeBlockJSON(result);
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

init();
