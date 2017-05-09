if (typeof JPlus.Sprint == 'undefined') {
    JPlus.Sprint = {};
}

JPlus.Sprint.ExtraStyling = function (options) {
    $(".js-issue").each(function (index, element) {
        var issue = $(element);
        if (!(issue).hasClass('jplus-issue')) {
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
            issue.addClass('jplus-issue');
        }
        if (options && options.hideNoneItems) {
            $("span.ghx-extra-field-content:contains(None), span.ghx-extra-field-content:contains(none)").hide();
        }
        if (options && options.styling) {
            options.styling.forEach(function (style) {
                if (style) {
                    $('span.ghx-extra-field-content:contains(' + style.name + ')').css({
                        "background-color": style.backroundColor,
                        "color": style.fontColor
                    });
                }
            }, this);
        }
    });
}

$(document).on('jplus-sprint-is-rendered', function () {
    JPlus.Sprint.ExtraStyling(JPlus.Options.Customization('extraStyling'));
    JPlus.log('jplus-sprint-view-rendered');
})
