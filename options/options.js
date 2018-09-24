let Option = {};

let OptionTarget = {
    colorSelection: '',
    colorGridLine: '',
    colorGridLineActive: '',
    colorUnit: '',
    colorDistance: '',
    colorFantomResize: '',
    sizeUnit: { min: 1, max: 99 },
    sizeDistance: { min: 1, max: 99 },
    opacityOverlay: { min: 10, max: 90 },
    opacitySelection: { min: 10, max: 90 },
    theme: '',
    unit: '',
    screenWidth: { min: 10, max: 99 }
};

let Theme = {
    midnight: [
        { id: 'opacityOverlay', value: 90 },
        { id: 'opacitySelection', value: 50 },
        { id: 'colorSelection', value: '#50ff48' },
        { id: 'colorGridLineActive', value: '#ff8794' },
        { id: 'colorGridLine', value: '#f71919' },
        { id: 'colorUnit', value: '#ffe44d' },
        { id: 'colorDistance', value: '#ffa5a5' },
        { id: 'colorFantomResize', value: '#ff0f0f' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ],
    dawn: [
        { id: 'opacityOverlay', value: 70 },
        { id: 'opacitySelection', value: 20 },
        { id: 'colorSelection', value: '#485bff' },
        { id: 'colorGridLineActive', value: '#9e9e9e' },
        { id: 'colorGridLine', value: '#464646' },
        { id: 'colorUnit', value: '#a1b5b5' },
        { id: 'colorDistance', value: '#000000' },
        { id: 'colorFantomResize', value: '#646464' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ],
    sunrise: [
        { id: 'opacityOverlay', value: 50 },
        { id: 'opacitySelection', value: 60 },
        { id: 'colorSelection', value: '#ff863a' },
        { id: 'colorGridLineActive', value: '#ffc140' },
        { id: 'colorGridLine', value: '#ffac00' },
        { id: 'colorUnit', value: '#1eb1ff' },
        { id: 'colorDistance', value: '#4149d0' },
        { id: 'colorFantomResize', value: '#80d3ff' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ],
    noon: [
        { id: 'opacityOverlay', value: 10 },
        { id: 'opacitySelection', value: 40 },
        { id: 'colorSelection', value: '#fff38b' },
        { id: 'colorGridLineActive', value: '#1dab00' },
        { id: 'colorGridLine', value: '#2cff00' },
        { id: 'colorUnit', value: '#0816ff' },
        { id: 'colorDistance', value: '#0000ff' },
        { id: 'colorFantomResize', value: '#ff7304' },
        { id: 'sizeUnit', value: 26 },
        { id: 'sizeDistance', value: 20 }
    ],
    sunfade: [
        { id: 'opacityOverlay', value: 60 },
        { id: 'opacitySelection', value: 10 },
        { id: 'colorSelection', value: '#fffdce' },
        { id: 'colorGridLineActive', value: '#ffff00' },
        { id: 'colorGridLine', value: '#ff00ff' },
        { id: 'colorUnit', value: '#00ffff' },
        { id: 'colorDistance', value: '#0000ff' },
        { id: 'colorFantomResize', value: '#ff8181' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ],
    nightfall: [
        { id: 'opacityOverlay', value: 50 },
        { id: 'opacitySelection', value: 50 },
        { id: 'colorSelection', value: '#6f7df9' },
        { id: 'colorGridLineActive', value: '#4a82de' },
        { id: 'colorGridLine', value: '#1d54ad' },
        { id: 'colorUnit', value: '#2a24cc' },
        { id: 'colorDistance', value: '#2493cc' },
        { id: 'colorFantomResize', value: '#6024cc' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ],
    dusk: [
        { id: 'opacityOverlay', value: 80 },
        { id: 'opacitySelection', value: 10 },
        { id: 'colorSelection', value: '#fffdce' },
        { id: 'colorGridLineActive', value: '#eeeeee' },
        { id: 'colorGridLine', value: '#cccccc' },
        { id: 'colorUnit', value: '#ffffff' },
        { id: 'colorDistance', value: '#ffffff' },
        { id: 'colorFantomResize', value: '#888888' },
        { id: 'sizeUnit', value: 22 },
        { id: 'sizeDistance', value: 18 }
    ],
    morning: [
        { id: 'opacityOverlay', value: 40 },
        { id: 'opacitySelection', value: 50 },
        { id: 'colorSelection', value: '#90ff84' },
        { id: 'colorGridLineActive', value: '#ffffff' },
        { id: 'colorGridLine', value: '#00ffff' },
        { id: 'colorUnit', value: '#ffffff' },
        { id: 'colorDistance', value: '#000000' },
        { id: 'colorFantomResize', value: '#d3d3d3' },
        { id: 'sizeUnit', value: 20 },
        { id: 'sizeDistance', value: 16 }
    ]
};

function getOption() {
    for (const input in OptionTarget) {
        if (OptionTarget.hasOwnProperty(input)) {
            let value = document.getElementById(input).value;
            if (OptionTarget[input].min)
                value = value < OptionTarget[input].min ? OptionTarget[input].min : value;
            if (OptionTarget[input].max)
                value = value > OptionTarget[input].max ? OptionTarget[input].max : value;
            if (OptionTarget[input].checkbox)
                value = document.getElementById(input).checked;

            Option[input] = value;
        }
    }

    if (Option.theme === 'custom')
        Option.custom = Object.assign({}, Option);
}

function setOption(items) {
    if (!items) return;

    Option.custom = items.custom;

    for (const input in OptionTarget) {
        if (OptionTarget.hasOwnProperty(input)) {
            if (items[input]) {
                if (OptionTarget[input].checkbox)
                    document.getElementById(input).checked = items[input];
                else
                    document.getElementById(input).value = items[input];

                input_change(input, items[input]);
            }
        }
    }
}

function save_options() {
    getOption();
    ChromeStorage.save(Option);
}

function restore_options() {
    ChromeStorage.restore(function(option) {
        setOption(option);
    });
}

function input_change(id, value) {
    let input = this;
    if (typeof(id) === 'string') input = document.getElementById(id);

    if (input.type === 'color')
        input.previousElementSibling.style.color = value || this.value;

    if (!input.hasAttribute('no-theme'))
        document.getElementById('theme').value = 'custom';
}

function dropdown_select(e) {
    var item = e.target;
    var parent = item.parentElement;

    if (!parent || parent.tagName !== 'UL' || item.id === 'theme') return;

    if (parent.classList.contains('opened')) {
        parent.previousElementSibling.value = item.textContent;
        apply_theme(item.textContent);
        dd_close();
    } else {
        dd_open(parent);
    }
}

function dd_close() {
    document.querySelectorAll('dropdown-container ul').forEach((dd) => dd.classList.remove('opened'));
}

function dd_open(parent) {
    parent.classList.add('opened');
}

function key_handler(e) {
    if (e.keyCode === 27) dd_close();
}

function global_click(e) {
    if (e.target.tagName !== 'LI' && e.target.parentElement.tagName !== 'DROPDOWN-WRAPPER') dd_close();
}

function apply_theme(theme) {
    if (theme === 'custom') {
        setOption(Option.custom);
    } else {
        var theme = Theme[theme];
        if (!theme) return;

        theme.forEach((control) => {
            document.getElementById(control.id).value = control.value;
            input_change(control.id, control.value, true);
        });
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

document.addEventListener('keydown', key_handler);
document.addEventListener('click', global_click);

document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('change', input_change)
});

Array(...document.getElementsByTagName('dropdown-container')).forEach(function(dropdown) {
    this.addEventListener('click', dropdown_select);
});