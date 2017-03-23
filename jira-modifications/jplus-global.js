if (typeof JPlus == 'undefined') {
    var JPlus = {};
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

JPlus.Init = function () {
    // Listen for Options changes
    window.addEventListener('message', function (event) {
        if (event && event.data) {
            if (event.data.type && event.data.type === 'jplus-options' && event.data.data) {
                JPlus.Options.Data = event.data.data;
                JPlus.log('global - data received');
            }
        } else {
            JPlus.error('Options Data not received correctly.');
        }
    });

    // Ask for latest Options
    JPlus.Options.Get();

    if (JPlus.IsSprint) {
        JPlus.Extend.WorkController.init();
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


JPlus.Options.Get = function () {
    window.postMessage({ type: 'jplus-get-options' }, '*');
};

/* Extend */
// Sprint View
JPlus.Extend.WorkController.init = function () {
    if (GH && GH.WorkController && GH.CallbackManager) {
        // this will be handy for udpate sprint view items after there are rendered
        GH.CallbackManager.registerCallback('', GH.CallbackManager.CALLBACK_POOL_RENDERED, function () { console.log('callback'); });
    }
    // thiw will be handy for backlog/sprints view
    // GH.SprintView.renderAllSprints & GH.SprintView.updateSprintViewForModel
}
JPlus.Extend.WorkController.show = function () {
    JPlus.log('override for workController show');
}
JPlus.Extend.WorkController.handleIssueUpdate = function () {
    JPlus.log('issue was updated');
}

// Backlog View
JPlus.Extend.PlanController.show = function () {
    JPlus.log('override for planController show');
    $(document).trigger('jplus-backlog-is-loaded');
}

/* Override JIRA */
// Sprint View
if (GH && GH.WorkController) {
    JPlus.Override.WorkController = {};
    JPlus.Override.WorkController.show = GH.WorkController.show;
    GH.WorkController.show = function () {
        JPlus.Override.WorkController.show();
        JPlus.Extend.WorkController.show();
    }
}

// Backlog View
if (GH && GH.PlanController) {
    JPlus.Override.PlanController = {};
    JPlus.Override.PlanController.show = GH.PlanController.show;
    GH.PlanController.show = function () {
        JPlus.Override.PlanController.show();
        JPlus.Extend.PlanController.show();
    }
}

// if (AJS && $(GH)) {
//     AJS.$(GH).bind("issueCreated", JPlus.WorkController.handleIssueUpdate);
//     AJS.$(GH).bind("issueUpdated", JPlus.WorkController.handleIssueUpdate);
//     AJS.$(GH).bind("issuesRemovedFromSprint", JPlus.WorkController.handleIssueUpdate)
// }

//GH.PlanController.show();
//GH.WorkController.show();

JPlus.Init();   // fire up JPlus