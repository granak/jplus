var jiraUrl = '';
var jPlusSettingsUrl = '';
var extraStyling;
var defintionOfDone;
var defintionOfReady;
var rightClickActions;
var quickJump;

var es_stylingData = [];
var es_backgroundColor;
var es_fontColor;
var es_selectedStyling;

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
        quickJump: true
    }, function (items) {
        jiraUrl = items.jiraUrl;
        jPlusSettingsUrl = items.jPlusSettingsUrl;
        extraStyling = items.extraStyling;
        defintionOfDone = items.defintionOfDone;
        defintionOfReady = items.defintionOfReady;
        rightClickActions = items.rightClickActions;
        quickJump = items.quickJump;

        $('#jira-url').val(jiraUrl);
        $('#settings-url').val(jPlusSettingsUrl);
        $('#extraStylingSwitchOption').prop('checked', extraStyling);
        $('#dodSwitchOption').prop('checked', defintionOfDone);
        $('#dorSwitchOption').prop('checked', defintionOfReady);
        $('#rightClickSwitchOption').prop('checked', rightClickActions);
        $('#quickJumpSwitchOption').prop('checked', quickJump);
    });
}

function restoreRemoteOptions() {

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

function initColorPickers() {
    $('#es-styling-background-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#es-styling-font-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#es-styling-background-color-picker').on('changeColor', function(event) { 
        es_backgroundColor = event.color.toRGB();
    });
    $('#es-styling-font-color-picker').on('changeColor', function(event) {
        es_fontColor = event.color.toRGB();
    });
}

function generateStylesTable(dataRows) {
    $('#es-table>tbody').empty();

    $.each(dataRows, function(index, value) { 
        $('#es-table>tbody').append( '<tr data-id="'+ value.id +'">' +
            '<td>' + value.name + '</td>' +
            '<td>' + value.backroundColor + '</td>' +
            '<td>' + value.fontColor + '</td>' + 
        '</tr>' );
    })
}

document.addEventListener('DOMContentLoaded', function () {
    restoreLocalOptions();
    toggleCustomizationPanels();
    initColorPickers();
});

// On checkbox stat changed
$('input[type="checkbox"]').on('change', function (e) {
    saveLocalOptions();
});

// On tab changed
$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    var target = $(e.target).attr("href");
    if (target === '#customization') {
        restoreLocalOptions();
        toggleCustomizationPanels();
    }
});

// Styling
$('#es-table>tbody').on('click', 'tr', function(event) {
    $('#es-update-styling').show();
    var row = $(this);
    es_selectedStyling = {
        id: row.attr('data-id'),
        name: $(row.children()[0]).text(),
        backroundColor: $(row.children()[1]).text(),
        fontColor: $(row.children()[2]).text()
    }
});
$('#es-add-styling').on('click', function() {
    var name = $('#es-styling-input').val();
    if(!!name && name.length > 0 && !!es_backgroundColor && !!es_fontColor) {
        var styling = {
            id: es_stylingData.length + 1, 
            name: name, 
            backroundColor: 'rgba(' + es_backgroundColor.r + ',' + es_backgroundColor.g + ',' + es_backgroundColor.b + ',' + es_backgroundColor.a +')', 
            fontColor: 'rgba(' + es_fontColor.r + ',' + es_fontColor.g + ',' + es_fontColor.b + ',' + es_fontColor.a +')'
        }
        es_stylingData.push(styling);
    }
    generateStylesTable(es_stylingData);
    $('#es-update-styling').hide();
});

$('#es-update-styling').on('click', function() {
    

    $('#es-update-styling').hide();
})
