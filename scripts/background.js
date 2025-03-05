chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward user prompt to content script
    chrome.tabs.query({ active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message, (res) => sendResponse(res));
    });
    return true;
});