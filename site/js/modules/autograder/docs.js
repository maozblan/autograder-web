import * as Core from './core.js';

function get() {
	return Core.sendRequest({
        endpoint: 'metadata/describe',
    });
}

export {
    get,
}
