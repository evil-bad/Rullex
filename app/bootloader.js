let Rullers = {};

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tabInfo) {
    chrome.pageAction.show(tabId);
});

chrome.tabs.onUpdated.addListener(
    function(tabId, changeInfo, tab) {
        if (changeInfo.status === "loading") {
            Rullers[tab.id] = new RullerLoader(tab);
        }
    }
);

chrome.pageAction.onClicked.addListener(function(tab) {
    Rullers[tab.id].run();
});

let RullerLoader = (function(tab) {
    this.enabled = false;
    this.loaded = false;
    this.tab = tab;
    this.icon = {
        active: { "38": 'images/icon_a.png' },
        inactive: { "38": 'images/icon.png' }
    };
});

RullerLoader.prototype.run = function() {
    let self = this;
    if (!self.loaded) {
        chrome.tabs.insertCSS(self.tab.id, { file: "/app/style.css" });
        chrome.tabs.executeScript(self.tab.id, { file: "/jQuery/jQuery.js" });
        chrome.tabs.executeScript(self.tab.id, { file: "/jQuery/jQuery-ui.js" });
        chrome.tabs.executeScript(self.tab.id, { file: "/utils/chrome-storage.js" });
        chrome.tabs.executeScript(self.tab.id, { file: "/app/script.js" }, function() {
            self.loaded = true;
            self.enabled = true;
            chrome.tabs.sendRequest(self.tab.id, {
                'action': 'run'
            });
        });
        chrome.pageAction.setIcon({ tabId: self.tab.id, path: self.icon.active });
    } else if (self.enabled) self.disable();
    else self.enable();
};

RullerLoader.prototype.enable = function() {
    let self = this;
    self.enabled = true;
    chrome.tabs.sendRequest(self.tab.id, {
        'action': 'switchOn'
    });
    chrome.pageAction.setIcon({ tabId: self.tab.id, path: self.icon.active });
};

RullerLoader.prototype.disable = function() {
    let self = this;
    self.enabled = false;
    chrome.tabs.sendRequest(self.tab.id, {
        'action': 'switchOff'
    });
    chrome.pageAction.setIcon({ tabId: self.tab.id, path: self.icon.inactive });
};

chrome.commands.onCommand.addListener(function(command, tab, a) {
    if (command === 'toggle') {
        chrome.tabs.getSelected(null, function(tab) {
            if (tab < 0 || !Rullers[tab.id]) return;
            Rullers[tab.id].run();
        });
    }
});