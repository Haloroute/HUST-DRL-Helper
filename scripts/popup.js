document.addEventListener('DOMContentLoaded', function () {
    const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/main/answer.json?token=GHSAT0AAAAAACO6JYX7BRG2XVSBB4II7JNMZPBPPXQ";
    const startUrl = "https://forms.office.com/Pages/ResponsePage.aspx?id=";
    var checkUrlLabel = document.getElementById('checkUrlLabel');
    var checkUrlSpan = document.getElementById('checkUrlSpan');
    var quizLabel = document.getElementById('quizLabel');
    var quizSpan = document.getElementById('quizSpan');
    var loadButton = document.getElementById('loadButton');

    quizSpan.textContent = "Test";
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
            quizSpan.style.color = '#d3d3d3';
        };
    });

    loadButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                const answerMap = await fetch(answerUrl).then(answerMap => answerMap.text());
                var url = currentTab.url;
                var Id = url.replace(startUrl, "");
                localStorage.setItem("officeforms.answermap." + Id) = answerMap;
            }
        });
    });
});