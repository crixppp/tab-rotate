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

// Rotate tab using a wrapper with real window measurements and bounce only on reset
function rotatePage(tabId, rotation) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    func: (rotation) => {
      const visualRotation = rotation % 360;

      let wrapper = document.getElementById("page-rotator-wrapper");

      if (!wrapper) {
        wrapper = document.createElement("div");
        wrapper.id = "page-rotator-wrapper";

        // Move all body content inside the wrapper
        while (document.body.firstChild) {
          wrapper.appendChild(document.body.firstChild);
        }
        document.body.appendChild(wrapper);

        // Body styles
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.overflow = "auto";
        document.body.style.height = "100%";
        document.body.style.width = "100%";

        wrapper.dataset.wasRotated = "false"; // NEW: Track if rotation has occurred
      }

      const w = window.innerWidth;
      const h = window.innerHeight;

      wrapper.style.transition = "transform 0.5s ease";
      wrapper.style.transformOrigin = "top left";
      wrapper.style.width = "100%";
      wrapper.style.height = "100%";
      wrapper.style.position = "absolute";

      if (visualRotation === 0) {
        if (wrapper.dataset.wasRotated === "true") {
          wrapper.animate([
            { transform: 'scale(1.1) rotate(0deg)' },
            { transform: 'scale(0.9) rotate(0deg)' },
            { transform: 'scale(1.0) rotate(0deg)' }
          ], {
            duration: 400,
            easing: 'ease-out'
          });
        }
        wrapper.style.transform = 'rotate(0deg)';
        wrapper.dataset.wasRotated = "false";
      } else if (visualRotation === 90) {
        wrapper.style.transform = `rotate(90deg) translate(0px, -${w}px)`;
        wrapper.dataset.wasRotated = "true";
      } else if (visualRotation === 180) {
        wrapper.style.transform = `rotate(180deg) translate(-${w}px, -${h}px)`;
        wrapper.dataset.wasRotated = "true";
      } else if (visualRotation === 270) {
        wrapper.style.transform = `rotate(270deg) translate(-${h}px, 0px)`;
        wrapper.dataset.wasRotated = "true";
      }
    },
    args: [rotation]
  });
}

// Handle right-click context menu actions
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

// Handle left-click (quick 90° rotation)
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
