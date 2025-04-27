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

// Handle page refresh: reset rotation
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    chrome.storage.local.remove(`rotation_${tabId}`);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab || !tab.id) return;

  let newRotation = 0;
  const key = `rotation_${tab.id}`;

  if (info.menuItemId === "rotate90") {
    newRotation = 90;
  } else if (info.menuItemId === "rotate180") {
    newRotation = 180;
  } else if (info.menuItemId === "rotate270") {
    newRotation = 270;
  } else if (info.menuItemId === "reset") {
    newRotation = 0;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (rotation) => {
      document.body.style.transition = "transform 0.5s ease";
      document.body.style.transform = `rotate(${rotation}deg)`;
      document.body.style.transformOrigin = "center center";
    },
    args: [newRotation]
  });

  chrome.storage.local.set({ [key]: newRotation });
});

// Also allow clicking the icon to rotate 90° quickly
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

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
