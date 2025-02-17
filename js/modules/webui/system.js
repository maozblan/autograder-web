let _isLightMode = undefined;

function init() {
    initBrightMode();
}

function initBrightMode() {
    setBrightMode(isSystemLightMode());

    // Watch for radio button changes.
    let fieldset = document.querySelector('.bright-mode-toggle fieldset');
    if (fieldset) {
        fieldset.addEventListener('change', function(event) {
            let radio = document.querySelector('.bright-mode-toggle input[data-islight=true]');
            setBrightMode(radio.checked);
        });
    }

    // Watch for system changes.
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(event) {
            setBrightMode(!event.matches);
        });
    }
}

function setBrightMode(isLight) {
    _isLightMode = isLight;

    // Set UI beight mode selector.
    let toggle = document.querySelector(`.bright-mode-toggle input[data-islight=${_isLightMode}]`);
    if (toggle) {
        toggle.checked = true;
    }

    // Set the page's mode.
    if (isLight) {
        document.querySelector('html').classList.remove('dark');
        document.querySelector('html').classList.add('light');
    } else {
        document.querySelector('html').classList.remove('light');
        document.querySelector('html').classList.add('dark');
    }
}

function isSystemLightMode() {
    // Default to light mode.
    if (!window.matchMedia) {
        return true;
    }

    return !window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function isLightMode() {
    return _isLightMode;
}

function isDarkMode() {
    return !isLightMode();
}

export {
    init,

    isDarkMode,
    isLightMode,
}
