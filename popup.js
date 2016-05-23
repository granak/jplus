chrome.storage.sync.get('board', function (items) {
    console.log("Jira(+) --- Board saved value: " + items.board);
    if (items.board == "true") {
        $("#min-board-check").prop('checked', true);
    }
    else {
        $("#min-board-check").prop('checked', false);
    }
});

function clickHandler(e) {
    if (e.toElement !== undefined && e.toElement.value === 'min-board') {
        console.log("Jira(+) --- min-board checkbox clicked");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, "min-board:" + e.toElement.checked);
        });
        console.log('Jira(+) --- Message to content.js sent');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    console.log("Jira(+) --- DOM has fully loaded. Loading listeners.");
    $("#min-board-check").click(clickHandler);
});