if (typeof JPlus == 'undefined') {
    var JPlus = {};
}
if (typeof JPlus.Options == 'undefined') {
    JPlus.Messages = {};
}
if (typeof JPlus.Options == 'undefined') {
    JPlus.Options = {};
}
if (typeof JPlus.Options.Data == 'undefined') {
    JPlus.Options.Data = {};
}
if (typeof JPlus.Extend == 'undefined') {
    JPlus.Extend = {};
}
if (typeof JPlus.Override == 'undefined') {
    JPlus.Override = {};
}

if (typeof JPlus.Extend.WorkController == 'undefined') {
    JPlus.Extend.WorkController = {};
}
if (typeof JPlus.Extend.PlanController == 'undefined') {
    JPlus.Extend.PlanController = {};
}

JPlus.Debug = function () {
    // TODO: add cookie driven logic for this
    return true;
}
JPlus.log = function (message) {
    if (JPlus.Debug) {
        console.log("j+ :", message);
    }
}
JPlus.info = function (message) {
    if (JPlus.Debug) {
        console.info("j+ :", message);
    }
}
JPlus.warn = function (message) {
    if (JPlus.Debug) {
        console.warn("j+ :", message);
    }
}
JPlus.error = function (message) {
    if (JPlus.Debug) {
        console.error("j+ :", message);
    }
}

JPlus.IsBacklog = function () {
    if ($('#ghx-plan').length > 0) {
        if ($("#ghx-plan").children().length > 0) {
            return true;
        }
    }
    return false;
}
JPlus.IsSprint = function () {
    if ($('#ghx-work').length > 0) {
        if ($("#ghx-work").children().length > 0) {
            return true;
        }
    }
    return false;
}
JPlus.IsDetail = function () {
    if ($(".issue-body-content").length > 0) {
        return true;
    }
    return false;
}

JPlus.Init = function () {
    // Listen for Options changes
    window.addEventListener('message', function (event) {
        if (event && event.data) {
            if (event.data.type && event.data.type === 'jplus-options' && event.data.data) {
                JPlus.Options.Data = event.data.data;
                JPlus.log('global - options data received');
            }
        } else {
            JPlus.error('Options Data not received correctly.');
        }
    });

    // Ask for latest Options
    JPlus.Options.Get();

    window.dispatchEvent(new Event('jplus-ready'));
    JPlus.log('jplus-ready');
}

JPlus.Messages.showSuccessMsg = function (message, options = { closeable: true }) {
    JIRA.Messages.showSuccessMsg(message, options);
}
JPlus.Messages.showWarningMsg = function (message, options = { closeable: true }) {
    JIRA.Messages.showWarningMsg(message, options);
}
JPlus.Messages.showErrorMsg = function (message, options = { closeable: true }) {
    JIRA.Messages.showErrorMsg(message, options);
}

JPlus.Options.Get = function () {
    window.postMessage({ type: 'jplus-get-options' }, '*');
}
JPlus.Options.Customization = function (customization) {
    if (JPlus.Options.Data &&
        JPlus.Options.Data.connection &&
        JPlus.Options.Data.connection.jiraUrl &&
        JPlus.Options.Data.connection.jiraUrl.length > 0 &&
        JPlus.Options.Data.customizations
    ) {
        var c = JPlus.Options.Data.customizations[customization];
        if (c) {
            if (c.enabled) {
                return c.data;
            }
        }
    }
    return null;
}

// Sprint View
JPlus.Extend.WorkController.setPoolData = function (data) {
    $(document).trigger('jplus-sprint-is-rendered');
}

// Sprint View
if (GH && GH.WorkController) {
    window.addEventListener('jplus-ready', function () {
        JPlus.Override.WorkController = {};
        JPlus.Override.WorkController.setPoolData = GH.WorkController.setPoolData;
        GH.WorkController.setPoolData = function (data) {
            JPlus.Override.WorkController.setPoolData(data);
            JPlus.Extend.WorkController.setPoolData(data);
        }
    });
}

// Backlog View
JPlus.Extend.PlanController.show = function () {
    JPlus.log('override for planController show');
    $(document).trigger('jplus-backlog-is-loaded');
}

// Backlog View
if (GH && GH.PlanController) {
    window.addEventListener('jplus-ready', function () {
        JPlus.Override.PlanController = {};
        JPlus.Override.PlanController.show = GH.PlanController.show;
        GH.PlanController.show = function () {
            JPlus.Override.PlanController.show();
            JPlus.Extend.PlanController.show();
        }
    });
}

JPlus.Init();   // fire up JPlus