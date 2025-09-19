import * as Autograder from '../../../../autograder/index.js';

import * as Icon from '../../../icon.js';
import * as Input from '../../../input.js';
import * as Render from '../../../render.js';
import * as Routing from '../../../routing.js';

function init() {
    Routing.addRoute(/^course\/assignment\/fetch\/course\/scores$/, handlerFetchCourseScores, 'Fetch Course Assignment Scores', Routing.NAV_COURSES, {assignment: true});
}

function handlerFetchCourseScores(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let inputFields = [
        new Input.FieldType(context, 'target-users', 'Target Users', {
            type: '[]model.CourseUserReference',
        }),
    ];

    Render.makePage(
            params, context, container, fetchCourseScores,
            {
                header: 'Fetch Course Scores',
                description: 'Fetch the most recent scores for this assignment.',
                inputs: inputFields,
                buttonName: 'Fetch',
                iconName: Icon.ICON_NAME_FETCH,
            },
        )
    ;
}

function fetchCourseScores(params, context, container, inputParams) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    return Autograder.Courses.Assignments.Submissions.Fetch.Course.scores(course.id, assignment.id, inputParams['target-users'])
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
