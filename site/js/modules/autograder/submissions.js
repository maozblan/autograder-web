import * as Core from './core.js';

function history(course, assignment, targetEmail = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (targetEmail) {
        args['target-email'] = targetEmail;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/user/history',
        payload: args,
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
        endpoint: 'courses/assignments/submissions/fetch/user/peek',
        payload: args,
    });
}

function submit(course, assignment, files, allowLate, message = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
        'allow-late': allowLate,
    };

    if (message) {
        args.message = message;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/submit',
        files: files,
        payload: args,
    });
}

function fetchCourseScores(course, assignment, targetUsers = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (targetUsers) {
        args['target-users'] = targetUsers;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/course/scores',
        payload: args,
    });
}

function fetchUserAttempt(course, assignment, targetEmail = undefined, targetSubmission = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (targetEmail) {
        args['target-email'] = targetEmail;
    }

    if (targetSubmission) {
        args['target-submission'] = targetSubmission;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/user/attempt',
        payload: args,
    });
}

function proxyRegrade(course, assignment, dryRun, overwriteRecords, regradeCutoff, targetUsers, waitForCompletion) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
        'dry-run': dryRun,
        'overwrite-records': overwriteRecords,
        'wait-for-completion': waitForCompletion,
    };

    if (regradeCutoff) {
        args['regrade-cutoff'] = regradeCutoff;
    }

    if (targetUsers) {
        args['target-users'] = targetUsers;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/proxy/regrade',
        payload: args,
    });
}

function proxyResubmit(course, assignment, proxyEmail = undefined, targetSubmission = undefined, proxyTime = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (proxyEmail) {
        args['proxy-email'] = proxyEmail;
    }

    if (targetSubmission) {
        args['target-submission'] = targetSubmission;
    }

    if (proxyTime) {
        args['proxy-time'] = proxyTime;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/proxy/resubmit',
        payload: args,
    });
}

function analysisIndividual(dryRun, overwriteRecords, submissions, waitForCompletion) {
    let args = {
        'dry-run': dryRun,
        'overwrite-records': overwriteRecords,
        'submissions': submissions,
        'wait-for-completion': waitForCompletion,
    };

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/analysis/individual',
        payload: args
    });
}

function analysisPairwise(dryRun, overwriteRecords, submissions, waitForCompletion) {
    let args = {
        'dry-run': dryRun,
        'overwrite-records': overwriteRecords,
        'submissions': submissions,
        'wait-for-completion': waitForCompletion,
    };

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/analysis/pairwise',
        payload: args,
    });
}

function remove(course, assignment, targetEmail = undefined, targetSubmission = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    };

    if (targetEmail) {
        args['target-email'] = targetEmail;
    }

    if (targetSubmission) {
        args['target-submission'] = targetSubmission;
    }

    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/remove',
        payload: args,
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
