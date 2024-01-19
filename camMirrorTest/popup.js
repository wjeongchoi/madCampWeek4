function updateUI(isMirroring) {
    if (isMirroring) {
        document.getElementById('start').disabled = true;
        document.getElementById('stop').disabled = false;
    } else {
        document.getElementById('start').disabled = false;
        document.getElementById('stop').disabled = true;
    }
}

// 팝업이 열릴 때 상태 확인
chrome.runtime.sendMessage({action: "getState"}, function(response) {
    updateUI(response.isMirroring);
});

document.getElementById('start').addEventListener('click', function() {
    // 웹캠 미러링 시작
    chrome.tabs.executeScript(null, {file: "content-script.js"});
    chrome.runtime.sendMessage({action: "setState", state: true});
    updateUI(true);
});

document.getElementById('stop').addEventListener('click', function() {
    // 현재 활성화된 탭에 'stop' 메시지를 보내어 웹캠 미러링을 중지
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {action: "stop"});
    });
    chrome.runtime.sendMessage({action: "setState", state: false});
    updateUI(false);
});

