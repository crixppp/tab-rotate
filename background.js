let rotation = 0;

chrome.action.onClicked.addListener((tab) => {
  rotation = (rotation + 90) % 360;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (rotation) => {
      const body = document.body;
      const html = document.documentElement;

      // Reset all styles first
      body.style.margin = "0";
      body.style.padding = "0";
      body.style.overflow = "hidden"; // disable scroll
      html.style.overflow = "hidden"; // disable scroll

      if (rotation === 0) {
        body.style.transform = "none";
      } else {
        body.style.transform = `rotate(${rotation}deg)`;
        body.style.transformOrigin = "center center";
        body.style.width = "100vh";
        body.style.height = "100vw";
        body.style.position = "fixed";
        body.style.top = "50%";
        body.style.left = "50%";
        body.style.transform += " translate(-50%, -50%)";
      }
    },
    args: [rotation]
  });
});
