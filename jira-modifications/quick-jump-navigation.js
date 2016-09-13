$("#ghx-plan").on("extra-planning-applied", function () {
    if (document.getElementById('plus-jump-button') == null)
        addQuickJump();
    updateCoordinates();
});

var jumpCoordinates = [];

function addQuickJump() {
    var jumpButton = $('<div id="plus-jump-button" class="jump-button"><p>jump</p></div>');
    var listOfJumps = $('<ul class="jump-list"></ul>');

    var jumpSize = 0;
    $('.ghx-backlog-container').each(function (index, element) {
        var name = $(element).find('.ghx-name');
        var className = "";
        if($(name).text().indexOf('Dream') !== -1){
            className = 'dream-team';
        }
        if($(name).text().indexOf('A-Team') !== -1){
            className = 'a-team';
        }
        if($(name).text().indexOf('Prioritised') !== -1){
            className = 'prioritised';
        }
        if($(name).text().indexOf('Reviewed') !== -1){
            className = 'reviewed';
        }
        if($(name).text().indexOf('Backlog') === 0){
            className = 'backlog';
        }
        var listItem = $('<li class='+ className +'><span>' + $(name).text() + '</span></li>');

        jumpCoordinates[index] = jumpSize;
        jumpSize += $(element).outerHeight();
        listItem.on("click", function () {
            $('#ghx-backlog').animate({
                scrollTop: jumpCoordinates[index]
            });
        });

        listOfJumps.append(listItem);

    });

    jumpButton.append(listOfJumps);

    var backlogContent = $("#ghx-content-group");
    backlogContent.append(jumpButton);
}

function updateCoordinates() {
    var jumpSize = 0;
    $('.ghx-backlog-container').each(function (index, element) {
        jumpCoordinates[index] = jumpSize;
        jumpSize += $(element).outerHeight();
    });
}