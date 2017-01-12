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

window.addEventListener('message', function (event) {
    if (event && event.data) {
        if (event.data.type && event.data.type === 'jplus-options' && event.data.data) {
            JPlus.Options.Data = event.data.data;
            if (JPlus.Debug) {
                console.info('jplus-global - data received');
            }
        }
    } else {
        console.error('jPlus Options Data not received correctly.');
        if (JPlus.Debug) {
            console.log(event);
        }
    }
})