import { findStock, FindStockParams } from '../content/findStock'
import { Stock, submitStockInfo } from '../content/submitStockInfo'

/**
 * Injects a content script
 * @param tab Tab in which script has to be injected
 */
export const injectFindStockScript = async (tab: chrome.tabs.Tab) => {
    if (!tab.id) {
        return
    }

    const params: FindStockParams = {
        marketMoverTab: 'nasdaq',
        section: 'top gainers',
        position: 2,
    }

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: findStock,
        args: [params],
    })
}

/**
 * Injects a content script
 * @param tab Tab in which script has to be injected
 * @param stock Argument for the script
 */
export const injectSubmitStockInfoScript = async (tab: chrome.tabs.Tab, stock: Stock | null) => {
    if (!tab.id || !stock) {
        return
    }

    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: submitStockInfo,
        args: [stock],
    })
}
