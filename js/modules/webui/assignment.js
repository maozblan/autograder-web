import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Log from './log.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    let requirements = {assignment: true};
    Routes.addRoute(/^course\/assignment$/, handlerAssignment, requirements);
    Routes.addRoute(/^course\/assignment\/peek$/, handlerPeek, requirements);
    Routes.addRoute(/^course\/assignment\/history$/, handlerHistory, requirements);
    Routes.addRoute(/^course\/assignment\/submit$/, handlerSubmit, requirements);
}

function handlerAssignment(path, params, context) {
    setContextNav(path, params, context);

    let html = `
        <h2>Assignment: ${context.assignment.name}</h2>
    `;

    let actions = assignmentActions(context);
    if (actions.length > 0) {
        let actionsHTML = [];
        for (const [label, link] of actions) {
            actionsHTML.push(`<li><a href='${link}'>${label}</a></li>`);
        }

        html += `
            <h3>Assignment Actions:</h3>
            <ul class='action-list'>
                ${actionsHTML.join('')}
            </ul>
        `;
    }

    document.querySelector('.content').innerHTML = html;
}

function handlerPeek(path, params, context) {
    setContextNav(path, params, context, 'Peek');
    Core.loading();

    Autograder.Submissions.peek(context.courseID, context.assignmentID, params['submission-id'])
        .then(function(result) {
            if (!result['found-user']) {
                Log.warn("Could not find submission user.", context);
                return Core.redirectHome();
            }

            if (!result['found-submission']) {
                Log.warn("Could not find submission.", context);
                return Core.redirectHome();
            }

            renderPeek(context, result['submission-result']);
        })
        .catch(function(result) {
            Log.warn(result, context);
            return Core.redirectHome();
        });
}

function handlerHistory(path, params, context) {
    setContextNav(path, params, context, 'History');
    Core.loading();

    Autograder.Submissions.history(context.courseID, context.assignmentID)
        .then(function(result) {
            if (!result['found-user']) {
                Log.warn("Could not find submission user.", context);
                return Core.redirectHome();
            }

            renderHistory(context, result['history']);
        })
        .catch(function(result) {
            Log.warn(result, context);
            return Core.redirectHome();
        });
}

function handlerSubmit(path, params, context) {
    setContextNav(path, params, context, 'Submit');

    let html = `
        <div>
            <div>
                <label for='files'>Files:</label>
                <input type='file' multiple='true' name='files' placeholder='submission files' />
            </div>
            <button disabled>Submit</button>
        </div>
    `;

    // Attach the handlers after the button exists so we can bind the context.
    let doc = new DOMParser().parseFromString(html, 'text/html');
    let button = doc.querySelector('button');
    let input = doc.querySelector('input');

    // File change handler (enable submit with files).
    input.addEventListener('change', function(event) {
        if (event.target.files) {
            button.disabled = false;
        } else {
            button.disabled = true;
        }
    });

    // Submit handler.
    button.addEventListener('click', function() {
        submit(context);
    });

    document.querySelector('.content').appendChild(doc.querySelector('div'));
}

function submit(context) {
    let files = document.querySelector('.content input').files;
    if (files.length < 1) {
        Log.warn("No submission files provided.");
        return;
    }

    Core.loading();

    Autograder.Submissions.submit(context.courseID, context.assignmentID, files)
        .then(function(result) {
            renderSubmit(context, result);
        })
        .catch(function(result) {
            Log.warn(result, context);
            return Core.redirectHome();
        });
}

function setContextNav(path, params, context, terminalCrumbName = undefined) {
    let breadcrumbs = [
        Core.makeNavItem(context.course.name, Core.formHashPath('course',
                {'course-id': context.courseID})),
        Core.makeNavItem(context.assignment.name, Core.formHashPath('course/assignment',
                {'course-id': context.courseID, 'assignment-id': context.assignmentID})),
    ];

    if (terminalCrumbName) {
        breadcrumbs.push(Core.makeNavItem(terminalCrumbName, Core.formHashPath(path, params)));
    }

    Core.renderBreadcrumbs(breadcrumbs);
}

