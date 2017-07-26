var _jiraUrl = null;

(function () {
    chrome.storage.sync.get({
        jplus: {}
    }, function (items) {
        if (items) {
            if (items.jplus &&
                items.jplus.connection &&
                items.jplus.connection.jiraUrl &&
                items.jplus.connection.jiraUrl.length > 0) {
                if (items.jplus.customizations &&
                    items.jplus.customizations.rightClickActions &&
                    items.jplus.customizations.rightClickActions.enabled &&
                    items.jplus.customizations.rightClickActions.data &&
                    items.jplus.customizations.rightClickActions.data.showBrowserContextMenu) {
                    _jiraUrl = items.jplus.connection.jiraUrl;
                    createContextMenu();
                }
            }
            else {
                console.error('Missing JIRA URL.');
            }
        }
        else {
            console.error('Chrome storage failed.');
        }
    });
})();

// context menus
function createContextMenu() {
    if (_jiraUrl) {
        var parentMenu = chrome.contextMenus.create({
            "title": "jPlus",
            "contexts": ["page"],
            "documentUrlPatterns": [_jiraUrl + "/browse/*"]
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
            "contexts": ["page"],
            "parentId": parentMenu
        });

        var separator = chrome.contextMenus.create({
            type: 'separator',
            "contexts": ["page"],
            "parentId": parentMenu
        });

        var copyMenu = chrome.contextMenus.create({
            "title": "Copy",
            "contexts": ["page"],
            "parentId": parentMenu
        });
        var copyTicketNumberMenu = chrome.contextMenus.create({
            "title": "Ticket number",
            "contexts": ["page"],
            "onclick": function (info, tab) {
                copyTicketInfo(info, tab, false);
            },
            "parentId": copyMenu
        });
        var copyTicketSummaryMenu = chrome.contextMenus.create({
            "title": "Ticket number and summary",
            "contexts": ["page"],
            "onclick": function (info, tab) {
                copyTicketInfo(info, tab, true);
            },
            "parentId": copyMenu
        });
    }
}

function impedimentOnClick(info, tab) {
    if (info.pageUrl.startsWith(_jiraUrl + "/browse/")) {
        var jiraApiUrl = _jiraUrl + "/rest/api/latest/issue/";
        var jiraTicket = info.pageUrl.replace(_jiraUrl + "/browse/", "");

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
                                "customfield_10006": [{ "set": [{ "self": _jiraUrl + "/rest/api/2/customFieldOption/10003", "value": "Impediment" }] }]
                            }
                        };
                        updateJira(tab, info, jiraApiUrl + jiraTicket, jiraUpdateObject);
                    }
                }
            },
            error: function (err) {
                alert("Error. jPlus wasn't able to update 'Impediment' value. Please try it again manually using Jira.");
                console.log(err);
            }
        });
    }
}

function pointsOnClick(info, tab, points) {
    if (info.pageUrl.startsWith(_jiraUrl + "/browse/")) {
        var jiraApiUrl = _jiraUrl + "/rest/api/latest/issue/";
        var jiraTicket = info.pageUrl.replace(_jiraUrl + "/browse/", "");

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
            alert("Error. jPlus wasn't able to update issue. Please try it again manually using Jira.");
            console.log(err);
        }
    });
}

function copyTicketInfo(info, tab, summary) {
    if (info.pageUrl.startsWith(_jiraUrl + "/browse/")) {
        var jiraApiUrl = _jiraUrl + "/rest/api/latest/issue/";
        var jiraTicket = info.pageUrl.replace(_jiraUrl + "/browse/", "");
        if (!summary)
            copyToClipboard(jiraTicket);
        else {
            $.ajax({
                url: jiraApiUrl + jiraTicket,
                type: 'GET',
                dataType: "json",
                success: function (data) {
                    if (data && data.fields && data.fields.summary) {
                        copyToClipboard(jiraTicket + ' ' + data.fields.summary);
                    }
                },
                error: function (err) {
                    alert("Error. jPlus wasn't able to accomplish requested action.");
                    console.log(err);
                }
            });
        }
    }
}
function copyToClipboard(text) {
    var textArea = document.createElement("textarea");

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    document.execCommand('copy');

    document.body.removeChild(textArea);
}