import * as Core from '../../../core/index.js';
import * as TestUtil from '../../../test/util.js';

test('Individual Analysis', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Core.Routing.PATH_ANALYSIS_INDIVIDUAL,
            {[Core.Routing.PARAM_COURSE]: 'course101', [Core.Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment individual analysis');

    document.querySelector('.input-field[data-name="submissions"] input').value = JSON.stringify([
            "course101::hw0::course-student@test.edulinq.org::1697406256",
            "course101::hw0::course-student@test.edulinq.org::1697406265",
        ]
    );
    document.querySelector('.input-field #dryRun').checked = true;
    document.querySelector('.input-field #wait').checked = true;
    document.querySelector('.input-field #overwrite').checked = true;

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('"complete": true');
    expect(results).toContain('"pending-count": 0');
    expect(results).toContain('"overwrite-records": true');
});
