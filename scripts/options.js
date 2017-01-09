var jiraUrl = '';
var jPlusSettingsUrl = '';
var extraStyling;
var defintionOfDone;
var definitionOfReady;
var rightClickActions;
var quickJump;

var extraStylingData;
var definitionOfReadyData;
var rightClickActionsData;
var quickJumpData;

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
        jplus: {
            connection: {
                jiraUrl: '',
                jPlusSettingsUrl: ''
            },
            customizations: {
                extraStyling: {
                    enabled: true,
                    data: { hideNoneItems: true, styling: [] }
                },
                defintionOfDone: {
                    enabled: false,
                    data: {}
                },
                definitionOfReady: {
                    enabled: true,
                    data: { text: '' }
                },
                rightClickActions: {
                    enabled: true,
                    data: { showBrowserContextMenu: true, extendJiraContextMenu: true }
                },
                quickJump: {
                    enabled: true,
                    data: { styling: [] }
                }
            }
        }
    }, function (items) {
        jiraUrl = items.jplus.connection.jiraUrl;
        jPlusSettingsUrl = items.jplus.connection.jPlusSettingsUrl;

        extraStyling = items.jplus.customizations.extraStyling.enabled;
        defintionOfDone = items.jplus.customizations.defintionOfDone.enabled;
        definitionOfReady = items.jplus.customizations.definitionOfReady.enabled;
        rightClickActions = items.jplus.customizations.rightClickActions.enabled;
        quickJump = items.jplus.customizations.quickJump.enabled;

        extraStylingData = items.jplus.customizations.extraStyling.data;
        definitionOfReadyData = items.jplus.customizations.definitionOfReady.data;
        rightClickActionsData = items.jplus.customizations.rightClickActions.data;
        quickJumpData = items.jplus.customizations.quickJump.data;

        $('#jira-url').val(jiraUrl);
        $('#settings-url').val(jPlusSettingsUrl);
        $('#extraStylingSwitchOption').prop('checked', extraStyling);
        $('#dodSwitchOption').prop('checked', defintionOfDone);
        $('#dorSwitchOption').prop('checked', definitionOfReady);
        $('#rightClickSwitchOption').prop('checked', rightClickActions);
        $('#quickJumpSwitchOption').prop('checked', quickJump);

        toggleCustomizationPanels();
        var savedData = {
            styling: extraStylingData,
            definitionOfReady: definitionOfReadyData,
            rightClickActions: rightClickActionsData,
            quickJump: quickJumpData
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
    definitionOfReady = $('#dorSwitchOption').prop('checked');
    rightClickActions = $('#rightClickSwitchOption').prop('checked');
    quickJump = $('#quickJumpSwitchOption').prop('checked');

    chrome.storage.sync.set({
        jplus: {
            connection: {
                jiraUrl: jiraUrl,
                jPlusSettingsUrl: jPlusSettingsUrl
            },
            customizations: {
                extraStyling: {
                    enabled: extraStyling
                },
                defintionOfDone: {
                    enabled: defintionOfDone
                },
                definitionOfReady: {
                    enabled: definitionOfReady
                },
                rightClickActions: {
                    enabled: rightClickActions
                },
                quickJump: {
                    enabled: quickJump
                }
            }
        }
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
    toggleCustomizationPanel($('#definition-of-ready-panel'), definitionOfReady);
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

// On Jira Url changed save
$('#jira-url').on('blur', function () {
    saveLocalOptions();
});

// On checkbox state changed
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
