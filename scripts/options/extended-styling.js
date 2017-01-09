var es_backgroundColor;
var es_fontColor;
var es_selectedStyling;

function initExtendedStylingColorPickers() {
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

function generateStylesTable(rows, saveOnGenerate) {
    if (rows != undefined && rows.length != undefined && rows.length > 0) {
        $('#es-table').show();
        $('#es-table>tbody').empty();

        $.each(rows, function (index, value) {
            $('#es-table>tbody').append('<tr data-id="' + value.id + '">' +
                '<td>' + value.name + '</td>' +
                '<td>' + value.backroundColor + '</td>' +
                '<td>' + value.fontColor + '</td>' +
                '</tr>');
        });
        if (saveOnGenerate) {
            JPlus.Options.Data.customizations.extraStyling.data.styling = rows;
            JPlus.Options.Save();
            clearESFormInputFields();
        }
    }
}

function updateStylingData(value) {
    var stylingData = JPlus.Options.Data.customizations.extraStyling.data.styling;
    $.each(stylingData, function (index, item) {
        if (item.id == value.id) {
            stylingData[index] = value;
        }
    });

    generateStylesTable(stylingData, true);
}

function clearESFormInputFields() {
    $('#es-styling-input').val('');
    $('#es-styling-background-color-picker').colorpicker('setValue', '');
    $('#es-styling-font-color-picker').colorpicker('setValue', '');
}

// Saved Options loaded
$(document).on('JPlusOptionsLoaded', function (event) {
    initExtendedStylingColorPickers();

    if (JPlus != undefined &&
        JPlus.Options != undefined &&
        JPlus.Options.Data != undefined) {
        if (JPlus.Options.Data.customizations.extraStyling.data.styling.length < 1) {
            $('#es-table').hide();
        } else {
            generateStylesTable(JPlus.Options.Data.customizations.extraStyling.data.styling, false);
        }
        $('#es-hide-none-switch').prop('checked', JPlus.Options.Data.customizations.extraStyling.data.hideNoneItems);
    }
});

// Styling events
$('#es-hide-none-switch').on('change', function (e) {
    JPlus.Options.Data.customizations.extraStyling.data.hideNoneItems = $('#es-hide-none-switch').prop('checked');
    JPlus.Options.Save();
});

// row click
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
        var stylingData = JPlus.Options.Data.customizations.extraStyling.data.styling;

        var styling = {
            id: stylingData.length + 1,
            name: name,
            backroundColor: 'rgba(' + es_backgroundColor.r + ',' + es_backgroundColor.g + ',' + es_backgroundColor.b + ',' + es_backgroundColor.a + ')',
            fontColor: 'rgba(' + es_fontColor.r + ',' + es_fontColor.g + ',' + es_fontColor.b + ',' + es_fontColor.a + ')'
        }
        stylingData.push(styling);

        generateStylesTable(stylingData, true);
        $('#es-update-styling').hide();
    }
});
$('#es-update-styling').on('click', function () {
    var name = $('#es-styling-input').val();
    if (name && name.length > 0 && es_backgroundColor && es_fontColor) {
        es_selectedStyling.name = name;
        es_selectedStyling.backroundColor = 'rgba(' + es_backgroundColor.r + ',' + es_backgroundColor.g + ',' + es_backgroundColor.b + ',' + es_backgroundColor.a + ')';
        es_selectedStyling.fontColor = 'rgba(' + es_fontColor.r + ',' + es_fontColor.g + ',' + es_fontColor.b + ',' + es_fontColor.a + ')'

        updateStylingData(es_selectedStyling);
        $('#es-update-styling').hide();
    }
})