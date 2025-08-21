let selectedTextForPopup = "";

chrome.runtime.onInstalled.addListener(() => {
  // It's a good practice to remove all previous context menus before creating a new one.
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "rcm-summarize",
      title: "Summarize with AI",
      contexts: ["selection", "page", "editable"],
    });
  });
});

function findPageContent() {
  const selectors = ["main", "article", "#main", "[class*=main]", "body"];
  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      const style = window.getComputedStyle(element);
      const isVisible =
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        element.offsetHeight > 0;
      if (
        isVisible &&
        element.innerText &&
        element.innerText.trim().length > 100
      ) {
        return element.innerText;
      }
    }
  }
  return null;
}

function openSummarizePopup(text) {
  if (text && text.trim()) {
    selectedTextForPopup = text;
    chrome.windows.create({
      url: chrome.runtime.getURL("src/popup/popup.html"),
      type: "popup",
      width: 800,
      height: 600,
    });
  } else {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon-128.png",
      title: "No Content Found",
      message:
        "Could not find any text to summarize. Please select text manually.",
    });
  }
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "rcm-summarize") {
    if (info.selectionText) {
      openSummarizePopup(info.selectionText);
    } else {
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          func: findPageContent,
        },
        (injectionResults) => {
          if (chrome.runtime.lastError) {
            openSummarizePopup(null);
            return;
          }
          const foundText = injectionResults
            ?.map((frame) => frame.result)
            .find((result) => result);
          openSummarizePopup(foundText);
        },
      );
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_TEXT_TO_SUMMARIZE") {
    sendResponse({ selectedText: selectedTextForPopup });
  }
});
