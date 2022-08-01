chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    sendResponse('ping');
    window.postMessage(request, "*")
});