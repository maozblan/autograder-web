import * as Core from './core.js'

function list(courseID) {
    return Core.sendRequest('courses/assignments/list', {'course-id': courseID});
}

function get(courseID, assignmentID) {
    return Core.sendRequest('courses/assignments/get',
            {'course-id': courseID, 'assignment-id': assignmentID});
}

export {
    get,
    list,
}
