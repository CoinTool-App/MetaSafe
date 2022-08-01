/* eslint-disable no-undef */
class ChromeMessage {
    constructor(msg, params) {
        this.msg = msg;
        this.params = params;
    }
}
function getFuncParameters(func) {
    if (typeof func === 'function') {
        const match = /[^(]+\(([^)]*)?\)/gm.exec(
            Function.prototype.toString.call(func)
        );
        if (match[1]) {
            const args = match[1].replace(/[^,\w]*/g, '').split(',');
            return args.length;
        }
    }

    return 0;
}

const listeners = {};

function dispatchEvent(request, sendResponse) {
    const { msg } = request;
    let callBack;

    Object.keys(listeners).forEach((key) => {
        if (key === msg) {
            callBack = listeners[key];
        }
    });

    if (callBack) {
        const paramSize = getFuncParameters(callBack);

        callBack(request, sendResponse);

        return paramSize === 2;
    }

    return false;
}
try {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        const success = dispatchEvent(request, sendResponse);

        if (!success) {
            sendResponse(new ChromeMessage('Default Response'));
        }

        return true;
    });
} catch (error) {

}

class ContentClient {
    listen(msg, callBack) {
        console.log('list');
        listeners[msg] = callBack;
    }

    seedMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (res) => {
                console.log('message');
                resolve(res);
            });
        });
    }
}

class ProxyClient {
    listen(msg, callBack) {
        listeners[msg] = callBack;
    }

    seedMessage(message) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage(message, (res) => {
                resolve(res);
            });
        });
    }
}

class BackgroundClient {
    listen(msg, callBack) {
        listeners[msg] = callBack;
    }

    seedMessage(message) {
        return new Promise((resolve) => {
            chrome.tabs.query({ active: true }, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
                    resolve(response);
                });
            });
        });
    }
}

const contentClient = new ContentClient();
const backgroundClient = new BackgroundClient();
const proxyClient = new ProxyClient();

export {
    contentClient, backgroundClient, proxyClient, ChromeMessage
};
