import * as Core from './core.js'

function list(courseID) {
    return Core.sendRequest('courses/assignments/list', {'course-id': courseID});
}

export {
    list,
}
