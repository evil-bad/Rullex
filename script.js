'use strict';

(function($) {

    let Global = {
        documentHeight: 0,
        documentWidth: 0,
        body: 'body',
        window: window,
        rullerList: {},
        dot: '.'
    };

    let Ruller = {
        overlay: 'chrome-ruller-overlay',
        wrapper: 'wrapper',
        main: 'ruller',
        width: 'value width',
        height: 'value height',
        topLine: 'line top',
        rightLine: 'line right',
        bottomLine: 'line bottom',
        leftLine: 'line left',
        resizable: 'resizable'
    };

    let event = {
        mousedown: 'mousedown.ruller',
        create: 'createruller',
        remove: 'removeruller',
        drow: 'mousemove.ruller',
        fix: 'mouseup.ruller',
        keypress: 'keypress'
    }

    let count = 0;

    function init() {
        Global.body = $(Global.body);
        Global.window = $(Global.window);
        Global.documentWidth = $(document).width();
        Global.documentHeight = $(document).height();

        Ruller.overlay = $('<div/>', { class: Ruller.overlay }).appendTo(Global.body).css({ width: Global.documentWidth, height: Global.documentHeight });

        hookMouseEvents();
        run();
        bindQuit();
    };

    function hookMouseEvents() {
        Global.window.on(event.mousedown, function(e) {
            let isRuller = ((e.target.className === Ruller.main) || (e.target.className.indexOf(Ruller.resizable) > -1));
            let isLeftBtn = e.which === 1;
            let isRightBtn = e.which === 3;

            if (isRuller) {
                if (isLeftBtn) return;
                else if (isRightBtn) Global.window.trigger(event.delete, [e]);
                else return;
            } else {
                if (isLeftBtn) Global.window.trigger(event.create, [e]);
                else return;
            }
        });
    };


    function run() {
        Global.window.on(event.create, (cutommEvent, originalEvent) => Global.rullerList[count] = new ChromeRuller(originalEvent, count++));
    };

    function bindQuit() {
        Global.window.on(event.keypress, function(e) {
            if (e.keyCode == 17) {
                for (const key in Global.rullerList) {
                    if (Global.rullerList.hasOwnProperty(key)) Global.rullerList[key].remove();
                }
            }
        });
    }


    let ChromeRuller = function(e, count) {
        this.count = count;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.endX = 0;
        this.endY = 0;
        this.forceStay = e.ctrlKey;

        this.wrapper = $('<div/>', { class: Ruller.wrapper }).appendTo(Ruller.overlay);
        this.selection = $('<div/>', { class: Ruller.main }).appendTo(this.wrapper);
        this.heightLabel = $('<span/>', { class: Ruller.height }).appendTo(this.wrapper);
        this.widthLabel = $('<span/>', { class: Ruller.width }).appendTo(this.wrapper);

        this.topLine = $('<span/>', { class: Ruller.topLine }).appendTo(this.wrapper).css({ width: 2 * Global.documentWidth });
        this.rightLine = $('<span/>', { class: Ruller.rightLine }).appendTo(this.wrapper).css({ height: 2 * Global.documentHeight });
        this.bottomLine = $('<span/>', { class: Ruller.bottomLine }).appendTo(this.wrapper).css({ width: 2 * Global.documentWidth });
        this.leftLine = $('<span/>', { class: Ruller.leftLine }).appendTo(this.wrapper).css({ height: 2 * Global.documentHeight });

        this.wrapper.draggable();
        this.wrapper.resizable();

        this.resize();

        Global.window.on(event.drow + Global.dot + this.count, this.drow.bind(this));
        Global.window.on(event.fix + Global.dot + this.count, this.fix.bind(this));
        Global.window.on(event.create + Global.dot + this.count, this.checkForStay.bind(this));
    };

    ChromeRuller.prototype.resize = function(e) {
        let self = this;
        this.wrapper.resize(e => self.drow(e, true));
    };

    ChromeRuller.prototype.drow = function(e, resize) {
        this.endX = e.clientX;
        this.endY = e.clientY;
        let x4 = Math.max(this.startX, this.endX);
        let y3 = Math.min(this.startY, this.endY);
        let y4 = Math.max(this.startY, this.endY);
        let x3 = Math.min(this.startX, this.endX);
        let height = y4 - y3;
        let width = x4 - x3;
        this.heightLabel.html(height);
        this.widthLabel.html(width);
        if (!resize) this.wrapper.css({ left: x3, top: y3, width: width, height: height });
    };

    ChromeRuller.prototype.fix = function(e) {
        Global.window.off(event.drow + Global.dot + this.count);
    };

    ChromeRuller.prototype.checkForStay = function() {
        if (!this.forceStay) this.remove();
    }

    ChromeRuller.prototype.remove = function() {
        Global.window.off(event.create + Global.dot + this.count);
        Global.window.off(event.drow + Global.dot + this.count);
        Global.window.off(event.fix + Global.dot + this.count);
        this.wrapper.remove();
        delete Global.rullerList[this.count];
    };

    $(init);
}(jQueryChromeRuller));