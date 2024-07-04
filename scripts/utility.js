async function fetchData(url, type='json') {
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) {
            throw new Error('Network response was not ok! Check your network connection and try again!');
        }
        var data;
        if (type == 'json') {
            data = await response.json();
            console.log("Successfully received JSON data!");
        } else if (type == 'text') {
            data = await response.text();
            console.log("Successfully received TEXT data!");
        }
        return data;
    } catch (error) {
        console.log('Error fetching data from: ', url);
        console.log('with error: ', error);
        return null;
    }
}

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
    var counter = 0, localLength = localStorage.length, sessionLength = sessionStorage.length;
    for (var p = 0; p < localLength; p++) {
        var thisKey = localStorage.key(p);
        console.log("Local Storage: " + thisKey);
        if (thisKey.startsWith(startId)) {
            localStorage.setItem(thisKey, newValue);
            console.log("Local Storage: " + thisKey + " with new value: " + newValue);
            counter++;
        }
    }
    for (var p = 0; p < sessionLength; p++) {
        var thisKey = sessionStorage.key(p);
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
            a = answer.find((answer => formatText(answer.question) === o))?.answer;
        if (a) {
            e.querySelectorAll('div[data-automation-id="choiceItem"]').forEach((answer => {
                const e = answer.querySelector("span.text-format-content").textContent.trim();
                a.includes(formatText(e)) && answer.querySelector("label").click();
            }))
        }
    }))
    console.log("Successfully replaced value (type 2)");
}