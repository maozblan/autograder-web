import * as Core from '../../core/index.js';
import * as Test from '../../test/index.js';

test('Course Update', async function() {
    const targetCourse = 'course101';
    const expectedUsers = [
        'course-admin@test.edulinq.org',
        'course-grader@test.edulinq.org',
        'course-other@test.edulinq.org',
        'course-owner@test.edulinq.org',
        'course-student@test.edulinq.org',
    ];

    await Test.loginUser('course-admin');
    await Test.navigate(Core.Routing.PATH_COURSE_UPDATE, {[Core.Routing.PARAM_COURSE]: targetCourse});

    Test.checkPageBasics(targetCourse, 'update course');

    await Test.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"success": true');
    for (const user of expectedUsers) {
        expect(results).toContain(user);
    }
});
