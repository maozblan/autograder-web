import * as Core from './core.js'

function list(courseID) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/list',
        payload: {
            'course-id': courseID
        },
    });
}

function get(courseID, assignmentID) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/get',
        payload: {
            'course-id': courseID,
            'assignment-id': assignmentID,
        },
    });
}

export {
    get,
    list,
}
