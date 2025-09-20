import * as Core from '../core/index.js';
import * as TestUtil from '../test/util.js';

describe('Nav Server Actions', function() {
    // [[user, [expected card labels]], ...].
    const testCases = [
        [
            'server-user',
            [
                'API Documentation',
                'Call API',
            ],
        ],
        [
            'server-creator',
            [
                'API Documentation',
                'Call API',
            ],
        ],
        [
            'server-admin',
            [
                'API Documentation',
                'Call API',
                'List Users',
            ],
        ],
    ];

    test.each(testCases)("%s", async function(user, expectedLabelNames) {
        await TestUtil.loginUser(user);
        await TestUtil.navigate(Core.Routing.PATH_SERVER);

        TestUtil.checkPageBasics('Server Actions', 'server actions');
        TestUtil.checkCards(expectedLabelNames);
    });
});
