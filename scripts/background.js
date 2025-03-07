chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Forward user prompt to content script
    chrome.tabs.query({ active: true }, (tabs) => {
        const re = new RegExp("https://.*\.vit.ac.in/.*")
        tabs.forEach(tab => {
            if (re.test(tab.url))
                chrome.tabs.sendMessage(tabs[0].id, message, (res) => sendResponse(res));
        })
    });
    return true;
});