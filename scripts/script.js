let ct = 0

const plan_bunk = (event) => {
    event.preventDefault()
    const output = document.querySelector('#output')
    const form = event.target

    output.innerText = "Processing..."
    chrome.runtime.sendMessage({
        date: form.querySelector('input#until_date').value,
        delay: form.querySelector('input#delay').value
    }, (res) => {
        output.innerText = `ODs Used: ${res.od}/40`
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    form.addEventListener('submit', plan_bunk)
})