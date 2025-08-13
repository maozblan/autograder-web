import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Server Action', async function() {
    Base.init(false);

    await TestUtil.loginUser('server-admin');

    let pathComponents = {
        'path': Routing.PATH_SERVER,
    };

    let loadWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await loadWaitPromise;

    TestUtil.checkPageBasics('Server Actions', 'server actions');

    const expectedLabelNames = [
        'API Documentation',
        'Call API',
        'List Users',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

