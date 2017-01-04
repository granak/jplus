var rcData;

function saveRightClickData() {
    chrome.storage.sync.set({
        rightClickActionsData: rcData
    }, function () {
        showSuccess('Saved');
    });
}

// Saved Options loaded
$(document).on('optionsLoaded', function (event, inputData) {
    rcData = inputData.rightClickActions;

    if (rcData) {
        $('#rc-browser-context-menu').prop('checked', rcData.showBrowserContextMenu);
        $('#rc-jira-context-menu').prop('checked', rcData.extendJiraContextMenu);
    }
});

$('#rc-browser-context-menu').on('change', function (e) {
    rcData.showBrowserContextMenu = $('#rc-browser-context-menu').prop('checked');
    saveRightClickData();
});
$('#rc-jira-context-menu').on('change', function (e) {
    rcData.extendJiraContextMenu = $('#rc-browser-context-menu').prop('checked');
    saveRightClickData();
});