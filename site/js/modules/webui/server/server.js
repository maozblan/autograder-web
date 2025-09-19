import * as Autograder from '../../autograder/index.js';

import * as Render from '../render.js';
import * as Routing from '../routing.js';

function init() {
    Routing.addRoute(/^server$/, handlerServer, 'Server Actions', Routing.NAV_SERVER, undefined);
}

function handlerServer(path, params, context, container) {
    Routing.loadingStart(container);

    let args = {
        [Routing.PARAM_TARGET_ENDPOINT]: params[Routing.PARAM_TARGET_ENDPOINT],
    };

    let cards = [
        new Render.Card('server-action', 'API Documentation', Routing.formHashPath(Routing.PATH_SERVER_DOCS)),
        new Render.Card('server-action', 'Call API', Routing.formHashPath(Routing.PATH_SERVER_CALL_API, args)),
        new Render.Card('server-action', 'List Users', Routing.formHashPath(Routing.PATH_SERVER_USERS_LIST, args), {
            minServerRole: Autograder.Common.SERVER_ROLE_ADMIN,
        }),
    ];

    let cardSections = [
        ['Server Actions', cards],
    ];

    container.innerHTML = Render.makeCardSections(context, '', cardSections);
}

init();
