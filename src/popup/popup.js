document.addEventListener("DOMContentLoaded", function () {
  chrome.runtime.sendMessage({ type: "GET_TEXT_TO_SUMMARIZE" }, (response) => {
    if (response && response.selectedText) {
      const selectedText = response.selectedText;
      setTextById("textarea-input", selectedText);
      summarize(selectedText);
    } else {
      setHtmlById(
        "html-output",
        "<p>Error: Could not retrieve text to summarize.</p>",
      );
    }
  });

  document
    .getElementById("update-settings")
    .addEventListener("click", updateSettingsAndReload);
});

function summarize(selectedText) {
  setHtmlById("html-output", "<p>Waiting for output...</p><progress />");
  processRequest(selectedText);
}

function setHtmlById(id, html) {
  const element = document.getElementById(id);
  if (element) {
    element.innerHTML = html;
  }
}

function setTextById(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function processRequest(selectedText) {
  const settings = {
    API_KEY: null,
    API_URL:
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=$GEMINI_API_KEY",
    PROMPT_TEMPLATE:
      "Summarize the following text in as short and concise a manner as possible, retaining all key information.\n\n```\n$TEXT\n```\n\nUse markdown as output format.",
  };

  chrome.storage.local.get(["settings"], (data) => {
    if (data.settings) {
      settings.API_KEY = data.settings.API_KEY;
      settings.API_URL = data.settings.API_URL;
      settings.PROMPT_TEMPLATE = data.settings.PROMPT_TEMPLATE;
    } else {
      chrome.storage.local.set({ settings: settings });
    }

    if (!checkSettings(settings)) {
      return;
    }

    setInputById("api-url", settings.API_URL);
    setInputById("api-key", settings.API_KEY);
    setInputById("prompt-template", settings.PROMPT_TEMPLATE);

    const apiUrl = prepareApiUrl(settings.API_URL, settings.API_KEY);
    const apiData = prepareApiData(settings.PROMPT_TEMPLATE, selectedText);
    if (!apiUrl) {
      return;
    }

    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.candidates) {
          var converter = new showdown.Converter();
          const text = data.candidates[0].content.parts[0].text || data.message;
          const contentHtml = converter.makeHtml(text);
          setHtmlById("html-output", contentHtml);
        } else {
          setHtmlById(
            "html-output",
            `<p>Error fetching data: ${data?.error?.message}</p>`,
          );
        }
      });
  });
}

function prepareApiUrl(apiUrl, apiKey) {
  return apiUrl.replace("$GEMINI_API_KEY", apiKey);
}

function prepareApiData(promptTemplate, selectedText) {
  return {
    contents: [
      {
        parts: [
          {
            text: promptTemplate.replace("$TEXT", selectedText),
          },
        ],
      },
    ],
  };
}

function setInputById(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.value = value;
  }
}

function checkSettings(settings) {
  if (!settings.API_KEY) {
    settings.API_KEY = prompt("Please enter your API key:");
    if (settings.API_KEY) {
      chrome.storage.local.set({ settings: settings });
    } else {
      alert("API key is required to proceed.");
      return false;
    }
  }

  if (!settings.API_URL.includes("$GEMINI_API_KEY")) {
    alert("API URL must contain $GEMINI_API_KEY placeholder.");
    return false;
  }
  if (!settings.API_KEY) {
    alert("API Key is required.");
    return false;
  }
  if (!settings.PROMPT_TEMPLATE.includes("$TEXT")) {
    alert("Prompt template must contain $TEXT placeholder.");
    return false;
  }
  return true;
}

function updateSettings() {
  const apiUrl = document.getElementById("api-url").value;
  const apiKey = document.getElementById("api-key").value;
  const promptTemplate = document.getElementById("prompt-template").value;

  if (
    !checkSettings({
      API_URL: apiUrl,
      API_KEY: apiKey,
      PROMPT_TEMPLATE: promptTemplate,
    })
  ) {
    return;
  }

  chrome.storage.local.set({
    settings: {
      API_URL: apiUrl,
      API_KEY: apiKey,
      PROMPT_TEMPLATE: promptTemplate,
    },
  });
}

function updateSettingsAndReload(e) {
  e.preventDefault();

  updateSettings();
  closeAdvancedOptions();
  const selectedText = document.getElementById("textarea-input").value;
  summarize(selectedText);
}

function closeAdvancedOptions() {
  ["expert-settings", "advanced-options"].forEach((id) => {
    const element = document.getElementById(id);
    if (element && element.hasAttribute("open")) {
      element.removeAttribute("open");
    }
  });
}
