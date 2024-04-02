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
                    function: generateStorageKeyValuePair,
                    args: []
                })

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
                        chrome.tabs.reload();
                        alert("Đã thay thế " + counter + " khóa! Nếu kết quả không như mong muốn, hãy thử cách 2!");
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