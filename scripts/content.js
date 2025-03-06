chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const rows = document.querySelectorAll('tbody tr')
    
    let ct = 0;
    if (message.calc_od)
        count_row(0, sendResponse, rows, ct, message)
    else {
        calc_bunks(message.att_date, message.att_thres, rows)
        sendResponse({})
    }
    
    return true;
})



// Calculate and append rows for each course / class
const calc_bunks = (date, thres, rows) => {

    date = new Date(date)
    const curr = (() => {
        const res = new Date()
        return new Date(
            res.getFullYear() + "-" +
            (Math.floor((res.getMonth() + 1) / 10) == 0 ? "0" : "") + (res.getMonth() + 1) + "-" +
            (Math.floor(res.getDate() / 10) == 0 ? "0" : "") + res.getDate()
        )
    })()
    if (date.getTime() <= curr.getTime()) return;
    
    const head = document.querySelector('thead tr').insertCell(12)
    head.outerHTML = `
        <th style="vertical-align: middle; text-align: center; border-right: 1px solid #b2b2b2; padding: 5px; background: rgb(22, 153, 216) !important;">
            Skippable
        </th>
    `

    const diff = calc_date_diff(curr, date)
    rows.forEach(row => {
        if (row.children.length == 1) return;

        const type = row.children[3].innerText  
        const slots = row.children[4].innerText

        let attended = parseInt(row.children[9].innerText)
        let total = parseInt(row.children[10].innerText)

        let skip = 0
        get_slot_days(slots, type.includes('Lab')).forEach(day => { skip += diff[day] })
        total += skip

        while ((attended / total)*100 < thres) {
            skip--;
            attended++;
        }

        const res = row.insertCell(12)
        res.innerText = skip
    })


}


// get the days for all the slots of the course
const get_slot_days = (slot_str, isLab) => {
    const res = []

    const slots = slot_str.split('+').map(slot =>
        slot.slice(isLab ? 1 : 0, slot.length - (isLab ? 0 : 1))
    )

    slots.forEach(slot => {
        if (!isLab && SLOT_DAY[slot] == undefined) return;
        
        if (isLab) {
            let lab_no = parseInt(slot)
            if (lab_no > 30) lab_no -= 30

            const day = DAYS[Math.floor(lab_no / 6) - (lab_no % 6 == 0)]
            res.push(day)
        } else
            res.push(...SLOT_DAY[slot])
    })

    return res;
}


// Calculate the number of days between two given dates individually
const calc_date_diff = (start, end) => {
    const res = {}

    const diff_days = (end - start) / DAYS_MS
    DAYS.forEach(DAY => { res[DAY] = Math.floor(diff_days / 7) })
    
    start = new Date(end - (diff_days % 7)*DAYS_MS)
    while (start.getTime() <= end.getTime()) {
        if (start.getDay() != 0 && start.getDay() != 6)
            res[DAYS[start.getDay()-1]]++
        start = new Date(start.getTime() + DAYS_MS)
    }

    return res
}


// Counts the number of ODs
const count_row = (idx, sendResponse, rows, ct, message) => {
    if (idx + 1 == rows.length) {
        sendResponse({ od: ct });
        calc_bunks(message.att_date, message.att_thres, rows)
        return;
    }
    
    row = rows[idx]
    row.querySelector('a.btn').click()
    isLab = row.children[3].innerText.includes('Lab')
    setTimeout(() => {
        document.querySelectorAll('td').forEach(e => {
            if (e.innerText == 'On Duty') ct += 1 + isLab
        })
        try {
            document.querySelector('button#btn').click()
        } catch {
            return sendResponse({ error: true })
        }
        setTimeout(() => count_row(idx+1, sendResponse, rows, ct, message), message.delay)
    }, message.delay);
}







const DAYS = ["mon", "tue", "wed", "thu", "fri"]
const DAYS_MS = (24 * 60 * 60 * 1000)

const SLOT_DAY = {
    "A": ["mon", "wed"],
    "B": ["tue", "thu"],
    "C": ["wed", "fri"],
    "D": ["thu", "mon"],
    "E": ["fri", "tue"],
    "F": ["mon", "wed"],
    "G": ["tue", "thu"],
    "TA": ["fri"], "TB": ["mon"],
    "TC": ["tue"], "TD": ["wed"],
    "TE": ["thu"], "TF": ["fri"],
    "TG": ["mon"],
    "TAA": ["tue"], "TBB": ["wed"],
    "TCC": ["thu"], "TDD": ["fri"]
}