import * as Routing from '../../../routing.js';
import * as TestUtil from '../../../test/util.js';

test('Proxy Resubmit, Success', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_PROXY_RESUBMIT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment proxy resubmit');

    document.querySelector('.input-field #email').value = 'course-student@test.edulinq.org';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('course-student@test.edulinq.org');
    expect(results).toContain('Score');
});

test('Proxy Resubmit, User Not Found', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_PROXY_RESUBMIT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment proxy resubmit');

    document.querySelector('.input-field #email').value = 'zzz@test.edulinq.org';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('Grading Failed');
    expect(results).toContain('User not found.');
    expect(results).toContain('Submission not found.');
});
