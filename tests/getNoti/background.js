chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "sendAlert") {
      // 메시지를 content.js로 전달합니다.
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: "displayAlert",
          alertType: request.alertType,
          title: request.title,
          message: request.message
        });
      });
    }
  });
  