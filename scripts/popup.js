//#region Executor
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        alert.error('Error fetching data: ', error, '. Check your network connection and try again!');
        return null;
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
                a.includes(formatText(e)) && answer.querySelector("label").click()
            }))
        }
    }))
}

//#endregion

//#region Designer
function addNewQuiz(name, id, eventJson) {
    const cellContainer = document.getElementById('cellContainer');

    const thisCell = document.createElement('div');
    thisCell.classList.add('cell');
    thisCell.id = id;

    const thisLabel = document.createElement('p');
    thisLabel.id = "quizLabel";
    const thisSpan = document.createElement('span');
    thisSpan.id = "quizSpan";
    thisSpan.textContent = name;

    thisLabel.appendChild(document.createTextNode('Bài thi: '));
    thisLabel.appendChild(thisSpan);

    thisCell.appendChild(thisLabel);

    eventJson.forEach(function (event) {
        const thisButton = document.createElement('button');

        if (event.id == 0) {
            thisButton.textContent = "Mở trang web";
            thisButton.style.background = '#d3d3d3';

            const thisEvent = clickBadEvent(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == 1) {
            thisButton.textContent = "Tải đáp án (cách 1)";

            const thisEvent = clickGoodEventType1(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == 2) {
            thisButton.textContent = "Tải đáp án (cách 2)";

            const thisEvent = clickGoodEventType2(event.args);
            thisButton.addEventListener('click', thisEvent);
        } else if (event.id == -1) {
            thisButton.textContent = "Không thể tải đáp án";
            thisButton.disabled = true;
            thisButton.style.background = '#d3d3d3';
            thisButton.style.cursor = 'not-allowed';
        }

        thisCell.appendChild(thisButton);
    });
    
    cellContainer.appendChild(thisCell);
}

//#endregion

//#region Event

const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/master/documents/answer.json";
const startUrl = "https://forms.office.com/Pages/ResponsePage.aspx?id=";

const clickBadEvent = (url) => (event) => {
    console.log("Web: ", url);
    chrome.tabs.create({ url: url });
}

const clickGoodEventType1 = (answerJson) => (event) => {
    console.log('Answer: ', answerJson);
    if (answerJson.length == 0) alert("Không tìm thấy đáp án cho câu hỏi này! Hãy thử lại bằng cách khác!");
    else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0], counter = 0;
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                var url = currentTab.url;
                var startId = "officeforms.answermap." + url.replace(startUrl, "");

                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    function: replaceValueType1,
                    args: [
                        startId,
                        JSON.stringify(answerJson)
                    ]
                }, result => {
                    console.log(JSON.stringify(result));
                    counter = result[0].result;
                    if (counter > 0) {
                        alert("Đã thay thế " + counter + " khóa! Tải lại trang để hiển thị kết quả!");
                        chrome.tabs.reload();
                    } else alert("Không tìm thấy khóa phù hợp! Hãy kiểm tra lại địa chỉ website, chọn/nhập đáp án cho 1 câu hỏi bất kỳ, hoặc thử lại bằng cách khác!");
                });

            } else alert("Đây không phải là trang web Microsoft Forms!");
        });
    }
}

const clickGoodEventType2 = (answerJson) => (event) => {
    console.log('Answer: ', answerJson);
    if (answerJson.length == 0) alert("Không tìm thấy đáp án cho câu hỏi này! Hãy thử lại bằng cách khác!");
    else {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0];
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                var url = currentTab.url;

                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    function: replaceValueType2,
                    args: [answerJson]
                }, () => {
                    alert("Đã thay thế đáp án khóa! Nếu không thấy sự thay đối, hãy kiểm tra lại địa chỉ website hoặc thử lại bằng cách khác!");
                });

            } else alert("Đây không phải là trang web Microsoft Forms!");
        });
    }
}

//#endregion

