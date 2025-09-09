import * as Core from './core.js';

function email(course, dryRun, html, subject, bcc = undefined, body = undefined, cc = undefined, to =undefined) {
    let args = {
        'course-id': course,
        'dry-run': dryRun,
        'html': html,
        'subject': subject,
    };

    if (to) {
        args.to = to;
    }

    if (cc) {
        args.cc = cc;
    }

    if (bcc) {
        args.bcc = bcc;
    }

    if (body) {
        args.body = body;
    }

    return Core.sendRequest({
        endpoint: 'courses/admin/email',
        payload: args,
    });
}

function users(course, targetUsers = undefined) {
    let args = {
        'course-id': course,
    };

    if (targetUsers) {
        args['target-users'] = targetUsers;
    }

    return Core.sendRequest({
        endpoint: 'courses/users/list',
        payload: args,
    });
}

export {
    email,
    users,
};
