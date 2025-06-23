import * as Core from './core.js';

function emailUsers(params) {
    return Core.sendRequest({
        endpoint: 'courses/admin/email',
        payload: params,
    });
}

export {
    emailUsers,
};
