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
    notify,
    warn,
}
