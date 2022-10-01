import './app.css'

import { links } from './constants'

function App() {
    const handleClick = async () => {
        const tab = await chrome.tabs.create({ active: true, url: links.marketMovers })
        console.log({ tab })
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
