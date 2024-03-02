async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json(); // Lấy dữ liệu JSON từ phản hồi
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}
function replaceValue(startId, newValue) {
    var counter = 0, length = localStorage.length;
    //alert("4 - " + localStorage.length);
    for (var p = 0; p < length; p++) {
        var thisKey = localStorage.key(p);
        //alert("x - " + thisKey);
        if (thisKey.startsWith(startId)) {
            localStorage.setItem(thisKey, newValue);
            counter++;
        }
    }
    return counter;
}

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

document.addEventListener('DOMContentLoaded', async function () {
    const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/main/answer.json";
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

    var answerJson = await fetchData(answerUrl);
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

    loadButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var currentTab = tabs[0], counter = 0;
            if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
                var url = currentTab.url;
                var startId = "officeforms.answermap." + url.replace(startUrl, "");

                chrome.scripting.executeScript({
                    target: { tabId: currentTab.id },
                    function: replaceValue,
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
                    } else alert("Không tìm thấy khóa phù hợp! Hãy kiểm tra lại bài thi, hoặc chọn/nhập đáp án cho 1 câu hỏi bất kỳ rồi thử lại sau!");
                });

                //var counter = 0;
                //alert(localStorage.length);
                //chrome.tabs.executeScript(currentTab.id, { code: 'localStorage.length;' }, function (result) {
                //    alert(result);
                //    var data = result;
                //    if (data !== null) {
                //        alert('Data from local storage:', data);
                //    } else {
                //        alert('No data found in local storage.');
                //    }
                //});
                //for (var i = 0; i < localStorage.length; ++i) {
                //    alert(i);
                //    var thisKey = localStorage.key(i);
                //    alert(startId + "\r\n\r\n\r\n" + thisKey);
                //    if (thisKey.startsWith(startId)) {
                //        localStorage.setItem(thisKey, answerJson);
                //        counter++;
                //    }
                //}
                //alert(t);
                //                chrome.storage.local.set({
                //                    Id:
                //`[{"Answer":"2","QuestionId":"r0f30d57349f24c7d9c7ed24d233ddd9c"},{"QuestionId":"r4adf7c70c0d645c0b9f2377e2dd2ef3a"},{"QuestionId":"rec03f38b96204903989eb59347c941d1"},{"QuestionId":"rbcb548dd0e2c47e08421fd59eabdfb30"},{"QuestionId":"r0515d26915dc48e281db6f7fb91b1fe5"}]`
                //                });
                //alert("Thành công thay thế " + counter + " mã khóa! Tải lại trang để kiểm tra kết quả!");
            } else alert("Đây không phải là trang web Microsoft Forms!");
        });
    });
});