/* Events */
$(document).on('JPlusOptionsLoaded', function (event) {
    if (JPlus != undefined &&
        JPlus.Options != undefined &&
        JPlus.Options.Data != undefined) {
        if (JPlus.Options.Data.customizations.definitionOfReady.enabled &&
            JPlus.Options.Data.customizations.definitionOfReady.data.text) {
            $('#dor-text').val(JPlus.Options.Data.customizations.definitionOfReady.data.text);
        }
    }
});

$('#dor-submit').on('click', function () {
    JPlus.Options.Data.customizations.definitionOfReady.data.text = $('#dor-text').val();
    JPlus.Options.Save();
})