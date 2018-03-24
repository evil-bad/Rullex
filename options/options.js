var Option = {};

var OptionTarget = {
    colorSelection: '',
    colorGridLine: '',
    colorGridLineActive: '',
    colorUnit: '',
    colorDistance: '',
    colorFantomResize: '',
    sizeUnit: '',
    sizeDistance: ''
};

function getOption() {
    for (const input in OptionTarget) {
        if (OptionTarget.hasOwnProperty(input)) {
            Option[input] = document.getElementById(input).value;
        }
    }
}

function setOption(items) {
    for (const input in OptionTarget) {
        if (OptionTarget.hasOwnProperty(input)) {
            if (items && items[input]) {
                document.getElementById(input).value = items[input];
                color_change(input, items[input]);
            }
        }
    }
}

function save_options() {
    getOption();
    ChromeStorage.save(Option);
}

function restore_options() {
    ChromeStorage.remove();
    ChromeStorage.restore(function(option) {
        setOption(option);
    });
}

function color_change(id, value) {
    var input = this;
    if (typeof(id) === 'string') input = document.getElementById(id);
    input.previousElementSibling.style.color = value || this.value;
}


document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.querySelectorAll('input[type=color]').forEach(function(input) {
    input.addEventListener('change', color_change)
});