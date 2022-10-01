export interface FindStockParams {
    marketMoverTab: 'nasdaq'
    section: 'top gainers'
    position: 2
}

/**
 * Extracts information about a stock.
 * @param params.marketMoverTab Name of the tab (Ex: nasdaq)
 * @param params.section Name of the section within the tab (Ex: top gainers)
 * @param params.position Position of the stock (Ex: 2)
 */
export const findStock = ({ marketMoverTab, section, position }: FindStockParams) => {
    const selectors = {
        stock: (p: number) => `table > tbody > tr:nth-child(${p})`,
        container: 'div.MarketMoversMenu-moverContainer',
        tabs: 'button.MarketMoversMenu-marketOption',
        stockGain: 'td.MarketTop-quoteGain',
        sectionTitle: 'h4.MarketTop-title',
        stockName: 'td.MarketTop-name',
    }

    const isTargetTab = (tab: Element) => new RegExp(marketMoverTab, 'i').test(tab.textContent ?? '')
    const isTargetSection = (sec: Element) => new RegExp(section, 'i').test(sec.textContent ?? '')

    // Tab container
    const container = document.querySelector(selectors.container)
    // Tabs
    const tabs = container?.querySelectorAll(selectors.tabs) ?? []
    // Target tab that needs to be clicked
    const targetTab = Array.from(tabs).find(isTargetTab) as HTMLButtonElement | null

    if (targetTab) {
        chrome.runtime.sendMessage({
            type: 'progress',
            data: 'switching tab',
        })
        targetTab.click()
    }

    chrome.runtime.sendMessage({
        type: 'progress',
        data: 'extracting stock information',
    })
    // Wait for tab to load
    setTimeout(() => {
        // Market mover sections
        const sections = document.querySelectorAll(selectors.sectionTitle) ?? []
        // Target section where stock is listed
        const targetSection = Array.from(sections).find(isTargetSection)
        // Target stock whose info needs to be extracted
        const targetStock = targetSection?.parentElement?.querySelector(selectors.stock(position))

        // Communicate the target stock info to popup
        chrome.runtime.sendMessage({
            type: 'result',
            data: {
                name: targetStock?.querySelector(selectors.stockName)?.textContent,
                gain: targetStock?.querySelector(selectors.stockGain)?.textContent,
            },
        })
    }, 1000)
}
