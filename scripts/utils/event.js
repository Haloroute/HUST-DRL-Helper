const newTabNotice = chrome.i18n.getMessage('newTabNotice');
const notFoundQuizNotice = chrome.i18n.getMessage('notFoundQuizNotice');
const successfulLoadAnswerNotice = chrome.i18n.getMessage('successfulLoadAnswerNotice');
const failedLoadAnswerNotice = chrome.i18n.getMessage('failedLoadAnswerNotice');


const clickBadEvent = (url) => (event) => {
    console.log("Click bad event!");
    console.log("Web: ", url);
    alert(newTabNotice);
    chrome.tabs.create({ url: url });
    console.log("Successfully completed bad event!");
}

const clickGoodEventType1 = (answerJson) => async (event) => {    
    console.log("Click good event (type 1)!");
    console.log('Answer: ', answerJson);

    if (answerJson.length == 0) alert(notFoundQuizNotice);
    else {        
        let currentTab = await getCurrentTab(), counter = 0;
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/pages\/responsepage/i)) {

            let formsId = currentTab.url.slice(startUrl.length).split("&")[0];
            let storageId = "officeforms.answermap." + formsId;

            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: generateStorageKeyValuePair,
                args: []
            })

            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: replaceValueType1,
                args: [
                    storageId,
                    JSON.stringify(answerJson)
                ]
            }, result => {
                console.log(JSON.stringify(result));
                counter = result[0].result;
                if (counter > 0) {
                    chrome.tabs.reload();
                    alert(successfulLoadAnswerNotice);
                    console.log("Successfully completed good event (type 1)!");
                } else {
                    alert(failedLoadAnswerNotice);
                    console.log("Not found necessary key-value pairs (type 1)!");
                }
            });

        } else {
            alert(formsNotOpenedLabel);
            console.log('Wrong website (type 1)!');
        }
    }

}

const clickGoodEventType2 = (answerJson) => async (event) => {    
    console.log("Click good event (type 2)!");
    console.log('Answer: ', answerJson);

    if (answerJson.length == 0) alert(notFoundQuizNotice);
    else {
        let currentTab = await getCurrentTab();
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {

            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: replaceValueType2,
                args: [answerJson]
            }, () => {
                alert(successfulLoadAnswerNotice);
                console.log("Successfully completed good event (type 2)!");
            });

        } else {  
            alert(formsNotOpenedLabel);
            console.log('Wrong website (type 2)!');
        }
        
    }
}