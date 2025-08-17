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

    await TestUtil.loginUser('course-admin');

    let pathComponents = {
        'path': Routing.PATH_COURSE_USERS_LIST,
        'params': {
            [Routing.PARAM_COURSE]: 'course101',
        },
    };

    let coursesRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await coursesRenderedPromise;

    document.querySelector('.input-field[data-name="target-users"] input').value = '["student", "admin"]';

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    let userCount = results.matchAll('Email:').toArray().length;
    expect(userCount).toEqual(2);
});

test('Individual Analysis', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-admin');

    let pathComponents = {
        'path': Routing.PATH_ANALYSIS_INDIVIDUAL,
        'params': {
            [Routing.PARAM_COURSE]: 'course101',
            [Routing.PARAM_ASSIGNMENT]: 'hw0',
        },
    };

    let loadWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE);

    Routing.routeComponents(pathComponents);
    await loadWaitPromise;

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

    let pathComponents = {
        'path': Routing.PATH_ANALYSIS_PAIRWISE,
        'params': {
            [Routing.PARAM_COURSE]: 'course101',
            [Routing.PARAM_ASSIGNMENT]: 'hw0',
        },
    };

    let loadWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE);

    Routing.routeComponents(pathComponents);
    await loadWaitPromise;

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

    let pathComponents = {
        'path': Routing.PATH_ASSIGNMENT_FETCH_COURSE_SCORES,
        'params': {
            [Routing.PARAM_COURSE]: 'course101',
            [Routing.PARAM_ASSIGNMENT]: 'hw0',
        },
    };

    let loadWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE);

    Routing.routeComponents(pathComponents);
    await loadWaitPromise;

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

    let pathComponents = {
        'path': Routing.PATH_USER_HISTORY,
        'params': {
            [Routing.PARAM_COURSE]: 'course101',
            [Routing.PARAM_ASSIGNMENT]: 'hw0',
        },
    };

    let loadWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE);

    Routing.routeComponents(pathComponents);
    await loadWaitPromise;

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
