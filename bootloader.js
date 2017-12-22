let enabled = false;
let loaded = false;

chrome.browserAction.onClicked.addListener(function(tab) {
    if (!loaded) {
        chrome.tabs.insertCSS(null, { file: "resize.css" });
        chrome.tabs.insertCSS(null, { file: "style.css" });
        chrome.tabs.executeScript(null, { file: "jQuery.js" });
        chrome.tabs.executeScript(null, { file: "jQuery-ui.js" });
        chrome.tabs.executeScript(null, { file: "script.js" }, function() {
            loaded = true;
            enabled = true;
            chrome.tabs.sendRequest(tab.id, {
                'action': 'run'
            });
        });
    } else if (enabled) {
        chrome.tabs.sendRequest(tab.id, {
            'action': 'switchOff'
        });
        enabled = false;
    } else {
        chrome.tabs.sendRequest(tab.id, {
            'action': 'switchOn'
        });
        enabled = true;
    }
});