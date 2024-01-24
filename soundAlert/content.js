// content.js
(function() {
    const alertSound = new Audio(chrome.runtime.getURL('alert-sound.mp3'));
  
    const toastElement = document.getElementById('toast');
    if (toastElement) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.addedNodes.length || mutation.removedNodes.length) {
            const isToastVisible = toastElement.style.display === 'block';
            if (isToastVisible) {
              alertSound.play();
            }
          }
        });
      });
  
      observer.observe(toastElement, { childList: true, subtree: true });
    }
  })();
  