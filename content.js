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
        // if (event.data.type === 'jplus-options') {
        //     //makeBoardMutations();
        //     if (!JPlus.ScriptsInjected) {
        //         applyCustomScripts();
        //     }
        // }
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
    //JPlus.Content.Options.Get();
    if (!JPlus.ScriptsInjected) {
        applyCustomScripts();
    }
}

function applyCustomScripts() {
    injectScript('jira-modifications/jplus-global.js');
    injectScript('jira-modifications/extra-active-board.js');
    injectScript('jira-modifications/definition-of-done.js');
    injectScript('jira-modifications/quick-jump-navigation.js');
    injectScript('jira-modifications/backlog.js');
    injectScriptToBody('jira-modifications/backlog-right-click-extend.js');
    JPlus.ScriptsInjected = true;
    // if (JPlus.Options.Data.customizations.definitionOfReady.enabled && $('.issue-container')) {
    //     injectScript('jira-modifications/definition-of-ready.js');
    // }
}


// function makeBoardMutations() {
//     if ((!JPlus && !JPlus.Options) || JPlus.ScriptsInjected) {
//         return;
//     }
//     console.log('JPLUS - mutations');
//     applyCustomScripts();

//     var targetNodes = [$('#ghx-work'), $('#ghx-plan')];
//     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
//     var myObserver = new MutationObserver(mutationHandler);
//     var obsConfig = { childList: false, characterData: false, attributes: true, subtree: false };
//     var planningScriptInjected = false;
//     var activeScriptInjected = false;

//     // Add a target node to the observer. Can only add one node at a time.
//     $.each(targetNodes, function (index, item) {
//         item.each(function () {
//             myObserver.observe(this, obsConfig);
//         });
//     });

//     function mutationHandler(mutationRecords) {
//         mutationRecords.forEach(function (mutation) {
//             if (typeof mutation.attributes) {
//                 if (mutation.target.id === 'ghx-work' && mutation.target.style.display !== 'none' && !activeScriptInjected) {
//                     console.log('JPLUS - extrastyling: ' + JPlus.Options.Data.customizations.extraStyling.enabled);
//                     if (JPlus.Options.Data.customizations.extraStyling.enabled) {
//                         injectScript('jira-modifications/extra-active-board.js');
//                     }
//                     if (JPlus.Options.Data.customizations.defintionOfDone.enabled && $('#ghx-board-name').attr('data-view-id') == "1205") {  // TODO: board specific
//                         injectScript('jira-modifications/definition-of-done.js');
//                     }
//                     activeScriptInjected = true;
//                 }
//                 if (mutation.target.id === 'ghx-plan' && mutation.target.style.display !== 'none' && !planningScriptInjected) {
//                     if (JPlus.Options.Data.customizations.quickJump.enabled) {
//                         injectScript('jira-modifications/quick-jump-navigation.js');
//                     }
//                     if (JPlus.Options.Data.customizations.extraStyling.enabled) {
//                         injectScript('jira-modifications/extra-planning-board.js');
//                     }
//                     if (JPlus.Options.Data.customizations.rightClickActions.enabled &&
//                         JPlus.Options.Data.customizations.rightClickActions.data &&
//                         JPlus.Options.Data.customizations.rightClickActions.data.extendJiraContextMenu) {
//                         injectScriptToBody('jira-modifications/backlog-right-click-extend.js');
//                     }
//                     planningScriptInjected = true;
//                 }
//             }
//         });
//     }
// }

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