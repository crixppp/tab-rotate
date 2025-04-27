// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "rotate90",
    title: "Rotate 90°",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "rotate180",
    title: "Rotate 180°",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "rotate270",
    title: "Rotate 270°",
    contexts: ["action"]
  });
  chrome.contextMenus.create({
    id: "reset",
    title: "Reset Rotation",
    contexts: ["action"]
  });
});

// Reset rotation when the page reloads
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.remove(`rotation_${tabId}`);
  }
});

// Handle right-click context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  const key = `rotation_${tab.id}`;

  chrome.storage.local.get([key], (result) => {
    let currentRotation = result[key] || 0;

    if (info.menuItemId === "rotate90") {
      currentRotation += 90;
    } else if (info.menuItemId === "rotate180") {
      currentRotation += 180;
    } else if (info.menuItemId === "rotate270") {
      currentRotation += 270;
    } else if (info.menuItemId === "reset") {
      currentRotation = 0;
    }

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (rotation) => {
        const visualRotation = rotation % 360;
        document.body.style.transition = "transform 0.5s ease";
        document.body.style.transform = `rotate(${visualRotation}deg)`;
        document.body.style.transformOrigin = "center center";
      },
      args: [currentRotation]
    });

    chrome.storage.local.set({ [key]: currentRotation });
  });
});

// Handle simple left-click on the extension icon (rotate 90°)
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

  const key = `rotation_${tab.id}`;

  chrome.storage.local.get([key], (result) => {
    let rotation = result[key] || 0;
    rotation += 90; // Keep adding 90 each time

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (rotation) => {
        const visualRotation = rotation % 360;
        document.body.style.transition = "transform 0.5s ease";
        document.body.style.transform = `rotate(${visualRotation}deg)`;
        document.body.style.transformOrigin = "center center";
      },
      args: [rotation]
    });

    chrome.storage.local.set({ [key]: rotation });
  });
});
