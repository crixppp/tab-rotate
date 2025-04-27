chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.clear(); // clear rotation info when the extension is installed or updated
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.storage.local.remove(`rotation_${tabId}`); // reset rotation when the page refreshes
  }
});

chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  const key = `rotation_${tab.id}`;

  chrome.storage.local.get([key], (result) => {
    let rotation = result[key] || 0;
    rotation = (rotation + 90) % 360;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (rotation) => {
        document.body.style.transition = "transform 0.5s ease";
        document.body.style.transform = `rotate(${rotation}deg)`;
        document.body.style.transformOrigin = "center center";
      },
      args: [rotation]
    });

    chrome.storage.local.set({ [key]: rotation });
  });
});
