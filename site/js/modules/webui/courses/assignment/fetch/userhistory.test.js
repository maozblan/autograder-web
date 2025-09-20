import * as Core from '../../../core/index.js';
import * as TestUtil from '../../../test/util.js';

test('Fetch User History, Success', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Core.Routing.PATH_USER_HISTORY,
            {[Core.Routing.PARAM_COURSE]: 'course101', [Core.Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'user assignment history');

    document.querySelector('.input-field #targetUser').value = 'course-student@test.edulinq.org';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    let tableRows = results.matchAll('<tr>').toArray().length;
    expect(tableRows).toEqual(4);
});
