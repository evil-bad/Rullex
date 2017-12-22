chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.insertCSS(null, { file: "resize.css" });
    chrome.tabs.insertCSS(null, { file: "style.css" });
    chrome.tabs.executeScript(null, { file: "jQuery.js" });
    chrome.tabs.executeScript(null, { file: "jQuery-ui.js" });
    chrome.tabs.executeScript(null, { file: "script.js" });
});


// chrome.browserAction.onClicked.addListener(function(tab) {
//     chrome.storage.sync.get('state', function(data) {
//         alert('hello' + data.state);
//         if (data.state === 'on') {
// 			chrome.storage.sync.set({ state: 'off' });

//             chrome.tabs.getSelected(null, function(tab) {
//                 chrome.tabs.remove(tab.id);
//             });

//         } else {
//             chrome.storage.sync.set({ state: 'on' });
//             chrome.tabs.insertCSS(null, { file: "resize.css" });
//             chrome.tabs.insertCSS(null, { file: "style.css.css" });
//             chrome.tabs.executeScript(null, { file: "jQuery.js" });
//             chrome.tabs.executeScript(null, { file: "jQuery-ui.js" });
//             chrome.tabs.executeScript(null, { file: "script.js" });
//         }
//     });
// });