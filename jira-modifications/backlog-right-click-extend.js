if (typeof JPlus == 'undefined') {
    var JPlus = {};
}

JPlus.Extending = {};
JPlus.PlanContextMenuController = {};

JPlus.PlanContextMenuController._resolveActionsForContext = GH.PlanContextMenuController.resolveActionsForContext;

JPlus.Extending.SetPoints = function (selectedIssues, points) {
    $.each(selectedIssues, function (index, value) {
        var jiraApiUrl = "https://jira.solarwinds.com/rest/api/latest/issue/";
        var jiraTicket = value;
        console.info(value);
        var jiraUpdateObject = {
            "update": {
                "customfield_10008": [{ "set": points }]
            }
        }

        updateJira(jiraApiUrl + jiraTicket, jiraUpdateObject);
    });
}

GH.PlanContextMenuController.resolveActionsForContext = function (a) {
    console.info('overridden');
    var baseActions = JPlus.PlanContextMenuController._resolveActionsForContext(a);

    var extendedStoryPointsActions = [];

    $.each([0.5, 1, 2, 3, 5, 8], function (index, value) {
        extendedStoryPointsActions.push({
            id: "jplus-story-points-" + value,
            name: value,
            label: value,
            actionFn: function () {
                JPlus.Extending.SetPoints(a.selectedIssues, value);
            }
        });
    });

    baseActions.push({
        id: "jplus-story-points",
        label: "Story points",
        actions: extendedStoryPointsActions
    });

    return baseActions;
};


function updateJira(url, updateObject) {
    $.ajax({
        url: url,
        type: 'PUT',
        data: JSON.stringify(updateObject),
        contentType: "application/json",
        success: function (result) {
            JIRA.Messages.showSuccessMsg("Action was successfully finished.", {
                closeable: true
            });
        },
        error: function (err) {
            JIRA.Messages.showErrorMsg("Error occured during action. Please try again later.", {
                closeable: true
            });
            console.log(err);
        }
    });
}