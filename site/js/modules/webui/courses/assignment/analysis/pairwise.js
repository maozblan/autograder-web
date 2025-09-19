import * as Autograder from '../../../../autograder/index.js';

import * as Icon from '../../../icon.js';
import * as Input from '../../../input.js';
import * as Render from '../../../render.js';
import * as Routing from '../../../routing.js';

function init() {
    Routing.addRoute(/^course\/assignment\/analysis\/pairwise$/, handlerAnalysisPairwise, 'Assignment Pairwise Analysis', Routing.NAV_COURSES, {assignment: true});
}

function handlerAnalysisPairwise(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'submissions', 'List of Submission IDs', {
            type: '[]string',
            required: true,
        }),
        new Input.FieldType(context, 'wait', 'Wait for Completion', {
            type: Input.INPUT_TYPE_BOOL,
        }),
        new Input.FieldType(context, 'overwrite', 'Overwrite Records', {
            type: Input.INPUT_TYPE_BOOL,
        }),
        new Input.FieldType(context, 'dryRun', 'Dry Run', {
            type: Input.INPUT_TYPE_BOOL,
        }),
    ];

    Render.makePage(
            params, context, container, analysisPairwise,
            {
                header: 'Pairwise Analysis',
                description: 'Get the result of a pairwise analysis for the specified submissions.',
                inputs: inputFields,
                buttonName: 'Analyze',
                iconName: Icon.ICON_NAME_ANALYSIS,
            },
        )
    ;
}

function analysisPairwise(params, context, container, inputParams) {
    return Autograder.Courses.Assignments.Submissions.Analysis.pairwise(
            inputParams.submissions, inputParams.overwrite,
            inputParams.wait, inputParams.dryRun,
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
