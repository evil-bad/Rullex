;
(function($) {

    let buildDif = 2;
    let minDif = 3;
    let majDiff = 10;


    let target = ".target";

    let colors = [];

    function init() {
        target = $(target);

        // build - hue
        // minor - saturation
        // major - light

        //hsl hue, saturation, light
        //    0-360  70-100  60-85

        colors = [];

        let build = 10;
        let minor = 10;
        let light = 10;

        for (let light = 0; light < 10; light++) {
            for (let minor = 0; minor < 10; minor++) {
                for (let build = 0; build < 10; build++) {
                    colors.push({
                        h: build,
                        s: minor,
                        l: light,
                        label: `${light}, ${minor}, ${build}`
                    });
                }
            }
        }

        drow(target, colors);
    };

    function drow(targetDiv, colorList) {
        $(colorList).each(function() {
            let item = $("<div/>");
            let label = $("<label/>");
            label.html(this.label);
            let color = $("<span/>");
            let rgbLabel = $("<i/>");
            let rgb = getVersionColor(this.h, this.s, this.l);
            //rgbLabel.html(rgb);
            color[0].style.background = rgb;

            item.append(label);
            item.append(color);
            item.append(rgbLabel);
            targetDiv.append(item);
        });
    }

    function getVersionColor(build, minor, major) {

        let h = (((build + 1) * buildDif) % 100) / 100;
        let s = ((((minor + 1) * minDif) % 70) + 30) / 100;
        let l = ((((major + 1) * majDiff) % 60) + 40) / 100;

        return hslToRgb(h, s, l);
    }

    function hslToRgb(h, s, l) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            let hue2rgb = function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return "rgb(" + Math.round(r * 255) + "," + Math.round(g * 255) + "," + Math.round(b * 255) + ")";
    }

    $(init);
}(jQuery));