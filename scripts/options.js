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
        $('#jira-url').val(items.jiraUrl);
        $('#settings-url').val(items.jPlusSettingsUrl);
        $('#extraStylingSwitchOption').prop('checked', items.extraStyling);
        $('#dodSwitchOption').prop('checked', items.defintionOfDone);
        $('#dorSwitchOption').prop('checked', items.defintionOfReady);
        $('#rightClickSwitchOption').prop('checked', items.rightClickActions);
        $('#quickJumpSwitchOption').prop('checked', items.quickJump);
    });
}

function restoreRemoteOptions() {

}

function saveLocalOptions() {
    chrome.storage.sync.set({
        jiraUrl: $('#jira-url').val(),
        jPlusSettingsUrl: $('#settings-url').val(),
        extraStyling: $('#extraStylingSwitchOption').prop('checked'),
        defintionOfDone: $('#dodSwitchOption').prop('checked'),
        defintionOfReady: $('#dorSwitchOption').prop('checked'),
        rightClickActions: $('#rightClickSwitchOption').prop('checked'),
        quickJump: $('#quickJumpSwitchOption').prop('checked')
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

document.addEventListener('DOMContentLoaded', restoreLocalOptions);

$('input[type="checkbox"]').on('change', function (e) {
    saveLocalOptions();
});