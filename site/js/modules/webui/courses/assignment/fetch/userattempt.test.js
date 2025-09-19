import * as Event from '../../../event.js';
import * as Routing from '../../../routing.js';
import * as TestUtil from '../../../test/util.js';

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
