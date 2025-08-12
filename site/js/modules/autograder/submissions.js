import * as Core from './core.js'

function history(course, assignment, targetEmail = undefined) {
    let args = {
        'course-id': course,
        'assignment-id': assignment,
    }

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

function submit(course, assignment, files) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/submit',
        files: files,
        payload: {
            'course-id': course,
            'assignment-id': assignment,
        },
    });
}

function fetchCourseScores(course, assignment, targetUsers = []) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/fetch/course/scores',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'target-users': targetUsers,
        },
    });
}

function proxyRegrade(course, assignment, dryRun, overwriteRecords, regradeCutoff, targetUsers, waitForCompletion) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/proxy/regrade',
        payload: {
            'course-id': course,
            'assignment-id': assignment,
            'dry-run': dryRun,
            'overwrite-records': overwriteRecords,
            'regrade-cutoff': regradeCutoff,
            'target-users': targetUsers,
            'wait-for-completion': waitForCompletion,
        },
    });
}

function proxyResubmit(course, assignment, proxyEmail, proxyTime, targetSubmission) {
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
        }
    });
}

function analysisPairwise(submissions, overwriteRecords, waitForCompletion, dryRun) {
    return Core.sendRequest({
        endpoint: 'courses/assignments/submissions/analysis/pairwise',
        payload: {
            'dry-run': dryRun,
            'overwrite-records': overwriteRecords,
            'submissions': submissions,
            'wait-for-completion': waitForCompletion,
        }
    });
}

function remove(course, assignment, targetEmail = "", targetSubmission = "") {
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
    history,
    peek,
    proxyRegrade,
    proxyResubmit,
    remove,
    submit,
}
