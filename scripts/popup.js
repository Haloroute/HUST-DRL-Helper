document.addEventListener('DOMContentLoaded', function () {
    var showUrlButton = document.getElementById('showUrlButton');
    var reloadUrlButton = document.getElementById('reloadButton');
    var urlLabel = document.getElementById('urlLabel');
    var currentUrlSpan = document.getElementById('currentUrl');
    var checkUrlLabel = document.getElementById('checkUrlLabel');
    var formUrlSpan = document.getElementById('formUrl');
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
            formUrlSpan.textContent = "Microsoft Forms";
            showUrlButton.disabled = false;
        } else {
            formUrlSpan.textContent = "not Microsoft Forms";
            showUrlButton.disabled = true;
        };
    });

    showUrlButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            var url = currentTab.url;
            currentUrlSpan.textContent = url;
            urlLabel.style.display = 'block';
        });
    });

    reloadUrlButton.addEventListener('click', function () {
        chrome.tabs.reload();
    });
});