async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabList = await chrome.tabs.query(queryOptions);
    if (tabList != undefined) return tabList[0];
    else return undefined;
}

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