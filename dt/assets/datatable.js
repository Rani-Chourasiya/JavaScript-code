var minDate, maxDate;

// Custom filtering function which will search data in column four between two values
$.fn.dataTable.ext.search.push(
    function (settings, data, dataIndex) {
        var min = minDate.val();
        var max = maxDate.val();
        var date = new Date(data[4]);

        if (
            (min === null && max === null) ||
            (min === null && date <= max) ||
            (min <= date && max === null) ||
            (min <= date && date <= max)
        ) {
            return true;
        }
        return false;
    }
);

$(document).ready(function () {
    // Create date inputs
    minDate = new DateTime($('#min'), {
        format: 'MMMM Do YYYY'
    });
    maxDate = new DateTime($('#max'), {
        format: 'MMMM Do YYYY'
    });
    

    // DataTables initialisation
    var table = $('#example').DataTable({
        initComplete: function () {
            this.api()
                .columns()
                .every(function () {
                    var column = this;
                    var select = $('<select><option value=""></option></select>')
                        .appendTo($(column.footer()).empty())
                        .on('change', function () {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());

                            column.search(val ? '^' + val + '$' : '', true, false).draw();
                        });

                    column
                        .data()
                        .unique()
                        .sort()
                        .each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>');
                        });
                });
        },
        
        // ajax: {
        //     url: 'assets/jsonData.json',
        //     "dataSrc": function ( json ) {
        //         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
        //           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
        //         }
        //         return json;
        //       }
        // },
        columns: [
            { details: 'id' },
            { details: 'name' },
            { details: 'position' },
            { details: 'office' },
            { details: 'extn' },
            { details: 'start_date' },
            { details: 'salary' },
        ]
    });

    // row deleted code
    $('#example tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
    });

    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });
    // Refilter the table
    $('#min, #max').on('change', function () {
        table.draw();
    });
    $("#clearFilter").click(function () {
        //$.fn.dataTable.ext.search.pop();
        $("#min").val('');
        $("#max").val('');
        initializeMinMax();
        table.draw();
    });
});

