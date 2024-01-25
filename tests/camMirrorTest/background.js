let isMirroring = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "getState") {
        sendResponse({ isMirroring: isMirroring });
    } else if (request.action === "setState") {
        isMirroring = request.state;
    }
});
