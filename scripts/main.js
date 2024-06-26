﻿var manifestData = chrome.runtime.getManifest();
var infoButton = document.getElementById('infoButton');
var checkUrlSpan = document.getElementById('checkUrlSpan');
var noticeSpan = document.getElementById('noticeSpan');

document.addEventListener('DOMContentLoaded', async function () {
    var answerJson = await fetchData(answerUrl, 'json');
    var noticeText = await fetchData(noticeUrl, 'text');
    var quizCount = answerJson.length;    
    noticeSpan.textContent = noticeText;

    if (answerJson == null) {
        checkUrlSpan.textContent = "Không có kết nối internet!";
    }
    else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                checkUrlSpan.textContent = "Bạn đã mở Microsoft Forms";
                checkUrlSpan.style.color = '#4CAF50';
            } else {
                checkUrlSpan.textContent = "Bạn chưa mở Microsoft Forms";
                checkUrlSpan.style.color = '#FF5733';
            }
    
            for (var q = 0; q < quizCount; ++q) {
                console.log("Quiz: ", answerJson[q].name);
                /*var thisArgs = '', thisEventType;*/
                var eventJson = [];
                if (currentTab.url.includes(answerJson[q].url)) {
                    /*var eventTypeArray = [1, 2];*/
                    eventJson.push({ id: 1, args: answerJson[q].answerType1 })
                    eventJson.push({ id: 2, args: answerJson[q].answerType2 })
                    /*addNewQuiz(answerJson[q].name, 'quiz' + q, eventJson);*/
                    /*addNewQuiz(answerJson[q].name, 'quiz' + q, answerJson[q].answerType1, 2);*/
                }
                else {
                    eventJson.push({ id: 0, args: answerJson[q].url })
                    //addNewQuiz(answerJson[q].name, 'quiz' + q, answerJson[q].url, [0]);
                }
                addNewQuiz(answerJson[q].name, answerJson[q].info, 'quiz' + q, eventJson);
            }
        });
    }
});

infoButton.addEventListener('click', function() {
    alert('Phiên bản: ' + manifestData.version + '\n\nLà một phần mềm của Nguyễn Quang Tuyến và "Sinh viên Vô danh".\nNguồn ảnh: flaticon.com.')
});