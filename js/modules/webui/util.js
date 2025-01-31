function caseInsensitiveStringCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

export {
    caseInsensitiveStringCompare,
}
