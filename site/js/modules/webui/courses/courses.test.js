import * as Routing from '../routing.js';
import * as TestUtil from '../test/util.js';

test('Enrolled Courses', async function() {
    await TestUtil.loginUser('course-student');
    await TestUtil.navigate(Routing.PATH_COURSES);

    TestUtil.checkPageBasics('Enrolled Courses', 'enrolled courses');

    const expectedLabelNames = [
        'Course 101',
        'Course Using Different Languages',
    ];
    TestUtil.checkCards(expectedLabelNames);
});
