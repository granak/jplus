// Saved Options loaded
$(document).on('JPlusOptionsLoaded', function (event) {
    if (JPlus != undefined &&
        JPlus.Options != undefined &&
        JPlus.Options.Data != undefined) {
        if (JPlus.Options.Data.customizations.rightClickActions.enabled) {
            $('#rc-browser-context-menu').prop('checked', JPlus.Options.Data.customizations.rightClickActions.data.showBrowserContextMenu);
            $('#rc-jira-context-menu').prop('checked', JPlus.Options.Data.customizations.rightClickActions.data.extendJiraContextMenu);
        }
    }
});

$('#rc-browser-context-menu').on('change', function (e) {
    JPlus.Options.Data.customizations.rightClickActions.data.showBrowserContextMenu = $('#rc-browser-context-menu').prop('checked');
    JPlus.Options.Save();
});
$('#rc-jira-context-menu').on('change', function (e) {
    JPlus.Options.Data.customizations.rightClickActions.data.extendJiraContextMenu = $('#rc-browser-context-menu').prop('checked');
    JPlus.Options.Save();
});