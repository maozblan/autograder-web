function caseInsensitiveStringCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function renderAutograderError(message) {
    let result = '<p>The request to the autograder did not complete successfully.</p>';

    if (message) {
        result += `
            <p>Message from the autograder:<p>
            <p>${message}</p>
        `;
    }

    return result;
}

export {
    caseInsensitiveStringCompare,
    renderAutograderError,
}
