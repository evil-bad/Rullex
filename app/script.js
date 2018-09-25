(function($) {
    let Global = {};
    let count;

    let BootLoader = {
        switchOn: 'switchOn',
        switchOff: 'switchOff',
        run: 'run'
    };

    let Ruller = {
        overlaySelector: 'chrome-ruller-overlay',
        wrapper: 'wrapper',
        main: 'ruller',
        selection: 'selection',
        width: 'value width',
        height: 'value height',
        topLine: 'line top',
        rightLine: 'line right',
        bottomLine: 'line bottom',
        leftLine: 'line left',
        resizable: 'resizable',
        rotate: 'rotate',
        rotateLabel: 'rotateLabel',
        rotated: 'rotated',
        info: 'info',
        infoTop: 'info-top',
        infoRight: 'info-right',
        infoBottom: 'info-bottom',
        infoLeft: 'info-left',
        floatMenu: 'menu'
    };

    let event = {
        mousedown: 'mousedown.ruller',
        create: 'createruller',
        remove: 'removeruller',
        drow: 'mousemove.ruller',
        fix: 'mouseup.ruller',
        keypress: 'keypress.ruller',
        keydown: 'keydown.ruller',
        keyup: 'keyup.ruller',
        resize: 'resize.ruller',
        mouseenter: 'mouseenter.ruller',
        mouseleave: 'mouseleave.ruller',
        toggleInfo: 'toggleinfo.ruller'
    };

    let state = {
        hover: ':hover'
    };

    let key = {
        right: 37,
        left: 39
    };

    let options = {};
    let unitMultiplier = 1;

    function init() {
        count = 0;
        Global = {
            html: $('html'),
            body: $('body'),
            window: $(window),
            document: $(document),
            rullerList: {},
            dot: '.'
        };

        ChromeStorage.restore(function(option) {
            options = option || {};

            Ruller.overlay = $('<div/>', { class: Ruller.overlaySelector, css: { backgroundColor: 'rgba(0,0,0,' + options.opacityOverlay / 100 + ')' } }).appendTo(Global.body);

            setOverlaySize();
            hookMouseEvents();
            run();
            bindUnload();
            calculateMultiplier();
            showUpdateMessage();
        });
    }

    function showUpdateMessage() {
        var manifestData = chrome.runtime.getManifest();
        ChromeStorage.getVersion((version) => {
            if (!version || version < manifestData.version) {
                ChromeStorage.saveVersion(manifestData.version);
                var updateMessage = $('<div/>', {
                    css: {
                        position: 'fixed',
                        top: '50px',
                        left: '50px',
                        color: 'darkslateblue',
                        fontSize: 'calc(0.5vw + 10px)',
                        background: 'lightskyblue',
                        borderRadius: '10px',
                        padding: '1vw'
                    },
                    text: 'Chrulex updated! v' + manifestData.version
                }).appendTo(document.querySelector('.' + Ruller.overlaySelector));

                setTimeout(() => {
                    updateMessage.remove();
                }, 3000);
            }
        });
    }

    function hookMouseEvents() {
        Global.window.on(event.mousedown, function(e) {
            let isRuller = ((e.target.className === Ruller.main) || $(e.target).parents(Global.dot + Ruller.wrapper).length);
            let isLeftButton = e.which === 1;
            let isCentralButton = e.which === 2;

            if (isRuller) {
                if (isLeftButton) return;
                else if (isCentralButton) Global.window.trigger(event.remove, [e]);
                else return;
            } else {
                if (isLeftButton) Global.window.trigger(event.create, [e]);
                else return;
            }
        });
    }

    function run() {
        Global.window.on(event.create, (cutommEvent, originalEvent) => Global.rullerList[count] = new ChromeRuller(originalEvent, count++));
        Global.window.on(event.resize, setOverlaySize);
    }

    function setOverlaySize() {
        Global.documentHeight = $(document).height();
        Global.documentWidth = $(document).width();
        Ruller.overlay.css({ width: Global.documentWidth, height: Global.documentHeight });
    }

    function bindUnload() {
        Global.window.on(event.keypress, function(e) {
            if (e.keyCode === 17) unload();
            else if (e.keyCode === 9) toggleInfo();
        });
    }

    function toggleInfo() {
        options.showInfo = !options.showInfo;
        Global.window.trigger(event.toggleInfo);
    }

    function unload(forse) {
        for (const key in Global.rullerList) {
            if (Global.rullerList.hasOwnProperty(key)) Global.rullerList[key].remove();
        }

        if (forse) {
            Global.rullerList = {};
            Ruller.overlay.remove();
            Global.window.off(event.create);
            Global.window.off(event.mousedown);
            Global.window.off(event.keypress);
            Global.window.off(event.resize);
            Global.window.off(event.toggleInfo);
        }
    }

    function _getRotateObject(style, clockwise) {
        var transform = style.transform.replace(/[^-0-9]/g, '');
        if (clockwise) transform--;
        else transform++;

        return {
            css: 'rotate(' + transform + 'deg)',
            neg: 'rotate(' + (-transform) + 'deg)',
            value: transform
        }
    }

    let ChromeRuller = function(e, id) {
        this.id = id;
        this.startX = e.clientX + this.getXCorrection();
        this.startY = e.clientY + this.getYCorrection();
        this.endX = 0;
        this.endY = 0;
        this.forceStay = e.ctrlKey;

        this.wrapper = $('<div/>', { class: Ruller.wrapper, css: { 'border-color': options.colorFantomResize } }).appendTo(Ruller.overlay);
        this.selection = $('<div/>', { class: Ruller.main, 'data-id': this.id, tabindex: 0 }).appendTo(this.wrapper);
        this.heightLabel = $('<span/>', { class: Ruller.height, css: { color: options.colorUnit, 'font-size': options.sizeUnit + 'px' } }).appendTo(this.selection);
        this.widthLabel = $('<span/>', { class: Ruller.width, css: { color: options.colorUnit, 'font-size': options.sizeUnit + 'px' } }).appendTo(this.selection);
        this.selectionBack = $('<div/>', { class: Ruller.selection, css: { background: options.colorSelection, opacity: options.opacitySelection / 100 } }).appendTo(this.selection);

        this.rotateWraper = $('<div/>', { class: Ruller.rotate }).appendTo(this.selection);
        this.rotateLabel = $('<div/>', { class: Ruller.rotateLabel, css: { color: options.colorUnit, 'font-size': options.sizeUnit + 'px' } }).appendTo(this.rotateWraper);

        this.topLine = $('<span/>', { class: Ruller.topLine, css: { 'border-color': options.colorGridLine } }).appendTo(this.selection).css({ width: 2 * Global.documentWidth });
        this.rightLine = $('<span/>', { class: Ruller.rightLine, css: { 'border-color': options.colorGridLine } }).appendTo(this.selection).css({ height: 2 * Global.documentHeight });
        this.bottomLine = $('<span/>', { class: Ruller.bottomLine, css: { 'border-color': options.colorGridLine } }).appendTo(this.selection).css({ width: 2 * Global.documentWidth });
        this.leftLine = $('<span/>', { class: Ruller.leftLine, css: { 'border-color': options.colorGridLine } }).appendTo(this.selection).css({ height: 2 * Global.documentHeight });

        this.info = $('<div/>', { class: Ruller.info, css: { 'font-size': options.sizeDistance + 'px' } }).appendTo(this.wrapper);
        this.infoTop = $('<div/>', { class: Ruller.infoTop, css: { color: options.colorDistance } }).appendTo(this.info);
        this.infoRight = $('<div/>', { class: Ruller.infoRight, css: { color: options.colorDistance } }).appendTo(this.info);
        this.infoBottom = $('<div/>', { class: Ruller.infoBottom, css: { color: options.colorDistance } }).appendTo(this.info);
        this.infoLeft = $('<div/>', { class: Ruller.infoLeft, css: { color: options.colorDistance } }).appendTo(this.info);

        this.wrapper.draggable({ drag: this.setInfo.bind(this) });
        this.wrapper.resizable({ handles: 'n,w,s,e,se' });

        this.resize();

        Global.window.on(event.drow + Global.dot + this.id, this.drow.bind(this));
        Global.window.on(event.fix + Global.dot + this.id, this.fix.bind(this));
        Global.window.on(event.create + Global.dot + this.id, this.checkForStay.bind(this));
        Global.window.on(event.remove + Global.dot + this.id, this.remove.bind(this));
        Global.window.on(event.keydown + Global.dot + this.id, this.bindPressListeners.bind(this));
        Global.window.on(event.toggleInfo, this.setInfo.bind(this));
        this.selection.on(event.mouseenter + Global.dot + this.id, this.toggleFocus.bind(this, true));
        this.selection.on(event.mouseleave + Global.dot + this.id, this.toggleFocus.bind(this, false));
    };

    ChromeRuller.prototype.getXCorrection = function() {
        return (Global.document.width() - Global.window.width() + Global.html.scrollLeft());
    };

    ChromeRuller.prototype.getYCorrection = function() {
        return Global.html.scrollTop();
    };

    ChromeRuller.prototype.resize = function(e) {
        let self = this;
        this.wrapper.resize(e => {
            self.setLabelValues(e);
            self.setInfo();
        });
    };

    ChromeRuller.prototype.setLabelValues = function() {
        this.heightLabel.html(convertUnit(this.selection.height(), true));
        this.widthLabel.html(convertUnit(this.selection.width()));
    };

    ChromeRuller.prototype.setInfo = function() {
        if (!options.showInfo) {
            this.info.hide();
            return;
        };

        this.info.show();
        let offset = this.wrapper.offset();
        this.infoTop.html(convertUnit(offset.top, true));
        this.infoRight.html(convertUnit(window.innerWidth - offset.left - this.wrapper.width()));
        this.infoBottom.html(convertUnit(window.innerHeight - offset.top - this.wrapper.height(), true));
        this.infoLeft.html(convertUnit(offset.left));
    };

    ChromeRuller.prototype.drow = function(e) {
        this.endX = e.clientX + this.getXCorrection();
        this.endY = e.clientY + this.getYCorrection();
        let x4 = Math.max(this.startX, this.endX);
        let y3 = Math.min(this.startY, this.endY);
        let y4 = Math.max(this.startY, this.endY);
        let x3 = Math.min(this.startX, this.endX);
        this.height = y4 - y3;
        this.width = x4 - x3;
        this.setLabelValues();
        this.wrapper.css({ left: x3, top: y3, width: this.width, height: this.height });
        this.setInfo();
    };

    ChromeRuller.prototype.fix = function(e) {
        Global.window.off(event.drow + Global.dot + this.id);
    };

    ChromeRuller.prototype.checkForStay = function() {
        if (!this.forceStay) this.remove();
    };

    ChromeRuller.prototype.remove = function() {
        Global.window.off(event.create + Global.dot + this.id);
        Global.window.off(event.drow + Global.dot + this.id);
        Global.window.off(event.fix + Global.dot + this.id);
        Global.window.off(event.remove + Global.dot + this.id);
        Global.window.off(event.keydown + Global.dot + this.id);
        this.selection.off(event.mouseenter + Global.dot + this.id);
        this.selection.off(event.mouseleave + Global.dot + this.id);
        this.wrapper.remove();
        delete Global.rullerList[this.id];
    };

    ChromeRuller.prototype.bindPressListeners = function(event) {
        this.rotate(event);
    };

    ChromeRuller.prototype.rotate = function(event) {
        if (event.target.dataset.id != this.id) return;

        let rotateObj = null;

        if (event.keyCode == key.left) {
            rotateObj = _getRotateObject(this.selection.first()[0].style, false);
            this.selection.css('transform', rotateObj.css);
        } else if (event.keyCode == key.right) {
            rotateObj = _getRotateObject(this.selection.first()[0].style, true);
            this.selection.css('transform', rotateObj.css);
        }

        if (rotateObj) {
            let label = rotateObj.value % 360;
            this.rotateLabel.html(label);
            this.rotateLabel.css('transform', rotateObj.neg);

            if (label) this.wrapper.addClass(Ruller.rotated);
            else this.wrapper.removeClass(Ruller.rotated);
        }
    };

    ChromeRuller.prototype.toggleFocus = function(activate) {
        if (activate) {
            this.selection.focus();
            this.topLine.css('border-color', options.colorGridLineActive);
            this.rightLine.css('border-color', options.colorGridLineActive);
            this.bottomLine.css('border-color', options.colorGridLineActive);
            this.leftLine.css('border-color', options.colorGridLineActive);
        } else {
            this.selection.blur();
            this.topLine.css('border-color', options.colorGridLine);
            this.rightLine.css('border-color', options.colorGridLine);
            this.bottomLine.css('border-color', options.colorGridLine);
            this.leftLine.css('border-color', options.colorGridLine);
        }
    };

    function calculateMultiplier() {
        let pxInCm = screen.availWidth / (options.screenWidth || 38);
        let pxInIn = pxInCm / 0.393700787;
        let pxInPt = pxInIn / 72;
        let pxInPc = pxInPt * 12;

        switch (options.unit) {
            case 'in':
                unitMultiplier /= pxInIn;
                break;
            case 'pt':
                unitMultiplier /= pxInPt;
                break;
            case 'pc':
                unitMultiplier /= pxInPc;
                break;
        }
    };

    function convertUnit(unit, height) {
        let convertValue = 100;

        switch (options.unit) {
            case 'px':
                break;
            case '%':
                if (height)
                    convertValue = Math.max(document.documentElement.offsetHeight, window.innerHeight);
                else
                    convertValue = document.documentElement.clientWidth;
                break;
            case 'vw':
                convertValue = window.innerWidth;
                break;
            case 'vh':
                convertValue = window.innerHeight;
                break;
            case 'vw/vh':
                if (height)
                    convertValue = window.innerHeight;
                else
                    convertValue = window.innerWidth;
                break;
        }

        return Math.round(unit *= 100 / convertValue * unitMultiplier * 100) / 100;
    };

    function addFloatMenu() {
        Ruller.menu = $('<div/>', { class: Ruller.floatMenu }).appendTo(Ruller.overlay);
        var text = $('<label/>', { text: 'Theme' }).appendTo(Ruller.menu);

        ['midnight', 'before dawn', 'sunrise', 'morning', 'noon', 'sunfade', 'nightfall', 'dusk']
        .forEach((item) => $('<span/>', { class: item, text: item }).appendTo(Ruller.menu));

        menu.appendTo(Ruller.menu);
    };

    if (chrome.extension) {
        chrome.extension.onRequest.addListener(function(request) {
            if (!request) return;

            switch (request.action) {
                case BootLoader.run:
                    return init();
                case BootLoader.switchOn:
                    return init();
                case BootLoader.switchOff:
                    return unload(true);
                default:
                    return console.log(request);
            }
        });
    };


}(jQueryChromeRuller));