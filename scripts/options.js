if (typeof JPlus == 'undefined') {
    var JPlus = {};
}

if (typeof JPlus.Options == 'undefined') {
    JPlus.Options = {};
}
if (typeof JPlus.Options.Data == 'undefined') {
    JPlus.Options.Data = {};
}
if (typeof JPlus.Options.Data.connection == 'undefined') {
    JPlus.Options.Data.connection = {
        jiraUrl: '',
        jPlusSettingsUrl: ''
    };
}
if (typeof JPlus.Options.Data.customizations == 'undefined') {
    JPlus.Options.Data.customizations = {
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
    };
}

JPlus.Options.Get = function () {
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
        JPlus.Options.Data = items.jplus;
        $(document).trigger('JPlusOptionsLoaded');
    });
}
JPlus.Options.Save = function () {
    chrome.storage.sync.set({
        jplus: JPlus.Options.Data
    }, function () {
        showSuccess('Saved');
    });
}
JPlus.Options.Upload = function (input) {
    try {
        var data = JSON.parse(input);
        console.log(data);
        if (data.connection &&
            data.connection.jiraUrl &&
            data.customizations) {
            JPlus.Options.Data = data;
            JPlus.Options.Save();
            $('input#settings-file').val('');
            $(document).trigger('JPlusOptionsLoaded');
            $('#upload-settings-confirmation-modal').modal('hide');
        }
    } catch (e) {
        showError('Error during parsing your file. Provide valid jPlus Options file.');
        console.error(e);
    }
};
JPlus.Options.Export = function () {
    var data = JSON.stringify(JPlus.Options.Data);
    var uriContent = "data:application/json," + encodeURIComponent(data);
    var newWindow = window.open(uriContent, 'JSON');
};

/* View update functions */
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

function refreshView() {
    $('#jira-url').val(JPlus.Options.Data.connection.jiraUrl);
    $('#settings-url').val(JPlus.Options.Data.connection.jPlusSettingsUrl);
    $('#extra-styling-switch-option').prop('checked', JPlus.Options.Data.customizations.extraStyling.enabled);
    $('#dod-switch-option').prop('checked', JPlus.Options.Data.customizations.defintionOfDone.enabled);
    $('#dor-switch-option').prop('checked', JPlus.Options.Data.customizations.definitionOfReady.enabled);
    $('#right-click-switch-option').prop('checked', JPlus.Options.Data.customizations.rightClickActions.enabled);
    $('#quick-jump-switch-option').prop('checked', JPlus.Options.Data.customizations.quickJump.enabled);

    toggleCustomizationPanels();
}
function toggleCustomizationPanels() {
    toggleCustomizationPanel($('#extra-styling-panel .collapse'), JPlus.Options.Data.customizations.extraStyling.enabled);
    toggleCustomizationPanel($('#definition-of-done-panel .collapse'), JPlus.Options.Data.customizations.defintionOfDone.enabled);
    toggleCustomizationPanel($('#definition-of-ready-panel .collapse'), JPlus.Options.Data.customizations.definitionOfReady.enabled);
    toggleCustomizationPanel($('#right-click-actions-panel .collapse'), JPlus.Options.Data.customizations.rightClickActions.enabled);
    toggleCustomizationPanel($('#quick-jump-panel .collapse'), JPlus.Options.Data.customizations.quickJump.enabled);
}
function toggleCustomizationPanel(element, property) {
    if (property === true) {
        element.collapse('show');
    } else {
        element.collapse('hide');
    }
}

/* Only for debug */
function clearStorage() {
    chrome.storage.sync.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    });
}

/* Events */
$(document).on('DOMContentLoaded', function () {
    JPlus.Options.Get();
});
$(document).on('JPlusOptionsLoaded', function (event) {
    refreshView();
});

// On Jira Url changed save
$('#jira-url').on('blur', function () {
    JPlus.Options.Data.connection.jiraUrl = $('#jira-url').val();
    JPlus.Options.Save();
});

// On checkbox state changed
$('.panel-heading input[type="checkbox"]').on('change', function (e) {
    JPlus.Options.Data.customizations.extraStyling.enabled = $('#extra-styling-switch-option').prop('checked');
    JPlus.Options.Data.customizations.defintionOfDone.enabled = $('#dod-switch-option').prop('checked');
    JPlus.Options.Data.customizations.definitionOfReady.enabled = $('#dor-switch-option').prop('checked');
    JPlus.Options.Data.customizations.rightClickActions.enabled = $('#right-click-switch-option').prop('checked');
    JPlus.Options.Data.customizations.quickJump.enabled = $('#quick-jump-switch-option').prop('checked');
    JPlus.Options.Save();
    refreshView();
    $(document).trigger('JPlusOptionsLoaded');  // should be another event, on options changed or something like that
});

// On tab changed
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
});

// Settings share actions
$('input#settings-file').on('change', function (e) {
    if (this.files.length != 1) {
        showError('Pick only one settings file.');
        return;
    }
    var file = this.files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file);
        reader.onload = function () {
            JPlus.Options.Upload(reader.result);
        }
    }
});
$('#settings-export').on('click', function (e) {
    e.preventDefault();
    JPlus.Options.Export();
});
