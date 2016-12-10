var qj_data;

var qj_backgroundColor;
var qj_fontColor;
var qj_selectedStyling;

function initQuickJumpColorPickers() {
    $('#qj-styling-background-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#qj-styling-font-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#qj-styling-background-color-picker').on('changeColor', function (event) {
        qj_backgroundColor = event.color.toRGB();
    });
    $('#qj-styling-font-color-picker').on('changeColor', function (event) {
        qj_fontColor = event.color.toRGB();
    });
}

function generateQuickJumpStylesTable(rows) {
    if (rows != undefined && rows.length != undefined && rows.length > 0) {
        $('#qj-table').show();
        $('#qj-table>tbody').empty();

        $.each(rows, function (index, value) {
            $('#qj-table>tbody').append('<tr data-id="' + value.id + '">' +
                '<td>' + value.name + '</td>' +
                '<td>' + value.backroundColor + '</td>' +
                '<td>' + value.fontColor + '</td>' +
                '</tr>');
        });
    }
}

function updateQuickJumpStylingData(value) {
    $.each(qj_data.stylingData, function (index, item) {
        if (item.id == value.id) {
            qj_data.stylingData[index] = value;
        }
    });

    generateQuickJumpStylesTable(qj_data.stylingData);
}

function clearFormInputFields() {
    $('#qj-styling-input').val('');
    $('#qj-styling-background-color-picker').colorpicker('setValue', '');
    $('#qj-styling-font-color-picker').colorpicker('setValue', '');
}

function saveQuickJumpStyles() {
    chrome.storage.sync.set({
        quickJumpData: qj_data
    }, function () {
        showSuccess('Saved');
        clearFormInputFields();
    });
}

// Saved Options loaded
$(document).on('optionsLoaded', function (event, inputData) {
    initQuickJumpColorPickers();
    qj_data = inputData.quickJump;

    if (qj_data.stylingData.length < 1) {
        $('#qj-table').hide();
    }
    else {
        generateQuickJumpStylesTable(qj_data.stylingData);
    }
});

$('#qj-table>tbody').on('click', 'tr', function (event) {
    $('#qj-update-styling').css('display', 'inline-block'); // show

    var row = $(this);
    qj_selectedStyling = {
        id: row.attr('data-id'),
        name: $(row.children()[0]).text(),
        backroundColor: $(row.children()[1]).text(),
        fontColor: $(row.children()[2]).text()
    }
    $('#qj-styling-input').val(qj_selectedStyling.name);
    $('#qj-styling-background-color-picker').colorpicker('setValue', qj_selectedStyling.backroundColor);
    $('#qj-styling-font-color-picker').colorpicker('setValue', qj_selectedStyling.fontColor);
});
$('#qj-add-styling').on('click', function () {
    var name = $('#qj-styling-input').val();
    if (name && name.length > 0 && qj_backgroundColor && qj_fontColor) {
        var styling = {
            id: qj_data.stylingData.length + 1,
            name: name,
            backroundColor: 'rgba(' + qj_backgroundColor.r + ',' + qj_backgroundColor.g + ',' + qj_backgroundColor.b + ',' + qj_backgroundColor.a + ')',
            fontColor: 'rgba(' + qj_fontColor.r + ',' + qj_fontColor.g + ',' + qj_fontColor.b + ',' + qj_fontColor.a + ')'
        }
        qj_data.stylingData.push(styling);

        generateQuickJumpStylesTable(qj_data.stylingData);
        $('#qj-update-styling').hide();
        saveQuickJumpStyles();
    }
});
$('#qj-update-styling').on('click', function () {
    var name = $('#qj-styling-input').val();
    if (name && name.length > 0 && qj_backgroundColor && qj_fontColor) {
        qj_selectedStyling.name = name;
        qj_selectedStyling.backroundColor = 'rgba(' + qj_backgroundColor.r + ',' + qj_backgroundColor.g + ',' + qj_backgroundColor.b + ',' + qj_backgroundColor.a + ')';
        qj_selectedStyling.fontColor = 'rgba(' + qj_fontColor.r + ',' + qj_fontColor.g + ',' + qj_fontColor.b + ',' + qj_fontColor.a + ')'

        updateQuickJumpStylingData(qj_selectedStyling);
        $('#qj-update-styling').hide();
        saveQuickJumpStyles();
    }
})