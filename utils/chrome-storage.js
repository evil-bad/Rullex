var ChromeStorage = {
    restore: function(cb) {
        chrome.storage.sync.get(['CROption'], function(items) {
            cb(items.CROption);
        });
    },

    save: function(option, cb) {
        chrome.storage.sync.set({
            CROption: option
        }, function() {
            if (cb) cb();
        });
    },
    remove: function() {
        chrome.storage.sync.remove('CROption');
    }
};