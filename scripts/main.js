﻿var manifestData = chrome.runtime.getManifest();
var infoButton = document.getElementById('infoButton');
var checkUrlSpan = document.getElementById('checkUrlSpan');
var noticeSpan = document.getElementById('noticeSpan');
var cellContainer = document.getElementById('cellContainer');


function initialize(currentTab, answerJson) {    
    var quizCount = answerJson.length;  

    if (currentTab == undefined || !currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
        changeNotification("Bạn chưa mở Microsoft Forms", "#FF5733");
        console.log("Microsoft Forms website hasn't been opened yet");
    } else {
        changeNotification("Bạn đã mở Microsoft Forms", "#4CAF50");
        console.log("Microsoft Forms website has already been opened");       
    }

    for (var q = 0; q < quizCount; ++q) {
        console.log("Quiz: ", JSON.stringify(answerJson[q]));
        
        var eventJson = [];
        if (currentTab.url.toLowerCase().includes(answerJson[q].Url.toLowerCase())) {
            eventJson.push({ id: 1, args: answerJson[q].AnswerType1 });
            eventJson.push({ id: 2, args: answerJson[q].AnswerType2 });
        }
        else eventJson.push({ id: 0, args: answerJson[q].Url });
        
        cellContainer.appendChild(createQuizCell(answerJson[q].Name, answerJson[q].Info, 'quiz' + q, eventJson));
        console.log("Successfully initialized quiz: ", answerJson[q].Name);
    }
}


document.addEventListener('DOMContentLoaded', async function () {
    var answerJson = await fetchData(answerUrl, 'json');
    var noticeText = await fetchData(noticeUrl, 'text');

    if (answerJson == null) {
        changeNotification("Không có kết nối internet", "#666");
        alert('Error fetching data: ', error);
    }
    else {
        noticeSpan.textContent = noticeText;          
        let currentTab = await getCurrentTab();
        
        initialize(currentTab, answerJson);

    }
});

infoButton.addEventListener('click', function() {
    alert('Phiên bản: ' + manifestData.version + '\n\nLà một phần mềm của Nguyễn Quang Tuyến và "Sinh viên Vô danh".\nNguồn ảnh: flaticon.com.')
});