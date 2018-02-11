;
(function($) {

    var target = ".target";

    var colors = [];

    function init() {
        target = $(target);

        colors = [{
                label: 'red',
                color: 'red'
            },
            {
                label: 'blue',
                color: 'blue'
            }, {
                label: 'gray',
                color: '#ccc'
            }
        ];

        drow(target, colors);
    };

    function drow(targetDiv, colorList) {
        $(colorList).each(function() {
            var item = $("<div/>");
            var label = $("<label/>");
            label.html(this.label);
            var color = $("<span/>");
            color.css({ background: this.color });

            item.append(label);
            item.append(color);
            targetDiv.append(item);
        });
    }

    $(init);
}(jQuery));