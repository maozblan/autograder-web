import * as Base from './base.js';
import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Enrolled Courses', async function() {
    Base.init(false);

    await TestUtil.loginUser('course-student');
    await TestUtil.navigate(Routing.PATH_COURSES);

    TestUtil.checkPageBasics('Enrolled Courses', 'enrolled courses');

    const expectedLabelNames = [
        'Course 101',
        'Course Using Different Languages',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

test('Nav Course101', async function() {
    Base.init(false);

    // Each test case is a list of [user, [expected card labels]].
    const testCases = [
        [
            'course-other',
            [
                'Homework 0',
            ],
        ],
        [
            'course-student',
            [
                'Homework 0',
            ],
        ],
        [
            'course-grader',
            [
                'Homework 0',
                'Email Users',
                'List Users',
            ],
        ],
    ];

    const targetCourse = 'course101';

    for (const testCase of testCases) {
        const user = testCase[0];
        const expectedLabelNames = testCase[1];

        await TestUtil.loginUser(user);
        await TestUtil.navigate(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: targetCourse});

        TestUtil.checkPageBasics(targetCourse, 'course');
        TestUtil.checkCards(expectedLabelNames);
    }
});

test('Nav HW0', async function() {
    Base.init(false);

    // Each test case is a list of [user, [expected card labels]].
    const testCases = [
        [
            'course-other',
            [],
        ],
        [
            'course-student',
            [
                'Fetch Submission Attempt',
                'Peek a Previous Submission',
                'Submit',
                'View Submission History',
            ],
        ],
        [
            'course-grader',
            [
                'Fetch Course Scores',
                'Fetch Submission Attempt',
                'Peek a Previous Submission',
                'Proxy Regrade',
                'Proxy Resubmit',
                'Remove Submission',
                'Submit',
                'View Submission History',
                'View User History',
            ],
        ],
        [
            'course-admin',
            [
                'Fetch Course Scores',
                'Fetch Submission Attempt',
                'Individual Analysis',
                'Pairwise Analysis',
                'Peek a Previous Submission',
                'Proxy Regrade',
                'Proxy Resubmit',
                'Remove Submission',
                'Submit',
                'View Submission History',
                'View User History',
            ],
        ],
    ];

    const targetCourse = 'course101';
    const targetAssignment = 'hw0';

    for (const testCase of testCases) {
        const user = testCase[0];
        const expectedLabelNames = testCase[1];

        await TestUtil.loginUser(user);
        await TestUtil.navigate(
                Routing.PATH_ASSIGNMENT,
                {[Routing.PARAM_COURSE]: targetCourse, [Routing.PARAM_ASSIGNMENT]: targetAssignment});

        TestUtil.checkPageBasics('hw0 :: Autograder', 'assignment');
        TestUtil.checkCards(expectedLabelNames);
    }
});
