import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Log from './log.js'
import * as Routes from './routes.js'

function init() {
    let requirements = {assignment: true};
    Routes.addRoute(/^course\/assignment$/, handlerAssignment, requirements);
    Routes.addRoute(/^course\/assignment\/peek$/, handlerPeek, requirements);
    Routes.addRoute(/^course\/assignment\/history$/, handlerHistory, requirements);
}

function handlerAssignment(path, params, context) {
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

function handlerPeek(path, params, context) {
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

function renderPeek(context, submission) {
    let html = submissionToHTML(context, submission);
    document.querySelector('.content').innerHTML = html;
}

function handlerHistory(path, params, context) {
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

function renderHistory(context, history) {
    let rowsHTML = [];
    for (const record of history.toReversed()) {
        let submissionTime = Date(record['grading_start_time']).toLocaleString();

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

function submissionToHTML(context, submission) {
    let submissionTime = Date(submission['grading_start_time']).toLocaleString();

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
