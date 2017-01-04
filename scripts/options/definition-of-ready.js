function saveDefinitionOfReadyData(data) {
    chrome.storage.sync.set({
        definitionOfReadyData: data
    }, function () {
        showSuccess('Saved');
    });
}

// Saved Options loaded
$(document).on('optionsLoaded', function (event, inputData) {
    if (inputData.definitionOfReady) {
        $('#dor-text').val(inputData.definitionOfReady);
    }
});

$('#dor-submit').on('click', function () {
    saveDefinitionOfReadyData($('#dor-text').val());
})