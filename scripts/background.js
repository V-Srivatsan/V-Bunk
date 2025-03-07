chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward user prompt to content script
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        console.log(tabs)
        chrome.tabs.sendMessage(tabs[0].id, message, (res) => sendResponse(res));
    });

    return true;
});