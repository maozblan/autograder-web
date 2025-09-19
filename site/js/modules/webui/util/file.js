import * as Testing from './testing.js';
import * as Event from '../event.js';

// Trigger an in-memory file to be downloaded by the user.
function downloadFile(file) {
    let eventDetails = {
        'filename': file.name,
        'testing': Testing.isTestingMode,
    };

    if (Testing.isTestingMode) {
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
    downloadFile,
}
