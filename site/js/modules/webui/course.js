import * as Autograder from '../autograder/base.js';
import * as Input from './input.js';
import * as Render from './render.js';
import * as Routing from './routing.js';

const COURSE_USER_REFERENCE_DOC_LINK = "https://github.com/edulinq/autograder-server/blob/main/docs/types.md#course-user-reference-courseuserreference";

function init() {
    let requirements = {course: true};
    Routing.addRoute(/^courses$/, handlerCourses, 'Enrolled Courses');
    Routing.addRoute(/^course$/, handlerCourse, 'Course', {course: true});
    Routing.addRoute(/^course\/email$/, handlerEmail, 'Email', {course: true});
    Routing.addRoute(/^course\/list$/, handlerUsers, 'Users', {course: true});
}

function handlerCourses(path, params, context, container) {
    let cards = [];
    for (const [id, course] of Object.entries(context.courses)) {
        let link = Routing.formHashPath(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: course.id});
        cards.push(Render.makeCardObject('course', course.name, link));
    }

    container.innerHTML = `
        ${Render.cards(cards)}
    `;
}

function handlerCourse(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];

    Routing.setTitle(course.id);

    let assignmentCards = [];
    for (const [id, assignment] of Object.entries(course.assignments)) {
        let args = {
            [Routing.PARAM_COURSE]: course.id,
            [Routing.PARAM_ASSIGNMENT]: assignment.id,
        };

        let link = Routing.formHashPath(Routing.PATH_ASSIGNMENT, args);
        assignmentCards.push(Render.makeCardObject('assignment', assignment.name, link));
    }

    let actionCards = [];
    actionCards.push(Render.makeCardObject(
        "course-action",
        "Email Users",
        Routing.formHashPath(Routing.PATH_EMAIL, {
            [Routing.PARAM_COURSE]: course.id,
        }),
    ));

    actionCards.push(Render.makeCardObject(
        "course-action",
        "List Users",
        Routing.formHashPath(Routing.PATH_COURSE_USERS_LIST, {
            [Routing.PARAM_COURSE]: course.id,
        }),
    ));

    let cardSections = [
        ['Assignments', assignmentCards],
        ['Actions', actionCards],
    ];

    container.innerHTML = `
        <h2>${course.name}</h2>
        ${Render.makeCardSections(cardSections)}
    `;
}

function handlerEmail(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let courseLink = Routing.formHashPath(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: course.id});

    let titleHTML = `
        <span>
            <a href='${courseLink}'>${course.id}</a>
            / email
        </span>
    `;
    Routing.setTitle(course.id, titleHTML);

    let description = `
        Separate recipient values with commas.
        For valid recipient values reference this 
        <a href=${COURSE_USER_REFERENCE_DOC_LINK} target="_blank">documentation</a>.
    `;

    let inputFields = [
        new Input.FieldType(context, Routing.PARAM_EMAIL_TO, 'To', {
            extractInputFunc: extractRecipients,
        }),
        new Input.FieldType(context, Routing.PARAM_EMAIL_CC, 'CC', {
            extractInputFunc: extractRecipients,
        }),
        new Input.FieldType(context, Routing.PARAM_EMAIL_BCC, 'BCC', {
            extractInputFunc: extractRecipients,
        }),
        new Input.FieldType(context, Routing.PARAM_EMAIL_SUBJECT, 'Subject', {
            required: true,
        }),
        new Input.FieldType(context, Routing.PARAM_EMAIL_BODY, 'Content', {
            type: Input.INPUT_TYPE_TEXTAREA,
            additionalAttributes: 'rows="10"',
        }),
        new Input.FieldType(context, Routing.PARAM_DRY_RUN, 'Send as Dry Run', {
            type: Input.INPUT_TYPE_BOOL,
        }),
        new Input.FieldType(context, Routing.PARAM_EMAIL_HTML, 'Content in HTML', {
            type: Input.INPUT_TYPE_BOOL,
        }),
    ];

    Render.makePage(
            params, context, container, sendEmail,
            {
                header: 'Email Users',
                description: description,
                inputs: inputFields,
                buttonName: 'Send Email',
            },
        )
    ;
}

function sendEmail(params, context, container, inputParams) {
    inputParams[Routing.PARAM_COURSE_ID] = context.courses[params[Routing.PARAM_COURSE]].id;

    return Autograder.Course.email(inputParams)
        .then(function(result) {
            return `
                <p>Email sent successfully.</p>
                <pre><code data-lang="json">${JSON.stringify(result, null, 4)}</code></pre>
            `;
        })
        .catch(function(message) {
            console.error(message);
            return Render.autograderError(message);
        })
    ;
}

function handlerUsers(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let courseLink = Routing.formHashPath(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: course.id});

    let titleHTML = `
        <span>
            <a href='${courseLink}'>${course.id}</a>
            / users
        </span>
    `;
    Routing.setTitle(course.id, titleHTML);

    let inputFields = [
        new Input.FieldType(context, Routing.PARAM_TARGET_USERS, 'Target Users', {
            type: Input.COURSE_USER_REFERENCE_LIST_FIELD_TYPE,
        }),
    ];

    let description = `
        List the users in the course (defaults to all users).
    `;

    Render.makePage(
            params, context, container, listUsers,
            {
                header: 'List Users',
                description: description,
                inputs: inputFields,
                buttonName: 'List Users',
            },
        )
    ;
}

function listUsers(params, context, container, inputParams) {
    inputParams[Routing.PARAM_COURSE_ID] = context.courses[params[Routing.PARAM_COURSE]].id;
    return Autograder.Course.users(inputParams)
        .then(function(result) {
            if (result.users.length === 0) {
                return '<p>Unable to find target users.</p>';
            }

            return `<pre>${listCourseUsers(result.users)}</pre`;
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

function listCourseUsers(users) {
    let messages = [];
    for (const user of users) {
        let userParts = [
            `Email: ${user['email']}`,
            `Name: ${user['name']}`,
            `Role: ${user['role']}`,
            `LMS ID: ${user['lms-id']}`,
        ];

        messages.push(`${userParts.join("\n")}`);
    }

    return messages.join("\n\n");
}

function extractRecipients(input) {
    let recipientString = input.value;

    if (recipientString === undefined) return [];

    return recipientString
        .split(',')
        .map((recipient) => (recipient.trim()))
        .filter((recipient) => (recipient.length > 0))
    ;
}

export {
    init,
};
