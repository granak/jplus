var targetNodes = $("#ghx-pool");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = { childList: false, characterData: false, attributes: true, subtree: true };

// Add a target node to the observer. Can only add one node at a time.
targetNodes.each(function () {
    myObserver.observe(this, obsConfig);
});

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        if (mutation.target.id === 'ghx-column-header-group') {
            console.debug('Jira(+) --- column headers loaded');
            hoverPopovers();
        }
    });
}

function appendPopover(element, content) {
    console.log(element);
    $(element).append($('<div class="plus-popover">' + content + '<div class="legend"><p>Legend:</p><ul><li class="mandatory">mandatory</li><li class="recommended">recommended</li></ul></div></div>'));
    $(element).hover(
        function () {
            $(this).children('.plus-popover').show();
        },
        function () {
            $(this).children('.plus-popover').hide();
        }
    );
}

function hoverPopovers() {
    let inProgress = $('.ghx-column[data-id]>h2:contains(In Progress)').parent()[0];
    if ($(inProgress).has('.plus-popover').length == 0) {
        appendPopover(
            inProgress, 
            '<ul>' + 
                '<li class="mandatory">Acceptance criteria met</li>' +
                '<li class="mandatory">Source code submitted to P4, submit added to JIRA ticket, code collaborator link added to JIRA ticket</li>' +
                '<li class="mandatory">Unit tests written and integrated with build</li>' +
                '<li class="mandatory">Green build (build passed, automation tests passed)</li>' +
                '<li class="recommended">Tech. docs created/updated</li>' +
                '<li class="recommended">Automation test steps designed</li>' +
                '<li class="recommended">Acceptance tests automation libraries written</li>' +
                '<li class="recommended">Non-functional requirements are met</li>' +
                '<li class="recommended">Code coverage not getting worse</li>' +
                '<li class="recommended">Manual test steps designed (have it earlier the better)</li>' +
                '<li class="recommended">Story build number on DEV branch added to JIRA ticket</li>' +
            '</ul>'
        );
    }
    let inReview = $('.ghx-column[data-id]>h2:contains(In Review)').parent()[0];
    if ($(inReview).has('.plus-popover').length == 0) {
        appendPopover(
            inReview, 
            '<ul>' + 
                '<li class="mandatory">Deploy changes to QAenvironment</li>' +
                '<li class="recommended">Peer code review completed</li>' +
            '</ul>'
        );
    }
    let inQA = $('.ghx-column[data-id]>h2:contains(In QA)').parent()[0];
    if ($(inQA).has('.plus-popover').length == 0) {
        appendPopover(
            inQA, 
            '<ul>' + 
                '<li class="mandatory">Story tested and verified</li>' +
                '<li class="mandatory">No Must-Fix defects pending for the story</li>' +
                '<li class="recommended">Regression tests added/updated in TestLink</li>' +
                '<li class="recommended">Regression tests automated (where possible)</li>' +
                '<li class="recommended">Manual targeted regression tests passed successfully</li>' +
            '</ul>'
        );
    }
    let inUAT = $('.ghx-column[data-id]>h2:contains(In UAT)').parent()[0];
    if ($(inUAT).has('.plus-popover').length == 0) {
        appendPopover(
            inUAT, 
            '<ul>' + 
                '<li class="mandatory">Story accepted by the PO</li>' +
            '</ul>'
        );
    }
    let inIntegration = $('.ghx-column[data-id]>h2:contains(Integration)').parent()[0];
    if ($(inIntegration).has('.plus-popover').length == 0) {
        appendPopover(
            inIntegration, 
            '<ul>' + 
                '<li class="mandatory">Code integrated to Main branch</li>' +
                '<li class="mandatory">Story build number on Main branch added to JIRA ticket, add fixVersion  to JIRA ticket</li>' +
                '<li class="mandatory">Deploy changes to Integration environment (the way how this is ensured is product specific)</li>' +
                '<li class="mandatory">Greeen build (build passd, automation tests passed)</li>' +
                '<li class="recommended">Post-integration quick checks</li>' +
            '</ul>'
        );
    }
    let inStaging = $('.ghx-column[data-id]>h2:contains(In Staging)').parent()[0];
    if ($(inStaging).has('.plus-popover').length == 0) {
        appendPopover(
            inStaging, 
            '<ul>' + 
                '<li class="mandatory">Story tested on Main branch</li>' +
                '<li class="mandatory">Automation test suite (all tests) passed successfully on Main branch</li>' +
            '</ul>'
        );
    }
}