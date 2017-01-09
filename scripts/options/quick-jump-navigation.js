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

function generateQuickJumpStylesTable(rows, saveOnGenerate) {
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
        if (saveOnGenerate) {
            JPlus.Options.Data.customizations.quickJump.data.styling = rows;
            JPlus.Options.Save();
            clearQJFormInputFields();
        }
    }
}

function updateQuickJumpStylingData(value) {
    var stylingData = JPlus.Options.Data.customizations.quickJump.data.styling;
    $.each(stylingData, function (index, item) {
        if (item.id == value.id) {
            stylingData[index] = value;
        }
    });

    generateQuickJumpStylesTable(stylingData, true);
}

function clearQJFormInputFields() {
    $('#qj-styling-input').val('');
    $('#qj-styling-background-color-picker').colorpicker('setValue', '');
    $('#qj-styling-font-color-picker').colorpicker('setValue', '');
}

// Saved Options loaded
$(document).on('JPlusOptionsLoaded', function (event) {
    initQuickJumpColorPickers();

    if (JPlus != undefined &&
        JPlus.Options != undefined &&
        JPlus.Options.Data != undefined) {
        if (JPlus.Options.Data.customizations.quickJump.data.styling.length < 1) {
            $('#qj-table').hide();
        } else {
            generateQuickJumpStylesTable(JPlus.Options.Data.customizations.quickJump.data.styling, false);
        }
    }
});

// row click
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
        var stylingData = JPlus.Options.Data.customizations.quickJump.data.styling;

        var styling = {
            id: stylingData.length + 1,
            name: name,
            backroundColor: 'rgba(' + qj_backgroundColor.r + ',' + qj_backgroundColor.g + ',' + qj_backgroundColor.b + ',' + qj_backgroundColor.a + ')',
            fontColor: 'rgba(' + qj_fontColor.r + ',' + qj_fontColor.g + ',' + qj_fontColor.b + ',' + qj_fontColor.a + ')'
        }
        stylingData.push(styling);

        generateQuickJumpStylesTable(stylingData, true);
        $('#qj-update-styling').hide();
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
    }
})