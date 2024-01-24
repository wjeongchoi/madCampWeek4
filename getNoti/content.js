chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type === "displayAlert") {
      // 여기에서 경고에 대한 처리를 합니다.
      console.log("Alert Type:", request.alertType);
      console.log("Title:", request.title);
      console.log("Message:", request.message);
  
      // 예: 웹 페이지에 경고 메시지를 표시하는 등의 작업을 수행할 수 있습니다.
    }
  });
  