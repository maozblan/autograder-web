import * as Core from './core.js';

function email(course, dryRun, html, subject, to = undefined, cc = undefined, bcc = undefined, body = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/admin/email',
        payload: {
            'course-id': course,
            'dry-run': dryRun,
            'html': html,
            'subject': subject,
            'to': to,
            'cc': cc,
            'bcc': bcc,
            'body': body,
        },
    });
}

function get(course) {
    return Core.sendRequest({
        endpoint: 'courses/get',
        payload: {
            'course-id': course,
        },
    });
}

function users(course, targetUsers = undefined) {
    return Core.sendRequest({
        endpoint: 'courses/users/list',
        payload: {
            'course-id': course,
            'target-users': targetUsers,
        },
    });
}

export {
    email,
    get,
    users,
};
