import * as Event from './event.js';

let _testing = false;

function setTesting(value) {
    _testing = value;
}

function caseInsensitiveStringCompare(a, b) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' });
}

function timestampToPretty(timestamp) {
    return (new Date(timestamp)).toLocaleString();
}

// Trigger an in-memory file to be downloaded by the user.
function downloadFile(file) {
    let eventDetails = {
        'filename': file.name,
        'testing': _testing,
    };

    if (_testing) {
        Event.dispatchEvent(Event.EVENT_TYPE_DOWNLOAD_FILE_COMPLETE, eventDetails);
        return false;
    }

    const link = document.createElement('a');
    const url = URL.createObjectURL(file);

    link.href = url;
    link.download = file.name;
    link.click();

    // Clean up by revoking the object URL.
    setTimeout(function() {
        URL.revokeObjectURL(url);
    }, 10);

    Event.dispatchEvent(Event.EVENT_TYPE_DOWNLOAD_FILE_COMPLETE, eventDetails);
    return true;
}

export {
    caseInsensitiveStringCompare,
    downloadFile,
    setTesting,
    timestampToPretty,
}
