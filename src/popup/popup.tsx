import './popup.css'

import { useCallback, useEffect, useState } from 'react'

import Check from '../components/check'
import Spinner from '../components/spinner'
import Steps from '../components/steps'
import { Stock } from '../content/submitStockInfo'
import { links } from '../utils/constants'
import { injectFindStockScript, injectSubmitStockInfoScript } from '../utils/contentScripts'

function App() {
    const [done, setDone] = useState(false)
    const [progress, setProgress] = useState('')
    const [stock, setStock] = useState<Stock | null>(null)

    const initiateExtractScript = async () => {
        setProgress('navigating to CNBC')
        // Navigate to the URL
        const tab = await chrome.tabs.update({ url: links.marketMovers })

        // Wait for page to load
        setTimeout(() => injectFindStockScript(tab), 5000)
    }

    const initiateSubmitScript = useCallback(async () => {
        setProgress('navigating to form')
        // Navigate to the URL
        const tab = await chrome.tabs.update({ url: links.form })

        // Wait for page to load
        setTimeout(() => injectSubmitStockInfoScript(tab, stock), 5000)
    }, [stock])

    // Submit stock information when it's available
    useEffect(() => {
        if (stock) {
            initiateSubmitScript()
        }
    }, [stock, initiateSubmitScript])

    useEffect(() => {
        // Listen for messages from the content script
        chrome.runtime.onMessage.addListener(message => {
            if (message.type === 'progress') {
                setProgress(message.data)
            } else if (message.type === 'findStock:result') {
                setStock(message.data)
                setProgress(`${message.data.name} is at position ${message.data.position} today`)
            } else if (message.type === 'submitStockInfo:result') {
                setProgress('')
                setDone(true)
                setTimeout(() => {
                    setDone(false)
                }, 5000)
            }
        })
    }, [])

    if (done) {
        return (
            <div className="container container--center">
                <Check style={{ color: 'green', fontSize: '5em' }} />
                <h2>Submitted succesfully</h2>
                <div className="container__auto-dismiss-counter" />
            </div>
        )
    }

    return (
        <div className="container">
            <Steps />
            <button className="btn" onClick={initiateExtractScript} disabled={!!progress}>
                {progress ? (
                    <p className="btn__progress">
                        <Spinner />
                        &nbsp;&nbsp;{progress}
                    </p>
                ) : (
                    'Run Script'
                )}
            </button>
        </div>
    )
}

export default App
