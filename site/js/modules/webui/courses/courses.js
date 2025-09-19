import * as Autograder from '../../autograder/index.js';
import * as Render from '../render.js';
import * as Routing from '../routing.js';

function init() {
    Routing.addRoute(/^courses$/, handlerCourses, 'Enrolled Courses', Routing.NAV_COURSES);
}

function handlerCourses(path, params, context, container) {
    let cards = [];
    for (const [id, course] of Object.entries(context.user.enrollments)) {
        let link = Routing.formHashPath(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: course.id});
        cards.push(new Render.Card(
            'course',
            course.name,
            link,
            {
                minServerRole: Autograder.Common.SERVER_ROLE_USER,
                minCourseRole: Autograder.Common.COURSE_ROLE_OTHER,
                courseId: id,
            },
        ));
    }

    let cardSections = [
        ['Enrolled Courses', cards],
    ];

    container.innerHTML = Render.makeCardSections(context, '', cardSections);
}

init();
