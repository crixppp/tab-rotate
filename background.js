let rotation = 0;

chrome.action.onClicked.addListener((tab) => {
  rotation = (rotation + 90) % 360;
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: (rotation) => {
      document.body.style.transform = `rotate(${rotation}deg)`;
      document.body.style.transformOrigin = "center center";
    },
    args: [rotation]
  });
});
