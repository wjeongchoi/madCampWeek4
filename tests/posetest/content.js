// content.js

// 동적으로 외부 스크립트 로드
function loadExternalScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });
}

// MediaPipe Pose 스크립트 로드 후 실행
async function loadAndRunPoseScript() {
    try {
        // Pose 스크립트 로드
        await loadExternalScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose");

        // Pose 스크립트 로드 후에 Pose 클래스를 사용합니다.
        const pose = new Pose({  // Pose 클래스 이름은 스크립트에 따라 다를 수 있습니다.
            locateFile: (file) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
            }
        });


        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: false,
            smoothSegmentation: false,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        // 웹캠 화면 및 랜드마크 표시 영역 생성 및 조작
        const videoElement = document.createElement('video');
        const canvasElement = document.createElement('canvas');

        videoElement.id = "video";
        videoElement.width = 320;
        videoElement.height = 240;
        videoElement.autoplay = true;
        videoElement.muted = true;

        canvasElement.id = "canvas";
        canvasElement.width = 320;
        canvasElement.height = 240;

        // 웹캠 화면과 랜드마크 표시 영역을 현재 페이지에 추가
        document.body.appendChild(videoElement);
        document.body.appendChild(canvasElement);

        // 결과 처리 함수
        function onResults(results) {
            const canvasCtx = canvasElement.getContext('2d');
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

            // 랜드마크 그리기
            if (results.poseLandmarks) {
                for (const landmark of results.poseLandmarks) {
                    // 여기에서 원하는 랜드마크 ID에 대한 로직을 구현하세요.
                    drawLandmark(canvasCtx, landmark);
                }
            }

            canvasCtx.restore();
        }

        function drawLandmark(ctx, landmark) {
            const x = landmark.x * canvasElement.width;
            const y = landmark.y * canvasElement.height;

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }

        // 웹캠에서 포즈 감지
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await pose.send({ image: videoElement });
            },
            width: 320,
            height: 240
        });
        camera.start();

    } catch (error) {
        console.error('MediaPipe Pose 스크립트 로드 에러:', error);
    }
}

// loadAndRunPoseScript 함수 실행
loadAndRunPoseScript();
