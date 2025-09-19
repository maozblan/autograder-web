import * as WebUI from '../index.js';
import * as Util from '../util/index.js';

function init() {
    Util.setTestingMode(true);
    WebUI.init(false);
}

beforeEach(function() {
    init();
});
