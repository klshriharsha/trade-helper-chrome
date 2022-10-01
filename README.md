# Trade Helper Chrome Extension

A chrome extension to find the top 2nd gaining stock of the day from [CNBC](https://www.cnbc.com/us-market-movers/) and extract it's name and percentage gain to submit to an external [form](https://tinyurl.com/mtpzcucb).

## Demo

![Demo](./docs/demo.gif)

## Steps to load the extension ([official docs](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked))

-   Run `yarn` to install dependencies (Make sure that Yarn is updated before running. This project uses Yarn 3.2.3).
-   Run `yarn build` to build the extension. This creates a `dist` directory in the project.
-   Open `chrome://extensions` and enabled "Developer mode".
-   Click on "Load unpacked" and select the `dist` directory.
