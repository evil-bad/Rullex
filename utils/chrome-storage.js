class ChromeStorage {
    static restore(cb) {
        chrome.storage.sync.get(['CROption'], (items) => {
            if (items && items.theme === 'custom')
                cb(item.CROption.custom);
            else
                cb(items.CROption);
        });
    }

    static save(option, cb) {
        chrome.storage.sync.set({
            CROption: option
        }, function() {
            if (cb) cb();
        });
    }

    static saveVersion(version) {
        chrome.storage.sync.set({
            CRVersion: version
        });
    }

    static getVersion(cb) {
        chrome.storage.sync.get(['CRVersion'], (version) => {
            cb(version.CRVersion);
        });
    }

    static remove() {
        chrome.storage.sync.remove('CROption');
        chrome.storage.sync.remove('CRVersion');
    }
}