var targetNodes = $("#ghx-plan");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = { childList: true, characterData: false, attributes: true, subtree: true };
var dataRendered = false;

// Add a target node to the observer. Can only add one node at a time.
targetNodes.each(function () {
    myObserver.observe(this, obsConfig);
});

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        if (typeof mutation.attributes) {
            if (mutation.attributeName == "data-rendered") {
                dataRendered = true;
            }
        }
        if (typeof mutation.childList) {
            if (dataRendered && mutation.target.classList != undefined && mutation.target.classList.contains('ghx-issue-count')) {
                extraPlanning();
                $("#ghx-plan").trigger("extra-planning-applied");
            }
        }
    });
}

function extraPlanning() {
    $(".js-issue").each(function (index, element) {
        var issue = $(element);
        if (!(issue).hasClass('jira-plus')) {
            var extraContent = issue.find("span.ghx-extra-field-content");
            extraContent.addClass("aui-label");
            extraContent.parent().removeClass("ghx-extra-field");
            
            var ghxEnd = issue.find("span.ghx-end");
            extraContent.prependTo(ghxEnd); // move our extra fields
            
            var ghxEndDiv = issue.find("div.ghx-end");  // move epic link and version inside our extra fields items
            ghxEndDiv.children("span.aui-label").each(function (index, element) {
                $(element).prependTo(ghxEnd);
            });

            var extraFields = issue.find('.ghx-plan-extra-fields');
            extraFields.parent().append(ghxEnd);
            extraFields.hide();
            issue.addClass('jira-plus');
        }
    });
    $("span.ghx-extra-field-content:contains(None), span.ghx-extra-field-content:contains(none)").hide();    // hide none tags
    $("span.ghx-extra-field-content:contains(SWDCEktron)").css({
        "background-color": "rgb(142,176,33)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(PartnerPortal), span.ghx-extra-field-content:contains(Partner Portal)").css({
        "background-color": "rgb(172,112,122)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(SolarStorm), span.ghx-extra-field-content:contains(Solar Storm)").css({
        "background-color": "rgb(101,73,130)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(BrandSites)").css({
        "background-color": "rgb(74,103,133)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(Automation)").css({
        "background-color": "rgb(59,127,196)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(SiteCore)").css({
        "background-color": "rgb(228, 47, 38)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(dream), span.ghx-extra-field-content:contains(Dream)").css({
        "background-color": "rgba(2, 76, 222, 1)",
        color: "rgb(255,255,255)"
    });
    $("span.ghx-extra-field-content:contains(a-team), span.ghx-extra-field-content:contains(ateam), span.ghx-extra-field-content:contains(A-team)").css({
        "background-color": "rgba(20, 14, 0, 0.89)",
        color: "rgb(255,255,255)"
    });
};