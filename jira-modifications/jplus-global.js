if (typeof JPlus == 'undefined') {
    var JPlus = {};
}

if (typeof JPlus.Options == 'undefined') {
    JPlus.Options = {};
}
if (typeof JPlus.Options.Data == 'undefined') {
    JPlus.Options.Data = {};
}

JPlus.Options.Get = function () {
    window.postMessage({ type: 'jplus-get-options' }, '*');
};

(function () {
    JPlus.Options.Get();
    console.log('global initialized');
})();

window.addEventListener('message', function (event) {
    if (event && event.data) {
        if (event.data.type && event.data.type === 'jplus-options' && event.data.options) {
            JPlus.Options.Data = event.data.options;
        }
    }
    else {
        console.error('jPlus Options Data not received correctly.');
    }
})