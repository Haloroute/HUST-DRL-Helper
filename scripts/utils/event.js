const answerUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/master/documents/answer.json";
const noticeUrl = "https://raw.githubusercontent.com/Haloroute/HUST-DRL-Helper/master/documents/notice.txt";
const startUrl = "https://forms.office.com/pages/responsepage.aspx?id=";

const clickBadEvent = (url) => (event) => {
    console.log("Click bad event!");
    console.log("Web: ", url);
    alert("Sau khi tab mới xuất hiện thì hãy chuyển sang tab mới và click lại vào tiện ích này nhé!");
    chrome.tabs.create({ url: url });
    console.log("Successfully completed bad event!");
}

// const clickGoodEventType1 = (answerJson) => async (event) => {
//     alert("Test");
// }

const clickGoodEventType1 = (answerJson) => async (event) => {    
    console.log("Click good event (type 1)!");
    console.log('Answer: ', answerJson);
    if (answerJson.length == 0) alert("Không tìm thấy đáp án cho câu hỏi này! Hãy thử lại bằng cách khác!");
    else {        
        let currentTab = await getCurrentTab(), counter = 0;
        // var currentTab = tabs[0], counter = 0;
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/pages\/responsepage/i)) {
            var url = currentTab.url.slice(startUrl.length).split("&")[0];
            var startId = "officeforms.answermap." + url;

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
                    alert("Đã thay thế " + counter + " khóa! Nếu kết quả không như mong muốn, hãy kiểm tra lại địa chỉ website, chọn/nhập đáp án cho 1 câu hỏi bất kỳ, hoặc thử lại bằng cách khác!");
                    console.log("Successfully completed good event (type 1)!");
                } else {
                    alert("Không tìm thấy khóa phù hợp! Hãy kiểm tra lại địa chỉ website, chọn/nhập đáp án cho 1 câu hỏi bất kỳ, hoặc thử lại bằng cách khác!");
                    console.log("Not found necessary key-value pairs (type 1)!");
                }
            });

        } else {
            alert("Đây không phải là trang web Microsoft Forms!");
            console.log('Wrong website (type 1)!');
        }
    }

}


const clickGoodEventType2 = (answerJson) => async (event) => {    
    console.log("Click good event (type 2)!");
    console.log('Answer: ', answerJson);
    if (answerJson.length == 0) alert("Không tìm thấy đáp án cho câu hỏi này! Hãy thử lại bằng cách khác!");
    else {
        let currentTab = await getCurrentTab();
        if (currentTab.url.match(/https\:\/\/forms\.office\.com\/Pages\/ResponsePage/i)) {
            // var url = currentTab.url;

            chrome.scripting.executeScript({
                target: { tabId: currentTab.id },
                function: replaceValueType2,
                args: [answerJson]
            }, () => {
                alert("Đã thay thế đáp án khóa! Nếu không thấy sự thay đối, hãy kiểm tra lại địa chỉ website hoặc thử lại bằng cách khác!");
                console.log("Successfully completed good event (type 2)!");
            });

        } else {              
            alert("Đây không phải là trang web Microsoft Forms!");
            console.log('Wrong website (type 2)!');
        }
        
    }
}