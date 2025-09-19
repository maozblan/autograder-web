import * as Autograder from '../../../autograder/index.js';
import * as Icon from '../../icon.js';
import * as Render from '../../render.js';
import * as Routing from '../../routing.js';

function init() {
    Routing.addRoute(/^course$/, handlerCourse, 'Course', Routing.NAV_COURSES, {course: true});
}

function handlerCourse(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];

    Render.setTabTitle(course.id);

    let assignmentCards = [];
    for (const [id, assignment] of Object.entries(course.assignments)) {
        let args = {
            [Routing.PARAM_COURSE]: course.id,
            [Routing.PARAM_ASSIGNMENT]: assignment.id,
        };

        let link = Routing.formHashPath(Routing.PATH_ASSIGNMENT, args);
        assignmentCards.push(new Render.Card(
            'assignment',
            assignment.name,
            link,
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_OTHER,
                courseId: course.id,
            },
        ));
    }

    let actionCards = [];
    actionCards.push(new Render.Card(
        "course-action",
        "Email Users",
        Routing.formHashPath(Routing.PATH_EMAIL, {
            [Routing.PARAM_COURSE]: course.id,
        }),
        {
            minServerRole: Autograder.Common.SERVER_ROLE_USER,
            minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
            courseId: course.id,
        },
    ));

    actionCards.push(new Render.Card(
        "course-action",
        "List Users",
        Routing.formHashPath(Routing.PATH_COURSE_USERS_LIST, {
            [Routing.PARAM_COURSE]: course.id,
        }),
        {
            minServerRole: Autograder.Common.SERVER_ROLE_USER,
            minCourseRole: Autograder.Common.COURSE_ROLE_GRADER,
            courseId: course.id,
        },
    ));

    let cardSections = [
        ['Assignments', assignmentCards],
        ['Actions', actionCards],
    ];

    container.innerHTML = Render.makeCardSections(context, course.name, cardSections, Icon.ICON_NAME_COURSES);
}

init();
