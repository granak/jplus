var data;

function save() {
    chrome.storage.sync.set({
        definitionOfReadyData: data
    }, function () {
        showSuccess('Saved');
    });
}

// Saved Options loaded
$(document).on('optionsLoaded', function (event, inputData) {
    data = inputData.definitionOfReady;

    if (!!data) {
        $('#dor-text').val(data);
    }
});

$('#dor-submit').on('click', function () {
    data = $('#dor-text').val();
    save();
})