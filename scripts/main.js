﻿document.addEventListener('DOMContentLoaded', async function () {
    var cellContainer = document.getElementById('cellContainer');
    var checkUrlLabel = document.getElementById('checkUrlLabel');
    var checkUrlSpan = document.getElementById('checkUrlSpan');

    var answerJson = await fetchData(answerUrl);
    var quizCount = answerJson.length;
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentTab = tabs[0];
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
            checkUrlSpan.textContent = "Trang web này là Microsoft Forms";
        } else {
            checkUrlSpan.textContent = "Trang web này không phải là Microsoft Forms";
            document.body.style.backgroundColor = '#F5F5F5';
            checkUrlSpan.style.color = '#647c90';
        }

        for (var q = 0; q < quizCount; ++q) {
            console.log("Quiz: ", answerJson[q].name);
            /*var thisArgs = '', thisEventType;*/
            var eventJson = [];
            if (currentTab.url == answerJson[q].url) {
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
            addNewQuiz(answerJson[q].name, 'quiz' + q, eventJson);
        }
    });

});