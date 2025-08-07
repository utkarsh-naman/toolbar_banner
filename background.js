// --- CONFIGURATION ---
const DEFAULT_COLOR = '#a0cfff';
// IMPORTANT: Replace this with the RAW GitHub link to your NEW PENGUIN.PNG!
const REMOTE_IMAGE_URL = 'https://raw.githubusercontent.com/utkarsh-naman/toolbar_banner/main/penguin.png';
// A local fallback image in case the remote one can't be fetched.
const FALLBACK_IMAGE = 'penguin.svg'; // This can stay as svg, it's just a fallback.

// --- FUNCTIONS ---

function applyTheme(color, imageDataUrl) {
  browser.theme.update({
    images: {
      additional_backgrounds: [imageDataUrl]
    },
    properties: {
      additional_backgrounds_alignment: ["right"],
      additional_backgrounds_tiling: ["no-repeat"]
    },
    colors: {
      frame: color,
      toolbar: 'transparent',
      toolbar_field: 'transparent',
      toolbar_field_border: 'transparent',
      tab_background_text: '#000000',
      toolbar_field_text: '#000000',
      toolbar_text: '#000000',
      bookmark_text: '#000000'
    }
  });
}

/**
 * Fetches a remote image (PNG/JPG), converts it to a Base64 Data URL, and caches it.
 * @returns {Promise<string>} A promise that resolves with the image's Data URL.
 */
function getRemoteImageDataUrl() {
  return new Promise((resolve) => {
    fetch(REMOTE_IMAGE_URL)
      .then(response => {
        if (!response.ok) {
          console.error('Failed to fetch remote image, using fallback.');
          resolve(FALLBACK_IMAGE);
          return null; // Stop the promise chain
        }
        // For binary images like PNG, we process them as a "blob".
        return response.blob();
      })
      .then(blob => {
        if (blob === null) return;

        // Use a FileReader to convert the image Blob to a Base64 Data URL.
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          browser.storage.local.set({ cachedImageDataUrl: base64data });
          resolve(base64data);
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Error processing remote image:', error);
        resolve(FALLBACK_IMAGE);
      });
  });
}

/**
 * Initializes the theme when the addon starts.
 */
async function initialize() {
  const settings = await browser.storage.local.get(['lastColor', 'cachedImageDataUrl']);
  const color = settings.lastColor || DEFAULT_COLOR;
  
  let imageDataUrl = settings.cachedImageDataUrl;

  if (!imageDataUrl) {
    console.log('No cached image found. Fetching remote image...');
    imageDataUrl = await getRemoteImageDataUrl();
  } else {
    console.log('Using cached image.');
    // Re-fetch in the background to get updates for the *next* time the browser starts.
    getRemoteImageDataUrl();
  }
  
  applyTheme(color, imageDataUrl);
}

// ---- MAIN EXECUTION ----

initialize();

browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.lastColor) {
    browser.storage.local.get('cachedImageDataUrl').then(result => {
        applyTheme(changes.lastColor.newValue, result.cachedImageDataUrl || FALLBACK_IMAGE);
    });
  }
});