import * as Core from '../core/index.js';
import * as TestUtil from '../test/util.js';

test('Enrolled Courses', async function() {
    await TestUtil.loginUser('course-student');
    await TestUtil.navigate(Core.Routing.PATH_COURSES);

    TestUtil.checkPageBasics('Enrolled Courses', 'enrolled courses');

    const expectedLabelNames = [
        'Course 101',
        'Course Using Different Languages',
    ];
    TestUtil.checkCards(expectedLabelNames);
});
