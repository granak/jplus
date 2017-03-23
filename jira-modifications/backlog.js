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

$(document).on('jplus-backlog-is-loaded', function () {
    if (GH && GH.BacklogView) {

        JPlus.Override.BacklogView = {};
        JPlus.Override.PlanDragAndDrop = {};

        JPlus.Override.BacklogView.draw = GH.BacklogView.draw;
        JPlus.Override.PlanDragAndDrop.issueUpdateHandler = GH.PlanDragAndDrop.issueUpdateHandler;
        JPlus.Override.PlanDragAndDrop.sprintRankIssues = GH.PlanDragAndDrop.sprintRankIssues;
        
        JPlus.Extend.BacklogView = {};
        JPlus.Extend.BacklogView.draw = function() {
            JPlus.log('BacklogView.draw was overriden');
            extraPlanning();
        }
        JPlus.Extend.PlanDragAndDrop = {};
        JPlus.Extend.PlanDragAndDrop.issueUpdateHandler = function(){
            JPlus.log('PlanDragAndDrop.issueUpdateHandler was overriden');
            extraPlanning();
        }
        JPlus.Extend.PlanDragAndDrop.sprintRankIssues = function(){
            JPlus.log('PlanDragAndDrop.sprintRankIssues was overriden');
            extraPlanning();
        }

        GH.BacklogView.draw = function () {
            JPlus.Override.BacklogView.draw();
            JPlus.Extend.BacklogView.draw();
        }

        GH.PlanDragAndDrop.issueUpdateHandler = function(b, h) {
            JPlus.Override.PlanDragAndDrop.issueUpdateHandler(b, h);
            JPlus.Extend.PlanDragAndDrop.issueUpdateHandler();
        }
        GH.PlanDragAndDrop.sprintRankIssues = function(c, f, b, e) {
            var result = JPlus.Override.PlanDragAndDrop.sprintRankIssues(c, f, b, e);
            JPlus.Extend.PlanDragAndDrop.sprintRankIssues();
            return result;
        }
    }
});