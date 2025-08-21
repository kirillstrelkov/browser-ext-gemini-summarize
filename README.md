# Browser Extension: Summarize with AI

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
browser-ext-gemini-summarize/
├── icons/                     # Extension icons
├── src/
│   ├── background.js          # Handles context menu and opening the popup
│   └── popup/
│       ├── popup.html         # Popup UI
│       ├── popup.js           # Popup logic, settings, and API requests
│       ├── ...                # CSS and JS libraries
├── .eslint.config.mjs         # ESLint configuration
├── manifest_gc.json           # Manifest for Google Chrome
├── manifest_ff.json           # Manifest for Firefox
├── package.json               # Node.js dependencies and scripts
└── README.md                  # This file
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
- Alternatively, right-click anywhere on the page to automatically find and summarize the main content.
- Choose "Summarize with AI" to open the popup window.
- The popup displays input/output areas and advanced settings.

## Development

### Local Setup

1. **Clone and Install Dependencies**

   ```bash
   git clone <repository-url>
   cd browser-ext-gemini-summarize
   npm install
   ```

2. **Prepare Manifest for Development**
   The project uses different manifest files for Chrome and Firefox. Run the appropriate command to create the `manifest.json` file for your development browser.
   - For **Chrome**: `npm run make:gc`
   - For **Firefox**: `npm run make:ff`

3. **Load the Extension**
   Follow the instructions in the "Installation" section to load the unpacked extension into your browser.

### Available Scripts

- **Code Quality**
  - `npm run lint`: Check code style with ESLint.
  - `npm run fmt`: Format the code with Prettier.

- **Building for Release**
  To create distributable `.zip` files for both browsers in the `dist/` directory, run:

  ```bash
  npm run release
  ```

- **Cleanup**
  - `npm run clean`: Removes the `dist/` directory, `node_modules/`, and the generated `manifest.json`.

## Contributing

Feel free to submit issues or pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.
