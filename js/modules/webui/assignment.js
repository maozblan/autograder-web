import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    let requirements = {assignment: true};
    Routes.addRoute(/^course/assignment$/, handlerAssignment, requirements);
}

function handlerAssignment(path, params, context) {
    // TEST
    console.log(context);
}

export {
    init,
}
