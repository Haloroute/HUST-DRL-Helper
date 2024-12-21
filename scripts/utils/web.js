async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let tabList = await chrome.tabs.query(queryOptions);
    if (tabList != undefined) return tabList[0];
    else return null;
}

async function fetchData(url, type='json') {
    try {
        const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
        if (!response.ok) {
            throw new Error('Network response was not ok! Check your network connection and try again!');
        }

        let data;
        if (type == 'json') {
            data = await response.json();
            console.log("Successfully received JSON data from: ", url);
        } else if (type == 'text') {
            data = await response.text();
            console.log("Successfully received TEXT data from: ", url);
        }

        return data;
        
    } catch (error) {
        console.log('Error fetching data from: ', url);
        console.log('with error: ', error);
        return null;
    }
}

function getCurrentLocale(localeList, default_locale, current_locale) {
    current_locale = current_locale.replaceAll("-", "_");
    if (localeList.includes(current_locale)) return current_locale;
    else if (localeList.includes(current_locale.split("_")[0])) return current_locale.split("_")[0];
    else if (localeList.includes(default_locale)) return default_locale;
    else if (localeList.length > 0) return localeList[0];
    else return null;
}