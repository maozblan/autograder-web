import * as Base from './base.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Fetch User Attempt, No Result', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-student');
    await TestUtil.navigate(
            Routing.PATH_ASSIGNMENT_FETCH_USER_ATTEMPT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'});

    TestUtil.checkPageBasics('hw0', 'fetch submission attempt');
});
