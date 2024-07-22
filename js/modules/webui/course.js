import * as Autograder from '/js/modules/autograder/base.js'
import * as Core from './core.js'
import * as Routes from './routes.js'
import * as Util from './util.js'

function init() {
    Routes.addRoute(/^course$/, handlerCourse);
}

function handlerCourse(path, params) {
    // TEST
    console.log("Course");
    console.log(params);

    let contextUser = Core.getContextUser();
    // TEST
    console.log(contextUser);

    let courseID = params.id;
    if (!courseID) {
        Util.warn('No course id specified.');
        return Core.redirectHome();
    }

    let course = contextUser.courses[params.id];
    if (!course) {
        Util.warn(`Could not find specified course '${params.id}'.`);
        return Core.redirectHome();
    }

    // TEST
    console.log(course);

    let actions = _courseActions(courseID, course.role);
    // TEST
    console.log(actions);
}

function _courseActions(courseID, roleString) {
    let role = Autograder.Users.getCourseRoleValue(roleString);
    let actions = [];

    if (role >= Autograder.Users.COURSE_ROLE_STUDENT) {
        actions.push(['Submit an Assignment', Core.formHashPath('submit', {'course-id': courseID})]);
        actions.push(['Peek a Previous Submission', Core.formHashPath('peek', {'course-id': courseID})]);
        actions.push(['View Submission History', Core.formHashPath('history', {'course-id': courseID})]);
    }

    return actions;
}

export {
    init,
    handlerCourse,
}
