import * as Routing from '../../routing.js';
import * as TestUtil from '../../test/util.js';

test('Course Users List', async function() {
    const targetCourse = 'course101';
    const expectedEmails = [
        'course-admin@test.edulinq.org',
        'course-grader@test.edulinq.org',
        'course-other@test.edulinq.org',
        'course-owner@test.edulinq.org',
        'course-student@test.edulinq.org',
    ];

    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(Routing.PATH_COURSE_USERS_LIST, {[Routing.PARAM_COURSE]: targetCourse});

    TestUtil.checkPageBasics(targetCourse, 'users');

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;

    for (const expectedEmail of expectedEmails) {
        expect(results).toContain(expectedEmail);
    }
});
