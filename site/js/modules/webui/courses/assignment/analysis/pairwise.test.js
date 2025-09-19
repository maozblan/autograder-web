import * as Routing from '../../../routing.js';
import * as TestUtil from '../../../test/util.js';

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
    document.querySelector('.input-field #dryRun').checked = true;
    document.querySelector('.input-field #wait').checked = true;
    document.querySelector('.input-field #overwrite').checked = true;

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('similarities');
    expect(results).toContain('"complete": true');
    expect(results).toContain('"pending-count": 0');
    expect(results).toContain('"overwrite-records": true');
});
