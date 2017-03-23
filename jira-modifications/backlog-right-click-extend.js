if (typeof JPlus == 'undefined') {
    var JPlus = {};
}

$(document).on('jplus-backlog-is-loaded', function () {
    JPlus.PlanContextMenuController = {};

    JPlus.PlanContextMenuController._resolveActionsForContext = GH.PlanContextMenuController.resolveActionsForContext;

    JPlus.Extend.SetPoints = function (selectedIssues, points, jiraUrl) {
        JPlus.log("SetPoints called");
        $.each(selectedIssues, function (index, value) {
            var jiraApiUrl = jiraUrl + "/rest/api/latest/issue/";
            var jiraTicket = value;
            JPlus.info('Ticket to update: ' + value);
            var jiraUpdateObject = {
                "update": {
                    "customfield_10008": [{ "set": points }]
                }
            }

            updateJira(jiraApiUrl + jiraTicket, jiraUpdateObject);
        });
    }

    GH.PlanContextMenuController.resolveActionsForContext = function (a) {
        var baseActions = JPlus.PlanContextMenuController._resolveActionsForContext(a);
        JPlus.Options.Get();
        JPlus.log('backlog-right-click-extend..resolveActionsForContext called');

        if (JPlus.Options.Data &&
            JPlus.Options.Data.connection.jiraUrl &&
            JPlus.Options.Data.connection.jiraUrl.length > 0 &&
            JPlus.Options.Data.customizations.rightClickActions &&
            JPlus.Options.Data.customizations.rightClickActions.data &&
            JPlus.Options.Data.customizations.rightClickActions.data.extendJiraContextMenu) {
            var extendedStoryPointsActions = [];

            $.each([0.5, 1, 2, 3, 5, 8], function (index, value) {
                extendedStoryPointsActions.push({
                    id: "jplus-story-points-" + value,
                    name: value,
                    label: value,
                    actionFn: function () {
                        JPlus.Extend.SetPoints(a.selectedIssues, value, JPlus.Options.Data.connection.jiraUrl);
                    }
                });
            });

            baseActions.push({
                id: "jplus-story-points",
                label: "Story points",
                actions: extendedStoryPointsActions
            });
        } else {
            JPlus.warn('backlog-right-click-extend..resolveActionsForContext - Options' + JPlus.Options.Data);
        }

        return baseActions;
    };

    function updateJira(url, updateObject) {
        $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(updateObject),
            contentType: "application/json",
            success: function (result) {
                JPlus.Messages.showSuccessMsg("Action was successfully finished.", {
                    closeable: true
                });
            },
            error: function (err) {
                JPlus.Messages.showErrorMsg("Error occured during action. Please try again later.", {
                    closeable: true
                });
                JPlus.error(err);
            }
        });
    }
});