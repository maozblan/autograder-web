import fs from 'node:fs';
import path from 'node:path';

import * as Input from '../../input.js';
import * as Routing from '../../routing.js';
import * as TestUtil from '../../test/util.js';

test('Submit Assignment', async function() {
    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(
            Routing.PATH_SUBMIT,
            {[Routing.PARAM_COURSE]: 'course101', [Routing.PARAM_ASSIGNMENT]: 'hw0'},
    );

    TestUtil.checkPageBasics('hw0', 'assignment submit');

    const fileContent = fs.readFileSync(path.join('site', 'js', 'modules', 'autograder', 'test', 'data', 'hw0_solution.py'), 'utf8');
    const fileObj = new File([fileContent], 'hw0_solution.py');
    document.querySelector('.input-field[data-name="files"] input')[Input.TEST_FILES_KEY] = [fileObj];

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;
    expect(results).toContain('Score');
});
