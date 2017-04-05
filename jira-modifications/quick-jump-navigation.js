if (typeof JPlus.Backlog == 'undefined') {
    JPlus.Backlog = {};
}

JPlus.Backlog.QuickJump = function (options) {
    if (typeof QuickJump == 'undefined') {
        QuickJump = {};
    }
    QuickJump.Coordinates = [];

    QuickJump.Add = function (options) {
        var jumpButton = $('<div id="plus-jump-button" class="jump-button"><p>jump</p></div>');
        var listOfJumps = $('<ul class="jump-list"></ul>');

        var jumpSize = 0;
        $('.ghx-backlog-container').each(function (index, element) {
            var name = $(element).find('.ghx-name');
            var listItem = $('<li><span>' + $(name).text() + '</span></li>');

            if (options.styling) {
                options.styling.forEach(function (style) {
                    if (style && $(name).text().indexOf(style.name) != -1) {
                        $(listItem).css({
                            "background-color": style.backroundColor,
                            "color": style.fontColor
                        });
                    }
                }, this);
            }

            QuickJump.Coordinates[index] = jumpSize;
            jumpSize += $(element).outerHeight();
            listItem.on("click", function () {
                $('#ghx-backlog').animate({
                    scrollTop: QuickJump.Coordinates[index]
                });
            });

            listOfJumps.append(listItem);
        });

        jumpButton.append(listOfJumps);

        var backlogContent = $("#ghx-content-group");
        backlogContent.append(jumpButton);

    }
    QuickJump.UpdateCoordinates = function () {
        var jumpSize = 0;
        $('.ghx-backlog-container').each(function (index, element) {
            QuickJump.Coordinates[index] = jumpSize;
            jumpSize += $(element).outerHeight();
        });
    }

    if (options) {
        if (document.getElementById('plus-jump-button') == null)
            QuickJump.Add(options);

        QuickJump.UpdateCoordinates();
    }
}