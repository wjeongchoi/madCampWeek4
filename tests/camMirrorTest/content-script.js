let videoElement = null;
let stream = null;

function startMirroring() {
    chrome.storage.sync.get(['videoWidth', 'videoHeight'], function(items) {
        const videoWidth = items.videoWidth || 200;
        const videoHeight = items.videoHeight || 150;
    
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(mediaStream) {
            stream = mediaStream;

            // 컨테이너 생성
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.right = '0px';
            container.style.top = '0px';
            container.style.width = videoWidth; // 크기 조절
            container.style.height = videoHeight; // 비디오 높이와 동일하게 설정
            container.style.zIndex = '1000'; // 다른 요소 위에 표시

            // 비디오 요소 생성 및 설정
            videoElement = document.createElement('video');
            videoElement.srcObject = stream;
            videoElement.style.width = videoWidth;
            videoElement.style.height = videoHeight;
            videoElement.play();

            // 오버레이 레이어 생성
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.width = videoWidth;
            overlay.style.height = videoHeight;
            overlay.style.top = '0px';
            overlay.style.left = '0px';

            // 점 두 개 생성 및 스타일 설정
            const dot1 = document.createElement('div');
            const dot2 = document.createElement('div');
            [dot1, dot2].forEach(dot => {
                dot.style.width = '10px';
                dot.style.height = '10px';
                dot.style.backgroundColor = 'red';
                dot.style.borderRadius = '50%';
                dot.style.position = 'absolute';
            });

            // 점 위치 설정
            dot1.style.top = '25%';
            dot1.style.left = '25%';
            dot2.style.top = '25%';
            dot2.style.right = '25%';

            // 요소를 DOM에 추가
            overlay.appendChild(dot1);
            overlay.appendChild(dot2);
            container.appendChild(videoElement);
            container.appendChild(overlay);
            document.body.appendChild(container);
        })
        .catch(function(err) {
            console.log('Error: ' + err);
        });
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
