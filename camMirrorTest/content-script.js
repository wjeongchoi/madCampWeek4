let videoElement = null;
let stream = null;

function startMirroring() {

    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(mediaStream) {
            stream = mediaStream;
            videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.play();

            // CSS 스타일 설정
            videoElement.style.position = 'fixed';
            videoElement.style.right = '0px';
            videoElement.style.top = '0px';
            videoElement.style.width = '200px'; // 크기 조절
            videoElement.style.zIndex = '1000'; // 다른 요소 위에 표시

            document.body.appendChild(videoElement);
        })
        .catch(function(err) {
            console.log('Error: ' + err);
        });
}

function stopMirroring() {
    if (videoElement) {
        if (stream) {
            let tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        videoElement.remove();
        videoElement = null;
        stream = null;
    }
}

// 메시지 리스너를 추가하여 팝업 또는 백그라운드 스크립트로부터 메시지를 받을 수 있게 함
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'start') {
        startMirroring();
    } else if (request.action === 'stop') {
        stopMirroring();
    }
});
