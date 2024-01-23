// popup.js
document.getElementById('enable-pip').addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'content.js'}
      );
    });
  });
  