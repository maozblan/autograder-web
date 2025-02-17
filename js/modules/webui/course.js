import * as Render from './render.js'
import * as Routing from './routing.js'

function init() {
    let requirements = {course: true};
    Routing.addRoute(/^courses$/, handlerCourses, 'Courses');
}

function handlerCourses(path, params, context, container) {
    let cards = [];
    for (const [id, course] of Object.entries(context.courses)) {
        let link = Routing.formHashPath('course', {id: course.id});
        cards.push(Render.makeCardObject('course', course.name, link));
    }

    container.innerHTML = Render.cards(cards);
}

export {
    init,
}
