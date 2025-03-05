chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const rows = document.querySelectorAll('tbody tr')
    
    let ct = 0;
    // count_row(0, sendResponse, rows, ct, message.delay)


    
    return true;
})

const count_row = (idx, sendResponse, rows, ct, delay) => {
    if (idx+1 == rows.length) return sendResponse({ od: ct });
    
    row = rows[idx]
    row.querySelector('a.btn').click()
    isLab = row.children[3].innerText.includes('Lab')
    setTimeout(() => {
        document.querySelectorAll('td').forEach(e => {
            if (e.innerText == 'On Duty') ct += 1 + isLab
        })
        document.querySelector('button#btn').click()
        setTimeout(() => count_row(idx+1, sendResponse, rows, ct, delay), delay)
    }, delay);
}
