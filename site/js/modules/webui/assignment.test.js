import fs from 'node:fs';
import path from 'node:path';

import * as Event from './event.js';
import * as Input from './input.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Individual Analysis', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_ANALYSIS_INDIVIDUAL,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment individual analysis');

    document.querySelector('.input-field[data-name="submissions"] input').value = JSON.stringify([
            "course101::hw0::course-student@test.edulinq.org::1697406256",
            "course101::hw0::course-student@test.edulinq.org::1697406265",
        ]
    );

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"complete": false');
    expect(results).toContain('"pending-count": 2');
});

test('Pairwise Analysis', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_ANALYSIS_PAIRWISE,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment pairwise analysis');

    document.querySelector('.input-field[data-name="submissions"] input').value = JSON.stringify([
            "course101::hw0::course-student@test.edulinq.org::1697406256",
            "course101::hw0::course-student@test.edulinq.org::1697406265",
        ]
    );

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"complete": false');
    expect(results).toContain('"pending-count": 1');
});

test('Fetch User Attempt, No Result', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_ASSIGNMENT_FETCH_USER_ATTEMPT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'fetch submission attempt');

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"found-submission": false');
});

test('Fetch User Attempt, Target Other', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_ASSIGNMENT_FETCH_USER_ATTEMPT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'fetch submission attempt');

    document.querySelector('.input-field #targetEmail').value = 'course-student@test.edulinq.org';
    document.querySelector('.input-field #targetSubmission').value = '1697406265';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"found-submission": true');
    expect(results).toContain('"id": "course101::hw0::course-student@test.edulinq.org::1697406265"');
    expect(results).toContain('"score": 1');

    let downloadWaitPromisePromise = Event.getEventPromise(Event.EVENT_TYPE_DOWNLOAD_FILE_COMPLETE);
    document.querySelector('.results-area button.download').click();
    await downloadWaitPromisePromise;
});

test('Submit Assignment', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_SUBMIT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment submit');

    const fileContent = fs.readFileSync(path.join('site', 'js', 'modules', 'autograder', 'test', 'data', 'hw0_solution.py'), 'utf8');
    const fileObj = new File([fileContent], 'hw0_solution.py');
    document.querySelector('div[data-name="files"] input')[Input.TEST_FILES_KEY] = [fileObj];

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('course101');
    expect(results).toContain('hw0');
    expect(results).toContain('Score');
});

test('Fetch Course Scores', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_ASSIGNMENT_FETCH_COURSE_SCORES,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'fetch course assignment scores');

    document.querySelector('.input-field[data-name="target-users"] input').value = '["student"]';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('course101::hw0::course-student@test.edulinq.org::1697406272');
});

test('Fetch User History', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_USER_HISTORY,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'user assignment history');

    document.querySelector('.input-field[data-name="targetUser"] input').value = 'course-student@test.edulinq.org';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    let tableRows = results.matchAll('<tr>').toArray().length;
    expect(tableRows).toEqual(4);
});

test('Proxy Regrade', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_PROXY_REGRADE,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment proxy regrade');

    document.querySelector('.input-field[data-name="users"] input').value = JSON.stringify([
            "*",
            "-course-admin@test.edulinq.org",
        ]
    );

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area code').innerHTML;
    let output = JSON.parse(results);
    expect(output['resolved-users'].length).toEqual(4);
});

test('Proxy Resubmit', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_PROXY_RESUBMIT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment proxy resubmit');

    document.querySelector('.input-field[data-name="email"] input').value = 'course-student@test.edulinq.org';

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('course101');
    expect(results).toContain('hw0');
    expect(results).toContain('course-student@test.edulinq.org');
});
