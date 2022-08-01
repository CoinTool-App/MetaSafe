/* eslint-disable no-undef */
function set(key, value) {
    return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => {
            resolve(value);
        });
    });
}

function get(key) {
    return new Promise((resolve) => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

export { set, get };
