import * as Autograder from '../autograder/base.js';
import * as Render from './render.js';
import * as Routing from './routing.js';

function init() {
    let requirements = {course: true};
    Routing.addRoute(/^courses$/, handlerCourses, 'Enrolled Courses');
    Routing.addRoute(/^course$/, handlerCourse, 'Course', {course: true});
    Routing.addRoute(/^course\/users$/, handlerUsers, 'Users', {course: true});
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

    let cards = [];
    for (const [id, assignment] of Object.entries(course.assignments)) {
        let args = {
            [Routing.PARAM_COURSE]: course.id,
            [Routing.PARAM_ASSIGNMENT]: assignment.id,
        };

        let link = Routing.formHashPath(Routing.PATH_ASSIGNMENT, args);
        cards.push(Render.makeCardObject('assignment', assignment.name, link));
    }

    cards.push(Render.makeCardObject(
        "course-action",
        "Course Users",
        Routing.formHashPath(Routing.PATH_USERS, {
            [Routing.PARAM_COURSE]: course.id,
        }),
    ));

    container.innerHTML = `
        <h2>${course.name}</h2>
        ${Render.cards(cards)}
    `;
}

function handlerUsers(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    const courseLink = Routing.formHashPath(Routing.PATH_COURSE, {[Routing.PARAM_COURSE]: course.id});

    const titleHTML = `
        <span>
            <a href='${courseLink}'>${course.id}</a>
            / Users
        </span>
    `;
    Routing.setTitle(course.id, titleHTML);

    let html = `<h2>Course Users</h2><div class='course-users'>`;

    Autograder.Users.listCourseUsers(course.id).then((courseUsers) => {
        const users = courseUsers.users;
        const mailTo = (email) => `<a href='mailto:${email}'>${email}</a>`;

        html += Render.table({
            head: ['Name', 'Role', 'Email', 'LMS ID'],
            body: users.map(user => [user.name, user.role, mailTo(user.email), mailTo(user['lms-id'])]),
        });

        container.innerHTML = html + `</div>`;
    }).catch((message) => {
        container.innerHTML = Render.autograderError(message) + `</div>`;
    });
}

export {
    init,
};
