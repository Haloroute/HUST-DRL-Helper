﻿const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/master/documents/answer.json";
const noticeUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/master/documents/notice.json";
const startUrl = "https://forms.office.com/pages/responsepage.aspx?id=";

const manifestData = chrome.runtime.getManifest();
const defaultLocale = manifestData.default_locale;
const currentLocale = manifestData.current_locale;

const cellContainer = document.getElementById('cellContainer');
const noticeContainer = document.getElementById('noticeContainer');

const infoButton = document.getElementById('infoButton');

const loadingLabel = chrome.i18n.getMessage('loadingLabel');
const formsOpenedLabel = chrome.i18n.getMessage('formsOpenedLabel');
const formsNotOpenedLabel = chrome.i18n.getMessage('formsNotOpenedLabel');
const noInternetLabel = chrome.i18n.getMessage('noInternetLabel');
const versionInfo = chrome.i18n.getMessage('versionInfo', manifestData.version);
const infoButtonContent = chrome.i18n.getMessage('infoButton');


function splitNotice(noticeData) { return noticeData.split(/\r\n|\r|\n/); }

function initialize(currentTab, answerJson, noticeJson) {    
    let quizCount = answerJson.length;  
    let noticeLocale = getCurrentLocale(Object.keys(noticeJson), defaultLocale, currentLocale);
    
    if (currentTab == null || !currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
        changeNotification(formsNotOpenedLabel, "#FF5733");
        console.log("Microsoft Forms website hasn't been opened yet");
    } else {
        changeNotification(formsOpenedLabel, "#4CAF50");
        console.log("Microsoft Forms website has already been opened");       
    }

    for (let q = 0; q < quizCount; ++q) {
        console.log("Quiz: ", JSON.stringify(answerJson[q]));
        
        let eventJson = [];
        if (currentTab != null && currentTab.url.toLowerCase().includes(answerJson[q].Url.toLowerCase())) {
            eventJson.push({ id: 1, args: answerJson[q].AnswerType1 });
            eventJson.push({ id: 2, args: answerJson[q].AnswerType2 });
        } else eventJson.push({ id: 0, args: answerJson[q].Url });
        
        let quizLocale = getCurrentLocale(Object.keys(answerJson[q].Metadata), defaultLocale, currentLocale);

        if (quizLocale != null) {
            cellContainer.appendChild(createQuizCell(answerJson[q].Metadata[quizLocale].Name, 
                answerJson[q].Metadata[quizLocale].Info, 'quiz' + q, eventJson));
            console.log("Successfully initialized quiz: ", answerJson[q].Metadata[quizLocale].Name);
        }
    }
    
    let noticeLineList = splitNotice(noticeJson[noticeLocale]); 
    for (let n = 0; n < noticeLineList.length; ++n) {
        let noticeLine = noticeLineList[n];
        console.log("Notice: " + noticeLine);
        noticeContainer.appendChild(createNoticeCell(noticeLine));
    }
    
}


document.getElementById('checkUrlSpan').textContent = loadingLabel;     
document.getElementById('infoButton').textContent = infoButtonContent;

document.addEventListener('DOMContentLoaded', async function () {
    let answerJson = await fetchData(answerUrl, 'json');
    let noticeJson = await fetchData(noticeUrl, 'json');

    if (answerJson == null) {
        changeNotification(noInternetLabel, "#666");
        alert('Error fetching data: ', error);
    }
    else {
        let currentTab = await getCurrentTab();        
        initialize(currentTab, answerJson, noticeJson);
    }
});

infoButton.addEventListener('click', function() { alert(versionInfo); });