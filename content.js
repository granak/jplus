if (typeof JPlus == 'undefined') {
    var JPlus = {};
}

if (typeof JPlus.Content == 'undefined') {
    JPlus.Content = {};
}
if (typeof JPlus.Content.Options == 'undefined') {
    JPlus.Content.Options = {};
}

JPlus.ScriptsInjected = false;

JPlus.Content.Options.Get = function () {
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
        window.postMessage({ type: 'jplus-options', data: items.jplus }, items.jplus.connection.jiraUrl);
    });
}

/* Events */
window.addEventListener('message', function (event) {
    if (event.data && event.data.type) {
        if (event.data.type === 'jplus-get-options') {
            JPlus.Content.Options.Get();
        }
    }
});

/// Checking page meta tag
function getJiraMetaTag() {
    var metaTags = document.getElementsByTagName('meta');

    for (var i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("name") == "application-name") {
            return metaTags[i].getAttribute("content");
        }
    }

    return "";
}

if (getJiraMetaTag() == "JIRA") {
    if (!JPlus.ScriptsInjected) {
        applyCustomScripts();
    }
}

function applyCustomScripts() {
    injectScript('jira-modifications/jplus-global.js');
    injectScript('jira-modifications/sprint-view.js');
    // injectScript('jira-modifications/definition-of-done.js');
    injectScript('jira-modifications/quick-jump-navigation.js');
    injectScript('jira-modifications/backlog-view.js');
    injectScriptToBody('jira-modifications/backlog-right-click-extend.js');
    JPlus.ScriptsInjected = true;
    // if (JPlus.Options.Data.customizations.definitionOfReady.enabled && $('.issue-container')) {
    //     injectScript('jira-modifications/definition-of-ready.js');
    // }
}

function injectScript(path) {
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("async", true);
    script.setAttribute("src", chrome.extension.getURL(path));
    var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
    head.insertBefore(script, head.lastChild)
}
function injectScriptToBody(path) {
    var script = document.createElement('script');
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", chrome.extension.getURL(path));
    var body = document.body || document.getElementsByTagName("body")[0];
    body.insertBefore(script, body.lastChild)
}