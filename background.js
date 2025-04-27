chrome.action.onClicked.addListener((tab) => {
  if (!tab || !tab.id) return;

  const key = `rotation_${tab.id}`;

  chrome.storage.local.get([key], (result) => {
    let rotation = result[key] || 0;
    rotation += 90; // Keep increasing, no modulus

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (rotation) => {
        const visualRotation = rotation % 360; // only apply visual rotation
        document.body.style.transition = "transform 0.5s ease";
        document.body.style.transform = `rotate(${visualRotation}deg)`;
        document.body.style.transformOrigin = "center center";
      },
      args: [rotation]
    });

    chrome.storage.local.set({ [key]: rotation });
  });
});
