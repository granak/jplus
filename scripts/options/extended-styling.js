var data;

var es_backgroundColor;
var es_fontColor;
var es_selectedStyling;

function initColorPickers() {
    $('#es-styling-background-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#es-styling-font-color-picker').colorpicker({
        format: 'rgba'
    });
    $('#es-styling-background-color-picker').on('changeColor', function (event) {
        es_backgroundColor = event.color.toRGB();
    });
    $('#es-styling-font-color-picker').on('changeColor', function (event) {
        es_fontColor = event.color.toRGB();
    });
}

function generateStylesTable(dataRows) {
    $('#es-table').show();
    $('#es-table>tbody').empty();

    $.each(dataRows, function (index, value) {
        $('#es-table>tbody').append('<tr data-id="' + value.id + '">' +
            '<td>' + value.name + '</td>' +
            '<td>' + value.backroundColor + '</td>' +
            '<td>' + value.fontColor + '</td>' +
            '</tr>');
    })
}

function updateStylingData(value) {
    $.each(data.stylingData, function (index, item) {
        if (item.id == value.id) {
            data.stylingData[index] = value;
        }
    });

    generateStylesTable(data.stylingData);    //regenerate table
}

function saveStyles() {
    chrome.storage.sync.set({
        extraStylingData: data
    }, function () {
        showSuccess('Saved');
    });
}

// Saved Options loaded
$(document).on('optionsLoaded', function (event, inputData) {
    initColorPickers();
    data = inputData.styling;
    $('#es-hide-none-switch').prop('checked', data.hideNoneItems);
    
    if(data.stylingData.length < 1){
        $('#es-table').hide();
    }
    else {
        generateStylesTable(data.stylingData);
    }
});

// Styling events
$('#es-hide-none-switch').on('change', function (e) {
    data.hideNoneItems = $('#es-hide-none-switch').prop('checked');
    saveStyles();
});

$('#es-table>tbody').on('click', 'tr', function (event) {
    $('#es-update-styling').css('display', 'inline-block'); // show

    var row = $(this);
    es_selectedStyling = {
        id: row.attr('data-id'),
        name: $(row.children()[0]).text(),
        backroundColor: $(row.children()[1]).text(),
        fontColor: $(row.children()[2]).text()
    }
    $('#es-styling-input').val(es_selectedStyling.name);
    $('#es-styling-background-color-picker').colorpicker('setValue', es_selectedStyling.backroundColor);
    $('#es-styling-font-color-picker').colorpicker('setValue', es_selectedStyling.fontColor);
});
$('#es-add-styling').on('click', function () {
    var name = $('#es-styling-input').val();
    if (name && name.length > 0 && es_backgroundColor && es_fontColor) {
        var styling = {
            id: data.stylingData.length + 1,
            name: name,
            backroundColor: 'rgba(' + es_backgroundColor.r + ',' + es_backgroundColor.g + ',' + es_backgroundColor.b + ',' + es_backgroundColor.a + ')',
            fontColor: 'rgba(' + es_fontColor.r + ',' + es_fontColor.g + ',' + es_fontColor.b + ',' + es_fontColor.a + ')'
        }
        data.stylingData.push(styling);
    }
    generateStylesTable(data.stylingData);
    $('#es-update-styling').hide();
    saveStyles();
});
$('#es-update-styling').on('click', function () {
    var name = $('#es-styling-input').val();
    if (name && name.length > 0 && es_backgroundColor && es_fontColor) {
        es_selectedStyling.name = name;
        es_selectedStyling.backroundColor = 'rgba(' + es_backgroundColor.r + ',' + es_backgroundColor.g + ',' + es_backgroundColor.b + ',' + es_backgroundColor.a + ')';
        es_selectedStyling.fontColor = 'rgba(' + es_fontColor.r + ',' + es_fontColor.g + ',' + es_fontColor.b + ',' + es_fontColor.a + ')'
    }
    updateStylingData(es_selectedStyling);
    $('#es-update-styling').hide();
    saveStyles();
})