import * as Render from './render.js'
import * as Routing from './routing.js'

function init() {
    let requirements = {course: true};
    Routing.addRoute(/^courses$/, handlerCourses, 'Courses');
    Routing.addRoute(/^course$/, handlerCourse, 'Course', {course: true});
}

function handlerCourses(path, params, context, container) {
    let cards = [];
    for (const [id, course] of Object.entries(context.courses)) {
        let link = Routing.formHashPath('course', {[Routing.PARAM_COURSE]: course.id});
        cards.push(Render.makeCardObject('course', course.name, link));
    }

    container.innerHTML = Render.cards(cards);
}

function handlerCourse(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];

    let cards = [];
    for (const [id, assignment] of Object.entries(course.assignments)) {
        let link = Routing.formHashPath('assignment', {[Routing.PARAM_ASSIGNMENT]: assignment.id});
        cards.push(Render.makeCardObject('assignment', assignment.name, link));
    }

    container.innerHTML = Render.cards(cards);
}

export {
    init,
}
