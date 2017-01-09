var _options = {};

window.addEventListener('message', function (event) {
    if (event.data && event.data.type) {
        if (event.data.type === 'jplus-get-options') {
            getSavedOptions(true);
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
    getSavedOptions();
    applyCustomScripts();
    makeBoardMutations();
}

function applyCustomScripts() {
    injectScript('jira-modifications/jplus-global.js');
    if (_options.defintionOfReady && $('.issue-container')) {
        injectScript('jira-modifications/definition-of-ready.js');
    }
}

function getSavedOptions(sendPost = false) {
    chrome.storage.sync.get({
        jiraUrl: '',
        extraStyling: true,
        defintionOfDone: false,
        defintionOfReady: true,
        rightClickActions: true,
        quickJump: true,
        extraStylingData: { hideNoneItems: true, stylingData: [] },
        definitionOfReadyData: '',
        rightClickActionsData: { showBrowserContextMenu: true, extendJiraContextMenu: true },
        quickJumpData: { stylingData: [] }
    }, function (items) {
        if (sendPost) {
            window.postMessage({ type: 'jplus-options', options: items }, items.jiraUrl);
        }
        _options = items;
    });
}

function makeBoardMutations() {
    if (!_options) {
        return;
    }

    var targetNodes = [$('#ghx-work'), $('#ghx-plan')];
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver = new MutationObserver(mutationHandler);
    var obsConfig = { childList: false, characterData: false, attributes: true, subtree: false };
    var planningScriptInjected = false;
    var activeScriptInjected = false;

    // Add a target node to the observer. Can only add one node at a time.
    $.each(targetNodes, function (index, item) {
        item.each(function () {
            myObserver.observe(this, obsConfig);
        });
    });

    function mutationHandler(mutationRecords) {
        mutationRecords.forEach(function (mutation) {
            if (typeof mutation.attributes) {
                getSavedOptions();
                if (mutation.target.id === 'ghx-work' && mutation.target.style.display !== 'none' && !activeScriptInjected) {
                    if (_options.extraStyling) {
                        injectScript('jira-modifications/extra-active-board.js');
                    }
                    if (_options.defintionOfDone && $('#ghx-board-name').attr('data-view-id') == "1205") {  // TODO: board specific
                        injectScript('jira-modifications/definition-of-done.js');
                    }
                    activeScriptInjected = true;
                }
                if (mutation.target.id === 'ghx-plan' && mutation.target.style.display !== 'none' && !planningScriptInjected) {
                    if (_options.quickJump) {
                        injectScript('jira-modifications/quick-jump-navigation.js');
                    }
                    if (_options.extraStyling) {
                        injectScript('jira-modifications/extra-planning-board.js');
                    }
                    if (_options.rightClickActions &&
                        _options.rightClickActionsData &&
                        _options.rightClickActionsData.extendJiraContextMenu) {
                        injectScriptToBody('jira-modifications/backlog-right-click-extend.js');
                    }
                    planningScriptInjected = true;
                }
            }
        });
    }
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
    script.setAttribute("async", true);
    script.setAttribute("src", chrome.extension.getURL(path));
    var body = document.body || document.getElementsByTagName("body")[0];
    body.insertBefore(script, body.lastChild)
}