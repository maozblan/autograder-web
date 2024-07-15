function notify(message) {
    console.info(message);
    alert(message);
}

function warn(message) {
    console.warn(message);
    alert(message);
}

export {
    notify,
    warn,
}
