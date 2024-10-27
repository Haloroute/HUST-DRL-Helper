function generateStorageKeyValuePair() {
    // Lấy tất cả các phần tử input trong bảng câu hỏi
    const buttonList = document.querySelectorAll('div[data-automation-id="choiceItem"]')

    // Duyệt qua từng input
    try {
        if (buttonList.length !== 0) {
            buttonList[0].querySelector("label").click();
            console.log('Successfully generated key-value pair!');
        }
        else console.log('Cannot find questions!');
    } catch (error) {
        console.log('Error generating key-value pairs: ', error);
    }
    
}

function replaceValueType1(startId, newValue) {
    let counter = 0, localLength = localStorage.length, sessionLength = sessionStorage.length;
    for (let p = 0; p < localLength; p++) {
        let thisKey = localStorage.key(p);
        console.log("Local Storage: " + thisKey);
        if (thisKey.startsWith(startId)) {
            localStorage.setItem(thisKey, newValue);
            console.log("Local Storage: " + thisKey + " with new value: " + newValue);
            counter++;
        }
    }
    for (let p = 0; p < sessionLength; p++) {
        let thisKey = sessionStorage.key(p);
        console.log("Session Storage: " + thisKey);
        if (thisKey.startsWith(startId)) {
            sessionStorage.setItem(thisKey, newValue);
            console.log("Session Storage: " + thisKey + " with new value: " + newValue);
            counter++;
        }
    }
    console.log("Successfully replaced value (type 1)");
    return counter;
}


function replaceValueType2(answer) {
    const formatText = t => t.replace(/\s+/g, " ").replace(/“|”/g, '"').replace(/–/g, "-").normalize("NFC");
    document.querySelectorAll('div[data-automation-id="questionItem"]').forEach((e => {
        const o = formatText(e.querySelector("span.text-format-content").textContent).trim(),
            a = answer.find((answer => formatText(answer.Question) === o))?.Answer;
        if (a) {
            e.querySelectorAll('div[data-automation-id="choiceItem"]').forEach((answer => {
                const e = answer.querySelector("span.text-format-content").textContent.trim();
                a.includes(formatText(e)) && answer.querySelector("label").click();
            }))
        }
    }))
    console.log("Successfully replaced value (type 2)");
}