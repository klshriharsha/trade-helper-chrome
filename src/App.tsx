import './app.css'

import { links } from './constants'

interface FindStockParams {
    marketMoverTab: 'nasdaq'
    section: 'top gainers'
    position: 2
}

function App() {
    const findStock = ({ marketMoverTab, section, position }: FindStockParams) => {
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
            targetTab.click()
        }

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
                name: targetStock?.querySelector(selectors.stockName)?.textContent,
                gain: targetStock?.querySelector(selectors.stockGain)?.textContent,
            })
        }, 1000)
    }

    const handleClick = async () => {
        // Navigate to the URL
        const tab = await chrome.tabs.update({ url: links.marketMovers })

        // Wait for page to load
        setTimeout(async () => {
            const params: FindStockParams = {
                marketMoverTab: 'nasdaq',
                section: 'top gainers',
                position: 2,
            }

            // Listen for messages from the content script
            chrome.runtime.onMessage.addListener(message => {
                console.log({ message })
            })

            // Inject content script
            await chrome.scripting.executeScript({
                target: { tabId: tab.id ?? 1 },
                func: findStock,
                args: [params],
            })
        }, 5000)
    }

    return (
        <div className="container">
            <div className="align-left">
                <h1>Steps executed by the script</h1>
                <ul>
                    <li>
                        Navigate to <a href={links.marketMovers}>CNBC US Market Movers</a> page
                    </li>
                    <li>Switch to NASDAQ tab</li>
                    <li>Find the 2nd top gaining stock of the day and extract it's information</li>
                    <li>
                        Navigate to a <a href={links.form}>form</a>, fill relevant details and submit
                    </li>
                </ul>
            </div>
            <button className="btn" onClick={handleClick}>
                Run Script
            </button>
        </div>
    )
}

export default App
