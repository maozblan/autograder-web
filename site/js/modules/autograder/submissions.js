import * as Core from './core.js';

function history(course, assignment, targetEmail = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/user/history',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-email': targetEmail,
        },
    });
}

function peek(course, assignment, submission = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/user/peek',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-submission': submission,
        },
    });
}

function submit(course, assignment, files, allowLate, message = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/submit',
        files: files,
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'allow-late': allowLate,
            'message': message,
        },
    });
}

function fetchCourseScores(course, assignment, targetUsers = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/course/scores',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-users': targetUsers,
        },
    });
}

function fetchUserAttempt(course, assignment, targetEmail = undefined, targetSubmission = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/user/attempt',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-email': targetEmail,
            'target-submission': targetSubmission,
        },
    });
}

function proxyRegrade(course, assignment, dryRun, overwriteRecords, waitForCompletion, regradeCutoff = undefined, targetUsers = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/proxy/regrade',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'dry-run': dryRun,
            'overwrite-records': overwriteRecords,
            'wait-for-completion': waitForCompletion,
            'regrade-cutoff': regradeCutoff,
            'target-users': targetUsers,
        },
    });
}

function proxyResubmit(course, assignment, proxyEmail, targetSubmission = undefined, proxyTime = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/proxy/resubmit',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'proxy-email': proxyEmail,
            'proxy-time': proxyTime,
            'target-submission': targetSubmission,
        },
    });
}

function analysisIndividual(submissions, overwriteRecords, waitForCompletion, dryRun) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/analysis/individual',
        payload: {
            'dry-run': dryRun,
            'overwrite-records': overwriteRecords,
            'submissions': submissions,
            'wait-for-completion': waitForCompletion,
        },
    });
}

function analysisPairwise(dryRun, overwriteRecords, submissions, waitForCompletion) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/analysis/pairwise',
        payload: {
            'dry-run': dryRun,
            'overwrite-records': overwriteRecords,
            'submissions': submissions,
            'wait-for-completion': waitForCompletion,
        },
    });
}

function remove(course, assignment, targetEmail = undefined, targetSubmission = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/remove',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-email': targetEmail,
            'target-submission': targetSubmission,
        },
    });
}

export {
    analysisIndividual,
    analysisPairwise,
    fetchCourseScores,
    fetchUserAttempt,
    history,
    peek,
    proxyRegrade,
    proxyResubmit,
    remove,
    submit,
}
