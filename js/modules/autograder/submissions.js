import * as Core from './core.js'

function history(course, assignment) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    return Core.sendRequest('submissions/history', args);
}

export {
    history
}
