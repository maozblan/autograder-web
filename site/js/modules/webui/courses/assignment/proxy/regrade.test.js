import * as Core from '../../../core/index.js';
import * as TestUtil from '../../../test/util.js';

test('Proxy Regrade', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Core.Routing.PATH_PROXY_REGRADE,
            {[Core.Routing.PARAM_COURSE]: 'course101', [Core.Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment proxy regrade');

    document.querySelector('.input-field #users').value = JSON.stringify([
            "*",
            "-course-admin@test.edulinq.org",
    ]);

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area code').innerHTML;
    let output = JSON.parse(results);
    expect(output['resolved-users'].length).toEqual(4);
});
