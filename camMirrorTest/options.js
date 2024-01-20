// 저장된 설정 불러오기
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.sync.get(['videoWidth', 'videoHeight'], function(items) {
        document.getElementById('videoWidth').value = items.videoWidth || 200;
        document.getElementById('videoHeight').value = items.videoHeight || 150;
    });
});

// 설정 저장하기
document.getElementById('settings').addEventListener('submit', function(e) {
    e.preventDefault();
    var width = document.getElementById('videoWidth').value;
    var height = document.getElementById('videoHeight').value;
    chrome.storage.sync.set({'videoWidth': width, 'videoHeight': height}, function() {
        console.log('Settings saved');
    });
});
