import * as Autograder from '../../../autograder/index.js';

import * as Icon from '../../icon.js';
import * as Render from '../../render.js';
import * as Routing from '../../routing.js';

function init() {
    Routing.addRoute(/^course\/assignment$/, handlerAssignment, 'Assignment', Routing.NAV_COURSES, {assignment: true});
}

function handlerAssignment(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Render.setTabTitle(assignment.id);

    let args = {
        [Routing.PARAM_COURSE]: course.id,
        [Routing.PARAM_ASSIGNMENT]: assignment.id,
    };

    // Simple Actions
    let studentCards = [
        new Render.Card(
            'assignment-action',
            'Submit',
            Routing.formHashPath(Routing.PATH_SUBMIT, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_STUDENT,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Peek a Previous Submission',
            Routing.formHashPath(Routing.PATH_PEEK, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_STUDENT,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'View Submission History',
            Routing.formHashPath(Routing.PATH_HISTORY, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_STUDENT,
                courseId: course.id,
            },
        ),
    ];

    // Advanced Actions
    let staffCards = [
        new Render.Card(
            'assignment-action',
            'Fetch Course Scores',
            Routing.formHashPath(Routing.PATH_ASSIGNMENT_FETCH_COURSE_SCORES, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Fetch Submission Attempt',
            Routing.formHashPath(Routing.PATH_ASSIGNMENT_FETCH_USER_ATTEMPT, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_STUDENT,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Proxy Regrade',
            Routing.formHashPath(Routing.PATH_PROXY_REGRADE, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Proxy Resubmit',
            Routing.formHashPath(Routing.PATH_PROXY_RESUBMIT, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Individual Analysis',
            Routing.formHashPath(Routing.PATH_ANALYSIS_INDIVIDUAL, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_ADMIN,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Pairwise Analysis',
            Routing.formHashPath(Routing.PATH_ANALYSIS_PAIRWISE, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_ADMIN,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'Remove Submission',
            Routing.formHashPath(Routing.PATH_SUBMIT_REMOVE, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
                courseId: course.id,
            },
        ),
        new Render.Card(
            'assignment-action',
            'View User History',
            Routing.formHashPath(Routing.PATH_USER_HISTORY, args),
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
                courseId: course.id,
            },
        ),
    ];

    let cardSections = [
        ['Student Actions', studentCards],
        ['Advanced Actions', staffCards],
    ];

    container.innerHTML = Render.makeCardSections(context, assignment.name, cardSections, Icon.ICON_NAME_COURSES);
}

init();
