function loadDonuts() {
    $('.donut-chart').each(function() {
        var data = [];
        var colors = [];

        $(this).find('.data > .tuple').each(function() {

            if ($(this).data('label') !== undefined && $(this).data('value') !== undefined) {
                data.push({
                    value: $(this).data('value'),
                    label: $(this).data('label')
                });

                if ($(this).data('color') !== undefined) {
                    colors.push($(this).data('color'));
                }
            }
        });

        $target = $(this).children('.chart');

        options = {
            element: $target.prop('id'),
            data: data,
            backgroundColor: '#fff',
            labelColor: '#676761',
            formatter: function (y) { return y + "%" }
        };

        if (colors.length == data.length) {
            options['colors'] = colors;
        }

        Morris.Donut(options);
    });
};

function loadCharts(){
    loadDonuts();
};