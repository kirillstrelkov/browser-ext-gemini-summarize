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
      chrome.storage.local.set({ selectedText: info.selectionText }, () => {
        chrome.windows.create({
          url: chrome.runtime.getURL("src/popup/popup.html"),
          type: "popup",
          width: 800,
          height: 800,
        });
      });
    }
  }
});
