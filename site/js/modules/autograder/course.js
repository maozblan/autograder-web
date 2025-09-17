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
    users,
};
