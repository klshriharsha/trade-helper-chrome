import './popup.css'

import { findStock, FindStockParams } from '../content/content'
import { links } from '../utils/constants'

function App() {
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
