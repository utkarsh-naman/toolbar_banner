browser.runtime.onInstalled.addListener(async () => {
  const { customBanner } = await browser.storage.local.get("customBanner");
  if (customBanner) {
    applyCustomBanner(customBanner);
  }
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "updateTheme") {
    applyCustomBanner(message.dataURL);
  }
});

function applyCustomBanner(dataURL) {
  browser.theme.update({
    images: {
      theme_frame: dataURL
    },
    colors: {
      frame: [100, 100, 255],
      tab_background_text: [255, 255, 255]
    }
  });
}
