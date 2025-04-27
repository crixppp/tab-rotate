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

// Rotate the page safely without messing layout
function rotatePage(tabId, rotation) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (rotation) => {
      const visualRotation = rotation % 360;

      document.body.style.transition = "transform 0.5s ease";
      document.body.style.transformOrigin = "center center";
      document.body.style.position = "relative";
      document.documentElement.style.overflow = "auto";
      document.body.style.overflow = "auto";

      if (visualRotation === 0) {
        // Bounce when resetting
        document.body.animate([
          { transform: 'scale(1.1) rotate(0deg)' },
          { transform: 'scale(0.9) rotate(0deg)' },
          { transform: 'scale(1.0) rotate(0deg)' }
        ], {
          duration: 400,
          easing: 'ease-out'
        });
        document.body.style.transform = 'rotate(0deg)';
      } else {
        document.body.style.transform = `rotate(${visualRotation}deg)`;
      }
    },
    args: [rotation]
  });
}

// Handle right-click menu
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

    rotatePage(tab.id, currentRotation);
    chrome.storage.local.set({ [key]: currentRotation });
  });
});

// Handle left-click quick rotate (90°)
chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

  const key = `rotation_${tab.id}`;

  chrome.storage.local.get([key], (result) => {
    let rotation = result[key] || 0;
    rotation += 90;

    rotatePage(tab.id, rotation);
    chrome.storage.local.set({ [key]: rotation });
  });
});
