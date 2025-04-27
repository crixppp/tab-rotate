let rotation = 0;

chrome.action.onClicked.addListener((tab) => {
  rotation = (rotation + 90) % 360;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (rotation) => {
      const body = document.body;
      body.style.transformOrigin = "center center";

      if (rotation === 90) {
        body.style.transform = "rotate(90deg) scale(" + window.innerHeight / window.innerWidth + ")";
      } else if (rotation === 180) {
        body.style.transform = "rotate(180deg) scale(1)";
      } else if (rotation === 270) {
        body.style.transform = "rotate(270deg) scale(" + window.innerHeight / window.innerWidth + ")";
      } else {
        body.style.transform = "rotate(0deg) scale(1)";
      }
    },
    args: [rotation]
  });
});
