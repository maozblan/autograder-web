// Import the entire web UI.
import * as Core from './core/index.js';
import * as Courses from './courses/index.js';
import * as Log from './log.js';
import * as Server from './server/index.js';
import * as Util from './util/index.js';

// TEST - render.

function init() {
    // Start by routing to the desired page.
    Core.route();
}

export {
    init,
};
