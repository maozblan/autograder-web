import * as Core from './core.js'

function history(course, assignment) {
    return Core.sendRequest({
        endpoint: 'submissions/history',
        cache: false,
        payload: {
            'course-id': course,
            'assignment-id': assignment,
        },
    });
}

function peek(course, assignment, submission = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (submission) {
        args['target-submission'] = submission;
    }

    return Core.sendRequest({
        endpoint: 'submissions/peek',
        payload: args,
        cache: false,
    });
}

function submit(course, assignment, files) {
    return Core.sendRequest({
        endpoint: 'submissions/submit',
        files: files,
        cache: false,
        payload: {
            'course-id': course,
            'assignment-id': assignment,
        },
    });
}

export {
    history,
    peek,
    submit,
}
