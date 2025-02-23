function caseInsensitiveStringCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function timestampToPretty(timestamp) {
    return (new Date(timestamp)).toLocaleString();
}

export {
    caseInsensitiveStringCompare,
    timestampToPretty,
}
