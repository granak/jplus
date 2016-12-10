var jiraUrl = '';
var jPlusSettingsUrl = '';
var extraStyling;
var defintionOfDone;
var defintionOfReady;
var rightClickActions;
var quickJump;

var extraStylingData;
var definitionOfReadyData;
var rightClickActionsData;

function showSuccess(message) {
    var timeout = 750;
    showAlert('success-message-area', message, timeout);
}
function showWarning(message) {
    var timeout = 2000;
    showAlert('warning-message-area', message, timeout);
}
function showError(message) {
    var timeout = 5000;
    showAlert('error-message-area', message, timeout);
}

function showAlert(id, message, timeout) {
    var messageArea = $('#' + id);
    messageArea.text(message);
    messageArea.fadeIn();
    setTimeout(function () {
        messageArea.fadeOut();
    }, timeout);
}

function restoreLocalOptions() {
    chrome.storage.sync.get({
        jiraUrl: '',
        jPlusSettingsUrl: '',
        extraStyling: true,
        defintionOfDone: true,
        defintionOfReady: true,
        rightClickActions: true,
        quickJump: true,
        extraStylingData: { hideNoneItems: true, stylingData: [] },
        definitionOfReadyData: '',
        rightClickActionsData: { showBrowserContextMenu: true, extendJiraContextMenu: true }
    }, function (items) {
        jiraUrl = items.jiraUrl;
        jPlusSettingsUrl = items.jPlusSettingsUrl;
        extraStyling = items.extraStyling;
        defintionOfDone = items.defintionOfDone;
        defintionOfReady = items.defintionOfReady;
        rightClickActions = items.rightClickActions;
        quickJump = items.quickJump;

        extraStylingData = items.extraStylingData;
        definitionOfReadyData = items.definitionOfReadyData;
        rightClickActionsData = items.rightClickActionsData;

        $('#jira-url').val(jiraUrl);
        $('#settings-url').val(jPlusSettingsUrl);
        $('#extraStylingSwitchOption').prop('checked', extraStyling);
        $('#dodSwitchOption').prop('checked', defintionOfDone);
        $('#dorSwitchOption').prop('checked', defintionOfReady);
        $('#rightClickSwitchOption').prop('checked', rightClickActions);
        $('#quickJumpSwitchOption').prop('checked', quickJump);

        toggleCustomizationPanels();
        var savedData = {
            styling: extraStylingData,
            definitionOfReady: definitionOfReadyData,
            rightClickActions: rightClickActionsData
        }
        $(document).trigger('optionsLoaded', savedData);
    });
}

function restoreRemoteOptions() {

    toggleCustomizationPanels();
    $(document).trigger('optionsLoaded');
}

function saveLocalOptions() {
    jiraUrl = $('#jira-url').val();
    jPlusSettingsUrl = $('#settings-url').val();
    extraStyling = $('#extraStylingSwitchOption').prop('checked');
    defintionOfDone = $('#dodSwitchOption').prop('checked');
    defintionOfReady = $('#dorSwitchOption').prop('checked');
    rightClickActions = $('#rightClickSwitchOption').prop('checked');
    quickJump = $('#quickJumpSwitchOption').prop('checked');

    chrome.storage.sync.set({
        jiraUrl: jiraUrl,
        jPlusSettingsUrl: jPlusSettingsUrl,
        extraStyling: extraStyling,
        defintionOfDone: defintionOfDone,
        defintionOfReady: defintionOfReady,
        rightClickActions: rightClickActions,
        quickJump: quickJump
    }, function () {
        showSuccess('Saved');
    });
}

function clearStorage() {
    chrome.storage.sync.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

function toggleCustomizationPanels() {
    toggleCustomizationPanel($('#extra-styling-panel'), extraStyling);
    toggleCustomizationPanel($('#definition-of-done-panel'), defintionOfDone);
    toggleCustomizationPanel($('#definition-of-ready-panel'), defintionOfReady);
    toggleCustomizationPanel($('#right-click-actions-panel'), rightClickActions);
    toggleCustomizationPanel($('#quick-jump-panel'), quickJump);
}
function toggleCustomizationPanel(element, property) {
    if (property === true) {
        element.show();
    } else {
        element.hide();
    }
}

$(document).on('DOMContentLoaded', function () {
    restoreLocalOptions();
});

// On checkbox stat changed
$('#master-options input[type="checkbox"]').on('change', function (e) {
    saveLocalOptions();
});

// On tab changed
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href");
    if (target === '#customization') {
        restoreLocalOptions();
    }
});
