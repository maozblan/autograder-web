import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test("Enrolled Courses", async function() {
    Base.init(false);

    await TestUtil.loginUser("course-student");
    await TestUtil.navigate(Routing.PATH_COURSES);

    TestUtil.checkPageBasics('Enrolled Courses', 'enrolled courses');

    const expectedLabelNames = [
        'Course 101',
        'Course Using Different Languages',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

test("Nav Course101", async function() {
    Base.init(false);

    await TestUtil.loginUser("course-student");

    let targetCourse = 'course101';
    await TestUtil.navigate(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: targetCourse});

    TestUtil.checkPageBasics(targetCourse, 'course');

    const expectedLabelNames = [
        'Homework 0',
        'Email Users',
        'List Users',
    ];
    TestUtil.checkCards(expectedLabelNames);
});
