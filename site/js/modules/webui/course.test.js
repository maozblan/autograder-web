import * as Event from './event.js';
import * as Routing from './routing.js';
import * as TestUtil from './test/util.js';

test('Enrolled Courses', async function() {
    await TestUtil.loginUser('course-student');
    await TestUtil.navigate(Routing.PATH_COURSES);

    TestUtil.checkPageBasics('Enrolled Courses', 'enrolled courses');

    const expectedLabelNames = [
        'Course 101',
        'Course Using Different Languages',
    ];
    TestUtil.checkCards(expectedLabelNames);
});

describe('Nav Course101', function() {
    // [[user, [expected card labels], error substring], ...].
    const testCases = [
        [
            'course-other',
            [
                'Homework 0',
            ],
            undefined,
        ],
        [
            'course-student',
            [
                'Homework 0',
            ],
            undefined,
        ],
        [
            'course-grader',
            [
                'Homework 0',
                'Email Users',
                'List Users',
            ],
            undefined,
        ],
        [
            'server-user',
            undefined,
            'is not enrolled in course',
        ],
        [
            'server-admin',
            [
                'Homework 0',
                'Email Users',
                'List Users',
            ],
            undefined,
        ],
    ];

    const targetCourse = 'course101';

    test.each(testCases)("%s", async function(user, expectedLabelNames, errorSubstring) {
        await TestUtil.loginUser(user);

        // If there is an error substring, we expect navigation to fail.
        if (errorSubstring) {
            await TestUtil.expectFailedNavigation(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: targetCourse}, errorSubstring);
            return;
        }

        await TestUtil.navigate(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: targetCourse});

        TestUtil.checkPageBasics(targetCourse, 'course');
        TestUtil.checkCards(expectedLabelNames);
    });
});

describe('Nav HW0', function() {
    // [[user, [expected card labels]], ...].
    const testCases = [
        [
            'course-other',
            [],
        ],
        [
            'course-student',
            [
                'Peek a Previous Submission',
                'Submit',
                'View Submission History',
                'Fetch Submission Attempt',
            ],
        ],
        [
            'course-grader',
            [
                'Peek a Previous Submission',
                'Submit',
                'View Submission History',
                'Fetch Course Scores',
                'Fetch Submission Attempt',
                'Proxy Regrade',
                'Proxy Resubmit',
                'Remove Submission',
                'View User History',
            ],
        ],
        [
            'course-admin',
            [
                'Peek a Previous Submission',
                'Submit',
                'View Submission History',
                'Fetch Course Scores',
                'Fetch Submission Attempt',
                'Individual Analysis',
                'Pairwise Analysis',
                'Proxy Regrade',
                'Proxy Resubmit',
                'Remove Submission',
                'View User History',
            ],
        ],
    ];

    const targetCourse = 'course101';
    const targetAssignment = 'hw0';

    test.each(testCases)("%s", async function(user, expectedLabelNames) {
        await TestUtil.loginUser(user);
        await TestUtil.navigate(
                Routing.PATH_ASSIGNMENT,
                {[Routing.PARAM_COURSE]: targetCourse, [Routing.PARAM_ASSIGNMENT]: targetAssignment});

        TestUtil.checkPageBasics(`${targetAssignment} :: Autograder`, 'assignment');
        TestUtil.checkCards(expectedLabelNames);
    });
});

test('Course Users List', async function() {
    const targetCourse = 'course101';
    const expectedEmails = [
        'course-admin@test.edulinq.org',
        'course-grader@test.edulinq.org',
        'course-other@test.edulinq.org',
        'course-owner@test.edulinq.org',
        'course-student@test.edulinq.org',
    ];

    await TestUtil.loginUser('course-admin');
    await TestUtil.navigate(Routing.PATH_COURSE_USERS_LIST, {[Routing.PARAM_COURSE]: targetCourse});

    TestUtil.checkPageBasics(targetCourse, 'users');

    await TestUtil.submitTemplate();

    let results = document.querySelector('.results-area').innerHTML;

    for (const expectedEmail of expectedEmails) {
        expect(results).toContain(expectedEmail);
    }
});

// Navigate to multiple courses to ensure that the course context is properly loaded for each.
test('Nav Multiple Courses', async function() {
    const user = 'course-admin';

    await TestUtil.loginUser(user);

    await TestUtil.navigate(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: 'course101'});
    TestUtil.checkPageBasics('course101', 'course');

    await TestUtil.navigate(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: 'course-languages'});
    TestUtil.checkPageBasics('course-languages', 'course');
});
