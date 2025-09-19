import * as Autograder from '../../../autograder/index.js';
import * as Icon from '../../icon.js';
import * as Input from '../../input.js';
import * as Render from '../../render.js';
import * as Routing from '../../routing.js';

function init() {
    Routing.addRoute(/^course\/list$/, handlerUsers, 'Users', Routing.NAV_COURSES, {course: true});
}

function handlerUsers(path, params, context, container) {
    let course = context.courses[params[Routing.PARAM_COURSE]];

    Render.setTabTitle(course.id);

    let inputFields = [
        new Input.FieldType(context, 'targetUsers', 'Target Users', {
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
                iconName: Icon.ICON_NAME_LIST,
            },
        )
    ;
}

function listUsers(params, context, container, inputParams) {
    let course = context.courses[params[Routing.PARAM_COURSE]].id;

    return Autograder.Courses.Users.list(course, inputParams.targetUsers)
        .then(function(result) {
            if (result.users.length === 0) {
                return '<p>Unable to find target users.</p>';
            }

            Render.apiOutputSwitcher(result.users, container, {
                renderOptions: new Render.APIValueRenderOptions({
                    keyOrdering: ['email', 'name', 'role', 'lms-id'],
                    initialIndentLevel: -1,
                }),
                modes: [
                    Render.API_OUTPUT_SWITCHER_TEXT,
                    Render.API_OUTPUT_SWITCHER_TABLE,
                    Render.API_OUTPUT_SWITCHER_JSON,
                ],
            });

            return undefined;
        })
        .catch(function(message) {
            console.error(message);
            return message;
        })
    ;
}

init();
