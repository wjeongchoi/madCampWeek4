// content.js
(function() {
    document.addEventListener('click', event => {
      const target = event.target;
  
      if (target.tagName.toLowerCase() === 'video') {
        togglePictureInPicture(target);
      } else if (target.tagName.toLowerCase() === 'canvas') {
        const video = document.createElement('video');
        video.srcObject = target.captureStream(60);
        video.style.display = 'none';
        document.body.appendChild(video);
        video.onloadedmetadata = () => {
          video.play();
          togglePictureInPicture(video);
        };
      }
    });
  
    function togglePictureInPicture(video) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        video.requestPictureInPicture().catch(error => {
          console.error('PiP Error:', error);
        });
      }
    }
  })();
  