function assignmentActions(context) {
    let role = Autograder.Users.getCourseRoleValue(context.course.role);
    let actions = [];

    if (role >= Autograder.Users.COURSE_ROLE_STUDENT) {
        let params = {
            'course-id': context.courseID,
            'assignment-id': context.assignmentID,
        };

        actions.push(['Submit', Core.formHashPath('course/assignment/submit', params)]);
        actions.push(['Peek a Previous Submission', Core.formHashPath('course/assignment/peek', params)]);
        actions.push(['View Submission History', Core.formHashPath('course/assignment/history', params)]);
    }

    return actions;
}

function renderPeek(context, submission) {
    let html = submissionToHTML(context, submission);
    document.querySelector('.content').innerHTML = html;
}

function renderHistory(context, history) {
    let rowsHTML = [];
    for (const record of history.toReversed()) {
        let submissionTime = (new Date(record['grading_start_time'])).toLocaleString();

        let params = {
            'course-id': context.courseID,
            'assignment-id': context.assignmentID,
            'submission-id': record['short-id'],
        };
        let peekLink = Core.formHashPath('course/assignment/peek', params);

        rowsHTML.push(`
            <tr>
                <td><a href='${peekLink}'>${record['short-id']}</a></td>
                <td>${record['score']}</td>
                <td>${record['max_points']}</td>
                <td>${submissionTime}</td>
                <td>${record['message']}</td>
            </tr>
        `);
    }

    let html = `
        <div class='submission-history'>
            <h2>${context.assignment.name}</h2>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Short ID</th>
                            <th>Score</th>
                            <th>Max Points</th>
                            <th>Submission Time</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHTML.join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;

    document.querySelector('.content').innerHTML = html;
}

function renderSubmit(context, result) {
    if (result.rejected) {
        document.querySelector('.content').innerHTML = `
            <h3>Submission Rejected</h3>
            <p>${result.message}</p>
        `;
        return;
    }

    if (!result['grading-success']) {
        document.querySelector('.content').innerHTML = `
            <h3>Grading Failed</h3>
            <p>${result.message}</p>
        `;
        return;
    }

    let html = submissionToHTML(context, result.result);
    document.querySelector('.content').innerHTML = html;
}


function submissionToHTML(context, submission) {
    let submissionTime = (new Date(submission['grading_start_time'])).toLocaleString();

    let messageHTML = '';
    if (submission.message) {
        messageHTML = makeTableRow('Message', submission['message'], 'message');
    }

    let html = `
        <div class='submission'>
            <h2>${context.assignment.name}</h2>
            <div class='submission-metadata'>
                <table>
                    <tbody>
                        ${makeTableRow('Short Submission ID', submission['short-id'], 'short-id')}
                        ${makeTableRow('Full Submission ID', submission['id'], 'id')}
                        ${makeTableRow('User', submission['user'], 'user')}
                        ${makeTableRow('Course ID', submission['course-id'], 'course-id')}
                        ${makeTableRow('Assignment ID', submission['assignment-id'], 'assignment-id')}
                        ${makeTableRow('Submission Time', submissionTime, 'submission-time')}
                        ${makeTableRow('Max Points', submission['max_points'], 'max-points')}
                        ${makeTableRow('Score', submission['score'], 'score')}
                        ${messageHTML}
                    </tbody>
                </table>
            </div>
            <div class='submission-questions'>
                ${questionsToHTML(submission.questions)}
            </div>
        </div>
    `;

    return html;
}

function questionsToHTML(questions) {
    let questionsHTML = [];

    for (const [i, question] of questions.entries()) {
        let messageHTML = '';
        if (question.message) {
            messageHTML = makeTableRow('Message', question['message'], 'message');
        }

        questionsHTML.push(`
            <div class='submission-question'>
                <h3 data-index='${i}' data-name='${question['name']}'>
                    Question ${i + 1}: ${question['name']}
                </h3>
                <table data-index='${i}' data-name='${question['name']}'>
                    <tbody>
                        ${makeTableRow('Name', question['name'], 'name')}
                        ${makeTableRow('Max Points', question['max_points'], 'max-points')}
                        ${makeTableRow('Score', question['score'], 'score')}
                        ${messageHTML}
                    </tbody>
                </table>
            </div>
        `);
    }

    return questionsHTML.join('');
}

function makeTableRow(label, value, name = undefined) {
    let nameHTML = '';
    if (name) {
        nameHTML = `data-name='${name}'`;
    }

    return `
        <tr ${nameHTML}>
            <th class='label'>${label}</th>
            <td class='value'>${value}</td>
        </tr>
    `;
}

export {
    init,
}
