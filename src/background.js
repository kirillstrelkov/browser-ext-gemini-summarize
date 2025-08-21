let selectedTextForPopup = "";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rcm-summarize",
    title: "Summarize with AI",
    contexts: ["selection"],
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId === "rcm-summarize") {
    if (info.selectionText) {
      selectedTextForPopup = info.selectionText;
      chrome.windows.create({
        url: chrome.runtime.getURL("src/popup/popup.html"),
        type: "popup",
        width: 800,
        height: 800,
      });
    } else {
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/icon-128.png",
        title: "No text selected",
        message: "Please select some text to summarize.",
      });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TEXT_TO_SUMMARIZE") {
    sendResponse({ selectedText: selectedTextForPopup });
  }
});
