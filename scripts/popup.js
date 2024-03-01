document.addEventListener('DOMContentLoaded', function () {
    const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/main/answer.json?token=GHSAT0AAAAAACO6JYX6ABE7XV73OQ7ALVQGZPBQTSA";
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
            alert("2");
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                var url = currentTab.url;
                var answerMap = await fetch("https://script.google.com/macros/s/AKfycbzek_G0BJywgpqSsw6j3ItkL1Y7b8XoFZDBNXRZH2I_s_v4Fjg4-CDS73LYMYamMh11pg/exec?name=phapluat").then((t => t.json()));
                var Id = "officeforms.answermap\." + url.replace(startUrl, "");
                alert(Id);
                alert(answerMap);
                chrome.storage.local.set({ Id: answerMap});
            }
        });
    });
});