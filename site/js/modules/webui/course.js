import * as Autograder from '../autograder/base.js';
import * as Render from './render.js';
import * as Routing from './routing.js';

function init() {
    let requirements = {course: true};
    Routing.addRoute(/^courses$/, handlerCourses, 'Enrolled Courses');
    Routing.addRoute(/^course$/, handlerCourse, 'Course', {course: true});
    Routing.addRoute(/^course\/email$/, handlerUsers, 'Email', {course: true});
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
        "Email Users",
        Routing.formHashPath(Routing.PATH_EMAIL, {
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
            / email
        </span>
    `;
    Routing.setTitle(course.id, titleHTML);

    container.innerHTML = `
        <div class="email-page">
            <div class="email-content">
                <h2>Email Users</h2>
                <div class="description">
                    <p>Sumbitting this form will send an email to all users enrolled in the course.</p>
                    <p>Please separate email addresses with commas.</p>
                </div>
                <div class="user-input-fields secondary-color drop-shadow">
                    <fieldset>
                        <div class="input-field">
                            <label for="email-to">To</label>
                            <input type="text" id="email-to" name="to" placeholder="Recipients" required />
                        </div>
                        <div class="input-field">
                            <label for="email-cc">CC</label>
                            <input type="text" id="email-cc" name="cc" placeholder="CC" />
                        </div>
                        <div class="input-field">
                            <label for="email-bcc">BCC</label>
                            <input type="text" id="email-bcc" name="bcc" placeholder="BCC" />
                        </div>
                        <div class="input-field">
                            <label for="email-subject">Subject</label>
                            <input type="text" id="email-subject" name="subject" required />
                        </div>
                        <div class="input-field">
                            <label for="email-body">Content</label>
                            <textarea id="email-body" name="body" rows="10" required></textarea>
                        </div>
                        <div class="checkbox-field">
                            <input type="checkbox" id="dry-run" name="dry-run" />
                            <label for="dry-run">Send as Dry Run</label>
                        </div>
                        <div class="checkbox-field">
                            <input type="checkbox" id="html-format" name="html-format" />
                            <label for="html-format">Content is in HTML</label>
                        </div>
                    </fieldset>
                </div>
                <button class="send-email">Send Email</button>
                <div class="results-area"></div>
            </div>
        </div>
    `;

    document.querySelector('button.send-email').addEventListener('click', function(event) {
        let extractEmails = function(emailString) {
            return emailString
                .split(',')
                .map(email => email.trim())
                .filter(email => email.length > 0)
            ;
        }

        let args = {
            [Routing.PARAM_EMAIL_COURSE]: course.id,
            [Routing.PARAM_EMAIL_TO]: extractEmails(container.querySelector("fieldset [name='to']").value),
            [Routing.PARAM_EMAIL_CC]: extractEmails(container.querySelector("fieldset [name='cc']").value),
            [Routing.PARAM_EMAIL_BCC]: extractEmails(container.querySelector("fieldset [name='bcc']").value),
            [Routing.PARAM_EMAIL_SUBJECT]: container.querySelector("fieldset [name='subject']").value,
            [Routing.PARAM_EMAIL_BODY]: container.querySelector("fieldset [name='body']").value,
            [Routing.PARAM_EMAIL_DRY_RUN]: container.querySelector("fieldset [name='dry-run']").checked,
            [Routing.PARAM_EMAIL_HTML]: container.querySelector("fieldset [name='html-format']").checked,
        };

        for (const key in args) {
            if (args[key] === '' || 
                (Array.isArray(args[key]) && args[key].length === 0)) {
                delete args[key];
            }
        }

        let resultsArea = container.querySelector(".results-area");

        let renderResult = function(message) {
            resultsArea.innerHTML = `<div class="result secondary-color drop-shadow">${message}</div>`;
        };

        Autograder.Course.emailUsers(args)
            .then(function() {
                renderResult('<p>Email sent successfully.</p>');
            })
            .catch(function(message) {
                console.error(message);
                renderResult(Render.autograderError(message));
            })
        ;
    });
}

export {
    init,
};
