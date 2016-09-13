// show icon
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [
                // When a page contains css class
                new chrome.declarativeContent.PageStateMatcher({
                    css: [".navigator-issue-only"]
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    css: ["#ghx-work"]
                }),
                new chrome.declarativeContent.PageStateMatcher({
                    css: ["#ghx-backlog"]
                })
            ],
            // ... show the page action.
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }]);
    });
});

// context menus
var parentMenu = chrome.contextMenus.create({
    "title": "Jira(+)",
    "contexts": ["page"],
    "documentUrlPatterns": ["https://jira.solarwinds.com/browse/*"]
});
var storyPointsMenu = chrome.contextMenus.create({
    "title": "Story Points",
    "contexts": ["page"],
    "parentId": parentMenu
});
var points = [0.0, 0.5, 1.0, 2.0, 3.0, 5.0, 8.0, 13.0, 20.0, 40.0, 100.0];
points.forEach(function (element) {
    chrome.contextMenus.create({
        "title": element.toString(),
        "onclick": function (info, tab) {
            pointsOnClick(info, tab, element);
        },
        "parentId": storyPointsMenu
    });
}, this);

var impedimentMenu = chrome.contextMenus.create({
    "title": "Toggle Impediment",
    "onclick": impedimentOnClick,
    "parentId": parentMenu
});

function impedimentOnClick(info, tab) {
    if (info.pageUrl.startsWith("https://jira.solarwinds.com/browse/")) {
        var jiraApiUrl = "https://jira.solarwinds.com/rest/api/latest/issue/";
        var jiraTicket = info.pageUrl.replace("https://jira.solarwinds.com/browse/", "");

        $.ajax({
            url: jiraApiUrl + jiraTicket,
            type: 'GET',
            dataType: "json",
            success: function (data) {
                if (data) {
                    if (data.fields.customfield_10006) {
                        var jiraUpdateObject = {
                            "update": {
                                "customfield_10006": [{ "set": null }]
                            }
                        };
                        updateJira(tab, info, jiraApiUrl + jiraTicket, jiraUpdateObject);
                    }
                    else {
                        var jiraUpdateObject = {
                            "update": {
                                "customfield_10006": [{ "set": [{"self":"https://jira.solarwinds.com/rest/api/2/customFieldOption/10003","value":"Impediment"}] }]
                            }
                        };
                        updateJira(tab, info, jiraApiUrl + jiraTicket, jiraUpdateObject);
                    }
                }
            },
            error: function (err) {
                alert("Error. Jira(+) wasn't able to update 'Impediment' value. Please try it again manually using Jira.");
                console.log(err);
            }
        });
    }
}

function pointsOnClick(info, tab, points) {
    if (info.pageUrl.startsWith("https://jira.solarwinds.com/browse/")) {
        var jiraApiUrl = "https://jira.solarwinds.com/rest/api/latest/issue/";
        var jiraTicket = info.pageUrl.replace("https://jira.solarwinds.com/browse/", "");

        var jiraUpdateObject = {
            "update": {
                "customfield_10008": [{ "set": points }]
            }
        }

        updateJira(tab, info, jiraApiUrl + jiraTicket, jiraUpdateObject);
    }
    else {
        alert("This is not jira issue page.");
    }
}

function updateJira(tab, info, url, updateObject) {
        $.ajax({
            url: url,
            type: 'PUT',
            data: JSON.stringify(updateObject),
            contentType: "application/json",
            success: function (result) {
                chrome.tabs.update(tab.id, { url: info.pageUrl });
            },
            error: function (err) {
                alert("Error. Jira(+) wasn't able to update issue. Please try it again manually using Jira.");
                console.log(err);
            }
        });
}