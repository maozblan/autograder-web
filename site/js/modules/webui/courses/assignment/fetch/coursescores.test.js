import * as Core from '../../../core/index.js';
import * as TestUtil from '../../../test/util.js';

test('Fetch Course Scores', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Core.Routing.PATH_ASSIGNMENT_FETCH_COURSE_SCORES,
            {[Core.Routing.PARAM_COURSE]: 'course101', [Core.Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'fetch course assignment scores');

    document.querySelector('.input-field #target-users').value = '["student"]';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('course101::hw0::course-student@test.edulinq.org::1697406272');
});
