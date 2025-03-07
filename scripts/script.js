let ct = 0

const plan_bunk = (event) => {
    event.preventDefault()
    const output = document.querySelector('#output')
    const form = event.target

    const data = {}
    form.querySelectorAll('input:not([type="submit"])').forEach(inp => {
        data[inp.name] = (inp.type == 'checkbox' ? inp.checked : inp.value)
    })

    output.innerText = "Processing..."
    chrome.runtime.sendMessage(data, (res) => {
        if (res.error)
            output.innerText = 'An error occurred! Maybe increase the delay?'
        else
            output.innerText = data['calc_od'] ? `ODs Used: ${res.od}/40` : ''
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form')
    form.addEventListener('submit', plan_bunk)
})