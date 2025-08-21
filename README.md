# Browser Extension: Gemini Summarize

This project is a Browser extension that uses the Gemini API to summarize selected text from web pages and renders the result as Markdown.

## Features

- Summarize any selected text on a webpage via a right-click context menu.
- Displays the summarized text in a clean, readable popup window.
- Renders the API response as Markdown using [Showdown.js](http://showdownjs.com/).
- Styled with [Pico.css](https://picocss.com) for a modern, classless look that supports light and dark modes.
- Customizable settings for advanced users:
  - API URL
  - API Key
  - Prompt Template

## Project Structure

```bash
browser-ext-gemini-summarize
├── dist/                    # Packaged extension files
├── icons/                   # Extension icons
├── src
│   ├── background.js        # Handles context menu and opening the popup
│   ├── content.js           # (Currently unused)
│   └── popup
│       ├── popup.html       # Popup UI
│       ├── popup.js         # Popup logic, settings, and API requests
│       ├── pico.fluid.classless.min.css # Pico.css stylesheet
│       └── showdown.min.js  # Showdown.js library
├── .eslint.config.mjs       # ESLint configuration
├── manifest.json            # Extension manifest
├── package.json             # Node.js dependencies and scripts
└── README.md                # This file
```

## Installation Firefox

1. Clone the repository or download the source code.
2. Open Firefox and go to `about:debugging`.
3. Click "This Firefox" > "Load Temporary Add-on".
4. Select the `manifest.json` file from the project directory.

## Installation Chrome

1. Clone the repository or download the source code.
2. Open Chrome and go to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked".
5. Select the project directory.

## Usage

- Right-click selected text to access the extension's context menu.
- Choose "Summarize" to open the popup window.
- The popup displays input/output areas and advanced settings.

## Development

- Run `npm install` to install dependencies.
- Use `npm run lint` to check code style with ESLint.
- Use `npm run zip` to create a distributable `.zip` file in the `dist/` directory.
- Use `npm run clean` to remove generated files (`dist/` and `node_modules/`).
- Use `npm run fmt` to format the code with Prettier.

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
