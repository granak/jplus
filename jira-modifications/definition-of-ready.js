var targetNodes = $(".issue-body-content");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver(mutationHandler);
var obsConfig = { childList: true, characterData: true, attributes: true, subtree: true };

// Add a target node to the observer. Can only add one node at a time.
targetNodes.each(function () {
    myObserver.observe(this, obsConfig);
});

function mutationHandler(mutationRecords) {
    mutationRecords.forEach(function (mutation) {
        if (mutation.target.id === 'description-val' &&
            mutation.type === 'attributes' &&
            mutation.attributeName === 'class' &&
            mutation.target.classList != undefined &&
            mutation.target.classList.contains('active') &&
            document.getElementById('jira-plus-snippet') == null) {

            var snippetButton = '<a id="jira-plus-snippet" class="jira-plus snippet definition-of-ready" href="#" onclick="appendDoR()">' +
                '<span class="aui-icon aui-icon-small aui-iconfont-jira-completed-task"></span>' +
                '</a>';

            $('#description-form > div.save-options > div.field-tools').append($(snippetButton));
        }
    });
}

function appendDoR() {
    var currentValue = $('textarea#description').val();
    if (JPlus && JPlus.Options && JPlus.Options.Data) {
        $('textarea#description').val(currentValue + '\n' + JPlus.Options.Data.customizations.definitionOfReady.data.text);
        $('textarea#description').css('overflow', 'visible');
    }
}