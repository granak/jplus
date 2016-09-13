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
    makeBoardMutations();
    if($('.issue-container')){
        injectScript('jira-modifications/definition-of-ready.js');
    }
}

function makeBoardMutations() {
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
                if (mutation.target.id === 'ghx-work' && mutation.target.style.display !== 'none' && !activeScriptInjected) {
                    injectScript('jira-modifications/extra-active-board.js');
                    if ($('#ghx-board-name').attr('data-view-id') == "1205") {
                        injectScript('jira-modifications/definition-of-done.js');
                    }
                    activeScriptInjected = true;
                }
                if (mutation.target.id === 'ghx-plan' && mutation.target.style.display !== 'none' && !planningScriptInjected) {
                    injectScript('jira-modifications/quick-jump-navigation.js');
                    injectScript('jira-modifications/extra-planning-board.js');
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