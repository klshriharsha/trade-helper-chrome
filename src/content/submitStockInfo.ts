export interface Stock {
    name: string
    gain: string
    time: number
}

/**
 * Extracts information about a stock.
 * @param params.name Name of the stock
 * @param params.section Percentage gain of the stock
 * @param params.position Time when information was extracted
 */
export const submitStockInfo = ({ name, gain, time }: Stock) => {
    chrome.runtime.sendMessage({
        type: 'progress',
        data: 'filling stock information',
    })

    const selectors = {
        name: 'input[name="SingleLine"]',
        gain: 'input[name="SingleLine1"]',
        time: 'input[name="SingleLine2"]',
        submitButton: 'button[value="submit"]',
    }

    const nameField = document.querySelector(selectors.name) as HTMLInputElement | null
    if (nameField) {
        nameField.value = name
    }
    const gainField = document.querySelector(selectors.gain) as HTMLInputElement | null
    if (gainField) {
        gainField.value = gain
    }
    const timeField = document.querySelector(selectors.time) as HTMLInputElement | null
    if (timeField) {
        timeField.value = `${time}`
    }

    const submitButton = document.querySelector(selectors.submitButton) as HTMLButtonElement | null
    if (submitButton) {
        submitButton.click()
        chrome.runtime.sendMessage({
            type: 'submitStockInfo:result',
            data: 'submitted successfully',
        })
    }
}
