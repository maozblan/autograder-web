import * as Autograder from '../autograder/base.js'

import * as Log from './log.js'
import * as Render from './render.js'
import * as Routing from './routing.js'

const PATH_SUBMIT = 'course/assignment/submit';
const PATH_PEEK = 'course/assignment/peek';
const PATH_HISTORY = 'course/assignment/history';

function init() {
    let requirements = {assignment: true};
    Routing.addRoute(/^course\/assignment$/, handlerAssignment, 'Assignment', requirements);
    Routing.addRoute(/^course\/assignment\/peek$/, handlerPeek, 'Assignment Peek', requirements);
    Routing.addRoute(/^course\/assignment\/history$/, handlerHistory, 'Assignment History', requirements);
    Routing.addRoute(/^course\/assignment\/submit$/, handlerSubmit, 'Assignment Submit', requirements);
}

function handlerAssignment(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];

    Routing.setTitle(assignment.name);

    let args = {
        [Routing.PARAM_COURSE]: course.id,
        [Routing.PARAM_ASSIGNMENT]: assignment.id,
    };

    let cards = [
        Render.makeCardObject('assignment-action', 'Submit', Routing.formHashPath(PATH_SUBMIT, args)),
        Render.makeCardObject('assignment-action', 'Peek a Previous Submission', Routing.formHashPath(PATH_PEEK, args)),
        Render.makeCardObject('assignment-action', 'View Submission History', Routing.formHashPath(PATH_HISTORY, args)),
    ];

    container.innerHTML = `
        <h2>${assignment.name}</h2>
        ${Render.cards(cards)}
    `;
}

function handlerPeek(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];
    let assignment = course.assignments[params[Routing.PARAM_ASSIGNMENT]];
    let submission = params[Routing.PARAM_SUBMISSION] || undefined;

    container.innerHTML = `
        <div class='peek'>
            <div class='peek-controls page-controls'>
                <button>Peek</button>
                <div>
                    <label>Submission ID:</label>
                    <input type='text' placeholder='Most Recent'>
                </div>
            </div>
            <div class='peek-results'>
            </div>
        </div>
    `;

    let button = container.querySelector('.peek-controls button');
    let input = container.querySelector('.peek-controls input');
    let results = container.querySelector('.peek-results');

    if (submission) {
        input.value = submission;
    }

    button.addEventListener('click', function(event) {
        params[Routing.PARAM_SUBMISSION] = input.value || undefined;

        let path = Routing.formHashPath(PATH_PEEK, params);
        Routing.redirect(path);
    });

    doPeek(context, course, assignment, results, submission);
}

function doPeek(context, course, assignment, container, submission) {
    Routing.loadingStart(container);

    Autograder.Submissions.peek(course.id, assignment.id, submission)
        .then(function(result) {
            let html = "";

            if (!result['found-user']) {
                html = `<p>Could not find submission user: '${context.user.name}'.</p>`;
            } else if (!result['found-submission']) {
                if (submission) {
                    html = `<p>Could not find submission: '${submission}'.</p>`;
                } else {
                    html = `<p>Could not find most recent submission.</p>`;
                }
            } else {
                html = submissionToHTML(assignment, result['submission-result']);
            }

            container.innerHTML = html;
        })
        .catch(function(message) {
            container.innerHTML = Util.renderAutograderError(message);
        })
    ;
}

function handlerHistory(path, params, context, container) {
    // TODO
}

function handlerSubmit(path, params, context, container) {
    // TODO
}

function submissionToHTML(assignment, submission) {
    let submissionTime = (new Date(submission['grading_start_time'])).toLocaleString();

    let messageHTML = '';
    if (submission.message) {
        messageHTML = makeTableRow('Message', submission['message'], 'message');
    }

    let html = `
        <div class='submission'>
            <h2>${assignment.name}: Submission ${submission['short-id']}</h2>
            <div class='submission-metadata'>
                <h3>Summary</h3>
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
            <div class='submission-questions-area'>
                <h3>Questions</h3>
                ${questionsToHTML(submission.questions)}
            </div>
        </div>
    `;

    return html;
}

function questionsToHTML(questions) {
    let questionsHTML = [
        `<div class='submission-questions'>`,
    ];

    for (const [i, question] of questions.entries()) {
        let messageHTML = '';
        if (question.message) {
            messageHTML = makeTableRow('Message', question['message'], 'message');
        }

        questionsHTML.push(`
            <div class='submission-question'>
                <h4 data-index='${i}' data-name='${question['name']}'>
                    ${question['name']}
                </h4>
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

    questions.push('</div>');

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
