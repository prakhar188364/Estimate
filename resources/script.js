window.addEventListener('load', function () {
    addItem();
    console.log("All item loaded");
});

function addItem() {

    var counter = new Date().getMilliseconds();
    counter = counter++;
    var lastitemappend = `<tr class="lastItem">
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>भाड़ा</td>
                            <td><input type="number" pattern="\\d*" id="fare" class="form-control round" /></td>
                            <td></td>
                        </tr>
                        <tr class="table table-success">
                            <th></th>
                            <th></th>
                            <th>कुल वज़न</th>
                            <th><input type="number" id="netWeight" class="form-control round" disabled/></th>
                            <th>कुल राशि</th><th class="netamountth"><input type="number" id="netAmount" class="form-control netAmount round" disabled/></th>
                            <th></th>
                        </tr>`;

    var cell1 = `<tr class=${"insertafter" + counter} data-name=${"item" + counter}>
                 <td><div class="autocomplete"> <input  id='${"item" + counter}' type="text" data-name=${"dtname" + counter} name="myCountry" class="form-control round"></div></td>
                 <td><input type="text" id=${"size" + counter} data-name=${"dtname" + counter} class="size form-control round"/></td>
                 <td><input type="number"  id=${"quantity" + counter} data-name=${"dtname" + counter} class="quantity form-control round"/></td>
                 <td><input type="number" pattern="\\d*" type="number" id=${"weight" + counter} data-name=${"dtname" + counter} class="weight form-control round" value=0/></td>
                 <td> <input type="number" pattern="\\d*" type="number" id=${"rate" + counter}  data-name=${"dtname" + counter} class="rate form-control round"/></td>
                 <td><input type="number" id=${"total" + counter} data-name=${"dtname" + counter} class="total form-control round" disabled/></td>
                 <td class="print"><button type=\"button\"  class="no-print btn btn-danger delItemrow" data-name=${counter}>Delete</button></div><div></td> 
               </tr>`;

    if ($(".lastItem").length == 0) {
        $("#myTable tbody").append(cell1).append(lastitemappend);
    } else {
        $(cell1).insertBefore(".lastItem");
    }

    //$(".additem").attr("disabled", true);

    autocomplete(document.getElementById(`${"item" + counter}`), varity);

}


$(document).ready(function () {

    $(document.body).on('click', ".delItemrow", function (e) {
        $(this).parents('tr').remove();
        $("#netAmount").val(grandTotalAmount());
        $("#netWeight").val(grandTotalWeight());
        $(".additem").attr("disabled", false);
        e.preventDefault();
    });

    $(document.body).on('blur', ".autocomplete input", function (e) {
        var txt = $(this).attr('data-name');
        var rowNumber = txt.replace(/[^0-9]/g, '');
        $(`${"#myTable td input#weight" + rowNumber}`).removeAttr('disabled').css({'background': '#fff'});

        setTimeout(() => {
            var dropdownvalue = $(`${"#myTable td input#item" + rowNumber}`).val();

            if (dropdownvalue !== undefined) {
                if ((dropdownvalue.startsWith("RHL")) || (dropdownvalue.startsWith("H/W"))) {
                    $(`${"#myTable td input#weight" + rowNumber}`).attr('disabled', true).css({'background': '#ccc'});
                }
            }

        }, 100);
        e.preventDefault();
    });

    $(document.body).on('keyup', "table tr", function (e) {

        if (!$(this).hasClass("lastItem")) {
            var currentItem = $(this).find("td:nth-child(1) input").val();
            var currentQuantity = $(this).find("td:nth-child(3) input").val();
            var currentWeight = $(this).find("td:nth-child(4) input").val();
            var currentRate = $(this).find("td:nth-child(5) input").val();

            var rowTotal;
            if (currentItem.startsWith("RHL") || currentItem.startsWith("H/W")) {
                rowTotal = currentQuantity * currentRate;
            } else {
                rowTotal = currentWeight * currentRate;
            }
            $(this).find(".total").val(rowTotal.toFixed(2));
            $("#netAmount").val(grandTotalAmount());
            $("#netWeight").val(grandTotalWeight());
        } else {
            $("#netAmount").val(grandTotalAmount());
        }

        if ($(this).find(".total").val() > 0) {
            $(".additem").attr("disabled", false);
        }
        e.preventDefault();
    });

});


function grandTotalAmount() {
    var total = 0;
    $(".total").each(function () {
        total += Number($(this).val());
    });
    return Number(total + Number($("#fare").val())).toFixed(0);
}

function grandTotalWeight() {
    var weight = 0;
    $(".weight").each(function () {
        weight += Number($(this).val());
    });
    return weight.toFixed(3);
}


function printfn() {

    var netWeight = $("#netWeight").val();
    var netAmount = $("#netAmount").val();
    var netfare = $("#fare").val();
    var tablehtml = '';
    var rowSize = $('#myTable tbody tr').length - 2;

    for (var i = 0; i < rowSize; i++) {
        var count = $('#myTable tbody tr')[i].className;
        tablehtml = tablehtml + '<div style="margin-top: 10px;border-top: 1px solid black">' +
            '<span style="display: inline-block;width:25%;text-align: left">' + $("." + count + " td:nth-child(1) input").val() + '</span>' +
            '<span style="display: inline-block;width:15%;text-align: center">' + $("." + count + " td:nth-child(2) input").val() + '</span>' +
            '<span style="display: inline-block;width:8%;text-align: center">' + $("." + count + " td:nth-child(3) input").val() + '</span>' +
            '<span style="display: inline-block;width:18%;text-align: center">' + $("." + count + " td:nth-child(4) input").val() + '</span>' +
            '<span style="display: inline-block;width:15%;text-align: center">' + $("." + count + " td:nth-child(5) input").val() + '</span>' +
            '<span style="display: inline-block;width:19%;text-align: right">' + commaSeperated($("." + count + " td:nth-child(6) input").val()) + '</span>' +
            '</div>';
    }

    var mywindow = window.open('', 'PRINT', 'height=400,width=600');

    mywindow.document.write('<html><head></head>');

    mywindow.document.write('<body style="font-size: 12px; font-weight: bold;width: 72mm">');
    mywindow.document.write('<div>');
    mywindow.document.write('<div>' +
        '<span style="display: inline-block;width:25%;text-align: left">आइटम</span>' +
        '<span style="display: inline-block;width:15%;text-align: center">साइज़</span>' +
        '<span style="display: inline-block;width:8%;text-align: center">नग</span>' +
        '<span style="display: inline-block;width:18%;text-align: center">वज़न</span>' +
        '<span style="display: inline-block;width:15%;text-align: center">रेट</span>' +
        '<span style="display: inline-block;width:19%;text-align: right">टोटल</span>' +
        '</div>');
    mywindow.document.write(tablehtml);

    mywindow.document.write('<div style="margin-top: 10px;letter-spacing: 2px;border-top: 1px solid black"><span>भाड़ा</span><span style="margin-left: 5%">' + commaSeperated(netfare) + '</span></div>');
    mywindow.document.write('<div style="font-size:14px; margin-top: 10px;letter-spacing: 1.5px;border-top: 1px solid black"><span>कुल वज़न</span><span style="margin-left: 4%">' + netWeight + '</span><span style="margin-left: 4%">कुल राशि</span><span style="margin-left: 4%">' + commaSeperated(netAmount) + '</span></div>');
    mywindow.document.write('<div>');
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*!/

    mywindow.print();
    mywindow.close();

    return true;
}

function commaSeperated(netNumber) {
    return new Intl.NumberFormat('en-IN', {maximumSignificantDigits: 10}).format(netNumber);
}