//#region Main
document.addEventListener('DOMContentLoaded', async function () {
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

    //alert(JSON.stringify(answerJson));
    //alert(answerJson);

    // Lắng nghe phản hồi từ background script
    //chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //    if (message.action === "sendLocalStorageLength") {
    //        const data = message.data;
    //        // Hiển thị dữ liệu nhận được từ localStorage ở đây
    //        if (data !== null) {
    //            alert('Data from content script:', data);
    //        } else {
    //            alert('No data found in content script.');
    //        }
    //    }
    //});

    //loadButton.addEventListener('click', function () {
    //    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //        var currentTab = tabs[0], counter = 0;
    //        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
    //            var url = currentTab.url;
    //            var startId = "officeforms.answermap." + url.replace(startUrl, "");

    //            chrome.scripting.executeScript({
    //                target: { tabId: currentTab.id },
    //                function: replaceValueType1,
    //                args: [
    //                    startId, 
    //                    JSON.stringify(answerJson)
    //                ]
    //            }, result => {
    //                console.log(JSON.stringify(result));
    //                counter = result[0].result;
    //                if (counter > 0) {
    //                    alert("Đã thay thế " + counter + " khóa! Tải lại trang để hiển thị kết quả!");
    //                    chrome.tabs.reload();
    //                } else alert("Không tìm thấy khóa phù hợp! Hãy kiểm tra lại bài thi, hoặc chọn/nhập đáp án cho 1 câu hỏi bất kỳ rồi thử lại sau!");
    //            });

    //            //var counter = 0;
    //            //alert(localStorage.length);
    //            //chrome.tabs.executeScript(currentTab.id, { code: 'localStorage.length;' }, function (result) {
    //            //    alert(result);
    //            //    var data = result;
    //            //    if (data !== null) {
    //            //        alert('Data from local storage:', data);
    //            //    } else {
    //            //        alert('No data found in local storage.');
    //            //    }
    //            //});
    //            //for (var i = 0; i < localStorage.length; ++i) {
    //            //    alert(i);
    //            //    var thisKey = localStorage.key(i);
    //            //    alert(startId + "\r\n\r\n\r\n" + thisKey);
    //            //    if (thisKey.startsWith(startId)) {
    //            //        localStorage.setItem(thisKey, answerJson);
    //            //        counter++;
    //            //    }
    //            //}
    //            //alert(t);
    //            //                chrome.storage.local.set({
    //            //                    Id:
    //            //`[{"Answer":"2","QuestionId":"r0f30d57349f24c7d9c7ed24d233ddd9c"},{"QuestionId":"r4adf7c70c0d645c0b9f2377e2dd2ef3a"},{"QuestionId":"rec03f38b96204903989eb59347c941d1"},{"QuestionId":"rbcb548dd0e2c47e08421fd59eabdfb30"},{"QuestionId":"r0515d26915dc48e281db6f7fb91b1fe5"}]`
    //            //                });
    //            //alert("Thành công thay thế " + counter + " mã khóa! Tải lại trang để kiểm tra kết quả!");
    //        } else alert("Đây không phải là trang web Microsoft Forms!");
    //    });
    //});
});

//#endregion

//#region Trash
//function getKeyArray() {
//    var keys = Object.keys(localStorage);
//    return keys;
//}
//function getValue(key) {
//    chrome.storage.local.get([key], function (result) {
//        if (result[key]) {
//            console.log('Value of ' + key + ' in localStorage: ' + result[key]);
//            return result[key];
//        } else {
//            console.log('Key does not exist in localStorage.');
//            return null;
//        }
//    });
//}
//function setValue(key, newValue) {
//    chrome.storage.local.get(key, function (result) {
//        if (result[key]) {
//            // If key exists, update its value
//            chrome.storage.local.set({ [key]: newValue }, function () {
//                console.log('Value updated successfully.');
//            });
//        } else {
//            console.log('Key does not exist in localStorage.');
//        }
//    });
//}
//function addValue(newKey, newValue) {
//    chrome.storage.local.get(function (result) {
//        // Add the new key-value pair to the result object
//        result[newKey] = newValue;

//        // Set the updated object back to storage
//        chrome.storage.local.set(result, function () {
//            console.log('New pair added to localStorage.');
//        });
//    });
//}
//function removeValue(keyToRemove) {
//    chrome.storage.local.get(function (result) {
//        // Kiểm tra xem key tồn tại trong result hay không
//        if (result.hasOwnProperty(keyToRemove)) {
//            // Xóa key khỏi object result
//            delete result[keyToRemove];

//            // Lưu object đã cập nhật trở lại localStorage
//            chrome.storage.local.set(result, function () {
//                console.log('Pair removed from localStorage.');
//            });
//        } else {
//            console.log('Key does not exist in localStorage.');
//        }
//    });
//}
//#endregion