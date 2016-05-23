// show icon
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{ conditions: [
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