document.addEventListener('DOMContentLoaded', function () {
    var checkUrlLabel = document.getElementById('checkUrlLabel');
    var checkUrlSpan = document.getElementById('checkUrlSpan');
    var quizLabel = document.getElementById('quizLabel');
    var quizSpan = document.getElementById('quizSpan');
    var loadButton = document.getElementById('loadButton');
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
            checkUrlSpan.textContent = "Trang web này là Microsoft Forms";
        } else {
            checkUrlSpan.textContent = "Trang web này không phải là Microsoft Forms";
            loadButton.disabled = true;
            loadButton.style.background = '#d3d3d3';
            loadButton.style.cursor = 'not-allowed';
            checkUrlSpan.style.color = '#d3d3d3';
        };
    });

    //showUrlButton.addEventListener('click', function () {
    //    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //        var currentTab = tabs[0];
    //        var url = currentTab.url;
    //        currentUrlSpan.textContent = url;
    //        urlLabel.style.display = 'block';
    //    });
    //});
});