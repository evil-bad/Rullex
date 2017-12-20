'use strict';

(function($) {

    let Global = {
        documentHeight: 0,
        documentWidth: 0,
        body: 'body',
        window: window,
        rullerList: {}
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
    };

    let event = {
        create: 'mousedown.ruller',
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
        run();
        bindQuit();
    };

    function run() {
        Global.window.on(event.create, (e) => Global.rullerList[count] = new ChromeRuller(e, count++));
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


        Global.window.on(event.drow + this.count, this.drow.bind(this));
        Global.window.on(event.fix + this.count, this.fix.bind(this));
        Global.window.on(event.create + this.count, this.checkForStay.bind(this));
    };

    ChromeRuller.prototype.drow = function(e) {
        this.endX = e.clientX;
        this.endY = e.clientY;
        let x4 = Math.max(this.startX, this.endX);
        let y3 = Math.min(this.startY, this.endY);
        let y4 = Math.max(this.startY, this.endY);
        let x3 = Math.min(this.startX, this.endX);
        let height = y4 - y3;
        let width = x4 - x3;
        this.wrapper.css({ left: x3, top: y3, width: width, height: height });
        this.heightLabel.html(height);
        this.widthLabel.html(width);
    };

    ChromeRuller.prototype.fix = function(e) {
        Global.window.off(event.drow + this.count);
    };

    ChromeRuller.prototype.checkForStay = function() {
        if (!this.forceStay) this.remove();
    }

    ChromeRuller.prototype.remove = function() {
        Global.window.off(event.create + this.count);
        Global.window.off(event.drow + this.count);
        Global.window.off(event.fix + this.count);
        this.wrapper.remove();
        delete Global.rullerList[this.count];
    };

    $(init);
}(jQueryChromeRuller));