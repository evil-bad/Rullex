;
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
        keypress: 'keypress.ruller',
        resize: 'resize.ruller'
    };

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

        Ruller.overlay = $('<div/>', { class: Ruller.overlaySelector }).appendTo(Global.body);

        setOverlaySize();
        hookMouseEvents();
        run();
        bindQuit();
    };

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
    };


    function run() {
        Global.window.on(event.create, (cutommEvent, originalEvent) => Global.rullerList[count] = new ChromeRuller(originalEvent, count++));
        Global.window.on(event.resize, setOverlaySize);
    };

    function setOverlaySize() {
        Global.documentHeight = $(document).height();
        Global.documentWidth = $(document).width();
        Ruller.overlay.css({ width: Global.documentWidth, height: Global.documentHeight });
    };

    function bindQuit() {
        Global.window.on(event.keypress, function(e) {
            if (e.keyCode === 17) unload();
        });
    };

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
        }
    };

    let ChromeRuller = function(e, id) {
        this.id = id;
        this.startX = e.clientX + this.getXCorrection();
        this.startY = e.clientY + this.getYCorrection();
        this.endX = 0;
        this.endY = 0;
        this.forceStay = e.ctrlKey;

        this.wrapper = $('<div/>', { class: Ruller.wrapper }).appendTo(Ruller.overlay);
        this.selection = $('<div/>', { class: Ruller.main, 'data-id': this.id }).appendTo(this.wrapper);
        this.heightLabel = $('<span/>', { class: Ruller.height }).appendTo(this.wrapper);
        this.widthLabel = $('<span/>', { class: Ruller.width }).appendTo(this.wrapper);

        this.topLine = $('<span/>', { class: Ruller.topLine }).appendTo(this.wrapper).css({ width: 2 * Global.documentWidth });
        this.rightLine = $('<span/>', { class: Ruller.rightLine }).appendTo(this.wrapper).css({ height: 2 * Global.documentHeight });
        this.bottomLine = $('<span/>', { class: Ruller.bottomLine }).appendTo(this.wrapper).css({ width: 2 * Global.documentWidth });
        this.leftLine = $('<span/>', { class: Ruller.leftLine }).appendTo(this.wrapper).css({ height: 2 * Global.documentHeight });

        this.wrapper.draggable();
        this.wrapper.resizable();

        this.resize();

        Global.window.on(event.drow + Global.dot + this.id, this.drow.bind(this));
        Global.window.on(event.fix + Global.dot + this.id, this.fix.bind(this));
        Global.window.on(event.create + Global.dot + this.id, this.checkForStay.bind(this));
        Global.window.on(event.remove + Global.dot + this.id, this.remove.bind(this));
    };

    ChromeRuller.prototype.getXCorrection = function() {
        return (Global.document.width() - Global.window.width() + Global.html.scrollLeft());
    };

    ChromeRuller.prototype.getYCorrection = function() {
        return Global.html.scrollTop();
    };

    ChromeRuller.prototype.resize = function(e) {
        let self = this;
        this.wrapper.resize(e => self.setLabelValues(e));
    };

    ChromeRuller.prototype.setLabelValues = function(e) {
        this.heightLabel.html(this.wrapper.height());
        this.widthLabel.html(this.wrapper.width());
    };

    ChromeRuller.prototype.drow = function(e) {
        this.endX = e.clientX + this.getXCorrection();
        this.endY = e.clientY + this.getYCorrection();
        let x4 = Math.max(this.startX, this.endX);
        let y3 = Math.min(this.startY, this.endY);
        let y4 = Math.max(this.startY, this.endY);
        let x3 = Math.min(this.startX, this.endX);
        let height = y4 - y3;
        let width = x4 - x3;
        this.heightLabel.html(height);
        this.widthLabel.html(width);
        this.wrapper.css({ left: x3, top: y3, width: width, height: height });
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
        this.wrapper.remove();
        delete Global.rullerList[this.id];
    };

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

}(jQueryChromeRuller));