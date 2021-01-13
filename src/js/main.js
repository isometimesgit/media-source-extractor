"use strict";

(async (browser) => {

    let settings;
    const getStore = Util.promisfy(browser.storage.local.get, browser.storage.local);
    const getTabs = Util.promisfy(browser.tabs.query, browser.tabs);
    const setIcon = settings => {
        browser.browserAction.setIcon({
            path: {
                // 16: settings.disable ? "/assets/icon/icon-dark-x16.png" : "/assets/icon/icon-on-x16.png",
                // 48: settings.disable ? "/assets/icon/icon-dark-x48.png" : "/assets/icon/icon-on-x48.png",
                // 128: settings.disable ? "/assets/icon/icon-dark-x128.png" : "/assets/icon/icon-on-x128.png"
                128: settings.disable ? "/assets/icon-128-dark.png" : "/assets/icon-128.png"
            }
        });
    }
    const copyToClipboard = (text) => {
        if (navigator.vendor === 'Google Inc.') {
            // see https://bugs.chromium.org/p/chromium/issues/detail?id=874848
            const node = document.createElement("textarea");
            document.body.append(node);
            node.value = text;
            node.select();
            document.execCommand("copy");
            node.remove();
        } else {
            navigator.clipboard.writeText(text);
        }
    }
    // handlers
    const onRequestHandler = async (request) => {
        // check if disabled
        if (settings.disable) {
            return { cancel: false };
        }
        // check if domain is valid
        if (!settings.ignore &&
            !settings.whitelist.includes(Util.getHostFromUrl(request.initiator || request.originUrl))) {
            return { cancel: false };
        }
        // check if extension is valid
        if (!settings.extensions.includes(Util.getExtensionFromUrl(request.url))) {
            return { cancel: false };
        }
        // copy url to clipboard
        copyToClipboard(request.url);
        // remove existing tab
        if (settings.closetab && request.tabId > 0) {
            const tabs = await getTabs({ currentWindow: true });
            if (tabs.length > 1) {
                browser.tabs.remove(request.tabId);
            }
        }
        return { cancel: true };
    }
    const onChangedHandler = async (changes, area) => {
        settings = await getStore(defaultSettings);
        setIcon(settings);
    };
    // register handlers
    settings = await getStore(defaultSettings);
    setIcon(settings);
    browser.storage.onChanged.addListener(onChangedHandler);
    browser.webRequest.onBeforeRequest.addListener(onRequestHandler, {
        urls: ["<all_urls>"]
    }, ["blocking"]);

})(chrome || browser)