async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert('Error fetching data: ', error, '. Check your network connection and try again!');
        return null;
    }
}

function generateStorageKeyValuePair() {
    // Lấy tất cả các phần tử input trong bảng câu hỏi
    const buttonList = document.querySelectorAll('div[data-automation-id="choiceItem"]')

    // Duyệt qua từng input
    try {
        if (buttonList.length !== 0) buttonList[0].querySelector("label").click();
        else console.log('Cannot find questions!');
    } catch (error) {
        console.log('Error generating data: ', error);
    }
    
    // buttonList.forEach(button => {
    //     // Chọn đáp án đầu tiên trong số chúng
    //     button.querySelector("label").click();
    //     break;
    // });
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
    return counter;
}

//function formatText(text) {
//    console.log(text);
//    return text.replace(/\s+/g, " ").replace(/“|”/g, '"').replace(/–/g, "-").normalize("NFC");
//}

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
}