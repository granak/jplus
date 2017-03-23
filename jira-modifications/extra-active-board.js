// var targetNodes = $("#ghx-pool");
// var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
// var myObserver = new MutationObserver(mutationHandler);
// var obsConfig = { childList: true, characterData: false, attributes: true, subtree: false };

// // Add a target node to the observer. Can only add one node at a time.
// targetNodes.each(function() {
//     myObserver.observe(this, obsConfig);
// });

// function mutationHandler(mutationRecords) {
//     mutationRecords.forEach(function(mutation) {
//         extraBoard();
//     });
// }

// function extraBoard() {
//     $('span.ghx-extra-field-content').addClass('aui-label');
//     $("span.ghx-extra-field-content:contains(None), span.ghx-extra-field-content:contains(none)").hide();    // hide none tags
//     $("span.ghx-extra-field-content:contains(SWDCEktron)").css({
//         "background-color": "rgb(142,176,33)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(PartnerPortal), span.ghx-extra-field-content:contains(Partner Portal)").css({
//         "background-color": "rgb(172,112,122)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(SolarStorm), span.ghx-extra-field-content:contains(Solar Storm)").css({
//         "background-color": "rgb(101,73,130)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(BrandSites)").css({
//         "background-color": "rgb(74,103,133)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(Automation)").css({
//         "background-color": "rgb(59,127,196)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(SiteCore)").css({
//         "background-color": "rgb(228, 47, 38)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(dream), span.ghx-extra-field-content:contains(Dream)").css({
//         "background-color": "rgba(2, 76, 222, 1)",
//         color: "rgb(255,255,255)"
//     });
//     $("span.ghx-extra-field-content:contains(a-team), span.ghx-extra-field-content:contains(ateam), span.ghx-extra-field-content:contains(A-team)").css({
//         "background-color": "rgba(20, 14, 0, 0.89)",
//         color: "rgb(255,255,255)"
//     });
//     //$(".ghx-column.ui-sortable:nth-child(8n+8)").children().hide();
// };
