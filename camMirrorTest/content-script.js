navigator.mediaDevices.getUserMedia({ video: true })
  .then(function(stream) {
    var video = document.createElement('video');
    video.srcObject = stream;
    video.play();

    // CSS 스타일 설정
    video.style.position = 'fixed';
    video.style.right = '0px';
    video.style.top = '0px';
    video.style.width = '200px';  // 크기 조절
    video.style.zIndex = '1000';  // 다른 요소 위에 표시

    document.body.appendChild(video);
  })
  .catch(function(err) {
    console.log('Error: ' + err);
  });