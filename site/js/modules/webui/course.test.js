import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test("Enrolled Courses", async function() {
    Base.init(false);

    await TestUtil.loginUser("course-student");
    await navigateToEnrolledCourses();

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
    await navigateToCourse(targetCourse);

    TestUtil.checkPageBasics(targetCourse, 'course');

    const expectedLabelNames = [
        'Homework 0',
        'Email Users',
        'List Users',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

test('Course Users List', async function() {
    Base.init(false);

    let targetCourse = 'course101';
    await TestUtil.loginUser('course-admin');
    await navigateToCourseAction(targetCourse, Routing.PATH_COURSE_USERS_LIST);

    TestUtil.checkPageBasics(targetCourse, 'users');

    document.querySelector('.input-field[data-name="target-users"] input').value = '["student", "admin"]';

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    let userCount = results.matchAll('Email:').toArray().length;
    expect(userCount).toEqual(2);
});

test('Nav Homework 0', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-student');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignment(targetCourse, targetAssignment);

    TestUtil.checkPageBasics(targetAssignment, 'assignment');

    const expectedLabelNames = [
        'Fetch Course Scores',
        'Individual Analysis',
        'Pairwise Analysis',
        'Peek a Previous Submission',
        'Proxy Regrade',
        'Proxy Resubmit',
        'Remove Submission',
        'Submit',
        'View Submission History',
        'View User History',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

test('Individual Analysis', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_ANALYSIS_INDIVIDUAL);

    TestUtil.checkPageBasics(targetAssignment, 'assignment individual analysis');

    document.querySelector('.input-field[data-name="submissions"] input').value = JSON.stringify([
            "course101::hw0::course-student@test.edulinq.org::1697406256",
            "course101::hw0::course-student@test.edulinq.org::1697406265",
        ])
    ;

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toMatch(/"complete": false/);
    expect(results).toMatch(/"pending-count": 2/);
});

test('Pairwise Analysis', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_ANALYSIS_PAIRWISE);

    TestUtil.checkPageBasics(targetAssignment, 'assignment pairwise analysis');

    document.querySelector('.input-field[data-name="submissions"] input').value = JSON.stringify([
            "course101::hw0::course-student@test.edulinq.org::1697406256",
            "course101::hw0::course-student@test.edulinq.org::1697406265",
        ])
    ;

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toMatch(/"complete": false/);
    expect(results).toMatch(/"pending-count": 1/);
});

test('Fetch Course Scores', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_ASSIGNMENT_FETCH_COURSE_SCORES);

    TestUtil.checkPageBasics(targetAssignment, 'fetch course assignment scores');

    document.querySelector('.input-field[data-name="target-users"] input').value = '["student"]';

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toMatch('course101::hw0::course-student@test.edulinq.org::1697406272');
});

test('Fetch User History', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_USER_HISTORY);

    TestUtil.checkPageBasics(targetAssignment, 'user assignment history');

    document.querySelector('.input-field[data-name="targetUser"] input').value = 'course-student@test.edulinq.org';

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    let tableRows = results.matchAll('<tr>').toArray().length;
    expect(tableRows).toEqual(4);
});

async function navigateToEnrolledCourses() {
    let pathComponents = {
        'path': Routing.PATH_COURSES,
    };

    let coursesRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await coursesRenderedPromise;
}

async function navigateToCourse(courseId) {
    let pathComponents = {
        'path': Routing.PATH_COURSE,
        'params': {
            [Routing.PARAM_COURSE]: courseId,
        },
    };

    let courseRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await courseRenderedPromise;
}

async function navigateToCourseAction(courseId, actionPath) {
    let pathComponents = {
        'path': actionPath,
        'params': {
            [Routing.PARAM_COURSE]: courseId,
        },
    };

    let courseRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await courseRenderedPromise;
}

async function navigateToAssignment(courseId, assignmentId) {
    let pathComponents = {
        'path': Routing.PATH_ASSIGNMENT,
        'params': {
            [Routing.PARAM_ASSIGNMENT]: assignmentId,
            [Routing.PARAM_COURSE]: courseId,
        },
    };

    let courseRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await courseRenderedPromise;
}

async function navigateToAssignmentAction(courseId, assignmentId, actionPath) {
    let pathComponents = {
        'path': actionPath,
        'params': {
            [Routing.PARAM_ASSIGNMENT]: assignmentId,
            [Routing.PARAM_COURSE]: courseId,
        },
    };

    let courseRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await courseRenderedPromise;
}
