import * as Core from './core.js'

function history(course, assignment) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    return Core.sendRequest('submissions/history', args);
}

function peek(course, assignment, submission = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };


    if (submission) {
        args['target-submission'] = submission;
    }

    return Core.sendRequest('submissions/peek', args);
}

function submit(course, assignment, files) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    return Core.sendRequest('submissions/submit', args, files);
}

export {
    history,
    peek,
    submit,
}
