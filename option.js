document.getElementById('upload').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function () {
    const dataURL = reader.result;
    browser.storage.local.set({ customBanner: dataURL }, () => {
      browser.runtime.sendMessage({ action: "updateTheme", dataURL });
      document.getElementById('status').textContent = "Custom banner applied!";
    });
  };
  reader.readAsDataURL(file);
});
