import fs from 'node:fs';
import path from 'node:path';

import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Submit testing', async function() {
    Base.init(false);

    const fileContent = fs.readFileSync(path.join('site', 'js', 'modules', 'autograder', 'test', 'data', 'hw0_solution.py'), 'utf8');
    const fileObj = new File([fileContent], 'hw0_solution.py');

    await TestUtil.loginUser('course-admin');

    let targetCourse = 'course101';
    let targetAssignment = 'hw0';
    let pathComponents = {
        'path': Routing.PATH_SUBMIT,
        'params': {
            [Routing.PARAM_ASSIGNMENT]: targetAssignment,
            [Routing.PARAM_COURSE]: targetCourse,
        },
    };

    let courseRenderedPromise = Event.getEventPromise(Event.EVENT_TYPE_ROUTING_COMPLETE, pathComponents);

    Routing.routeComponents(pathComponents);
    await courseRenderedPromise;

    TestUtil.checkPageBasics(targetAssignment, 'assignment submit');
    
    document.querySelector('input[type="file"]')['__test-files'] = [fileObj];

    let resultWaitPromise = Event.getEventPromise(Event.EVENT_TYPE_TEMPLATE_RESULT_COMPLETE);
    document.querySelector('.submit-controls button').disabled = false;
    document.querySelector('.submit-controls button').click();
    await resultWaitPromise;

    let results = document.querySelector('.submit-results').innerHTML;
    console.log(results);
});
