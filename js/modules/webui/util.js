function init() {
    window.ag = window.ag || {};
    window.ag.util = window.ag.util || {};

    window.ag.util.onKeyEvent = onKeyEvent;
}

function onKeyEvent(event, context, keys, handler) {
    if (!keys.includes(event.key)) {
        return;
    }

    handler(event, context);
}

// Look through parents until one matches the specified query.
function queryAncestor(element, query) {
    if (!element) {
        return undefined;
    }

    if (element.parentElement.matches(query)) {
        return element.parentElement;
    }

    return queryAncestor(element.parentElement, query);
}

function notify(message) {
    console.info(message);
    alert(message);
}

function warn(message) {
    console.warn(message);
    alert(message);
}

function caseInsensitiveStringCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

export {
    caseInsensitiveStringCompare,
    init,
    notify,
    onKeyEvent,
    queryAncestor,
    warn,
}
