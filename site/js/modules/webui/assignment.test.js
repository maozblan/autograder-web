import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

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

test('Proxy Regrade', async function() {
	Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_PROXY_REGRADE);

    TestUtil.checkPageBasics(targetAssignment, 'assignment proxy regrade');

    document.querySelector('.input-field[data-name="users"] input').value = JSON.stringify([
            "*",
            "-course-admin@test.edulinq.org",
        ])
    ;

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area code').innerHTML;
    let output = JSON.parse(results);
    expect(output['resolved-users'].length).toEqual(4);
});

test('Proxy Resubmit', async function() {
	Base.init(false);

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    await navigateToAssignmentAction(targetCourse, targetAssignment, Routing.PATH_PROXY_RESUBMIT);

    TestUtil.checkPageBasics(targetAssignment, 'assignment proxy resubmit');

    document.querySelector('.input-field[data-name="email"] input').value = 'course-student@test.edulinq.org';

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.template-button').click();
    await resultWaitPromise;

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toMatch(targetCourse);
    expect(results).toMatch(targetAssignment);
    expect(results).toMatch('course-student@test.edulinq.org');
});

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
