import * as Render from './render.js'
import * as Routing from './routing.js'

function init() {
    let requirements = {assignment: true};
    Routing.addRoute(/^course\/assignment$/, handlerAssignment, 'Assignment', requirements);
    Routing.addRoute(/^course\/assignment\/peek$/, handlerPeek, 'Assignment Peek', requirements);
    Routing.addRoute(/^course\/assignment\/history$/, handlerHistory, 'Assignment History', requirements);
    Routing.addRoute(/^course\/assignment\/submit$/, handlerSubmit, 'Assignment Submit', requirements);
}

function handlerAssignment(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Routing.setTitle(assignment.name);

    let args = {
        [Routing.PARAM_COURSE]: course.id,
        [Routing.PARAM_ASSIGNMENT]: assignment.id,
    };

    let cards = [
        Render.makeCardObject('assignment-action', 'Submit', Routing.formHashPath('course/assignment/submit', args)),
        Render.makeCardObject('assignment-action', 'Peek a Previous Submission', Routing.formHashPath('course/assignment/peek', args)),
        Render.makeCardObject('assignment-action', 'View Submission History', Routing.formHashPath('course/assignment/history', args)),
    ];

    container.innerHTML = `
        <h2>${assignment.name}</h2>
        ${Render.cards(cards)}
    `;
}

function handlerPeek(path, params, context, container) {
    // TODO
}

function handlerHistory(path, params, context, container) {
    // TODO
}

function handlerSubmit(path, params, context, container) {
    // TODO
}

export {
    init,
}
