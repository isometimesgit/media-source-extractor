"use strict";

((browser) => {

    const getStore = Util.promisfy(browser.storage.local.get, browser.storage.local);
    const saveOptions = () => {
        browser.storage.local.set({
            whitelist: Util.split(document.querySelector("#whitelist").value),
            extensions: Util.split(document.querySelector("#extensions").value),
            ignore: document.querySelector("#ignore").checked,
            closetab: document.querySelector("#closetab").checked,
            disable: document.querySelector("#disable").checked
        });
    }
    const restoreOptions = async () => {
        const settings = await getStore(defaultSettings);
        document.querySelector('#whitelist').value = Util.join(settings.whitelist);
        document.querySelector('#extensions').value = Util.join(settings.extensions);
        document.querySelector("#ignore").checked = settings.ignore;
        document.querySelector("#closetab").checked = settings.closetab;
        document.querySelector("#disable").checked = settings.disable;
    }
    document.addEventListener('DOMContentLoaded', () => {
        restoreOptions();
        Array.from(document.querySelectorAll("input,textarea")).forEach(i => i.onchange = saveOptions);
    });

})(chrome || browser)
