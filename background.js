const DEFAULT_COLOR = '#a0cfff';

/**
 * Applies the theme to the browser.
 * This version makes the toolbar transparent to show the background image.
 * @param {string} color The hex color code for the window frame.
 */
function applyTheme(color) {
  browser.theme.update({
    images: {
      additional_backgrounds: ["penguin.svg"]
    },
    properties: {
      additional_backgrounds_alignment: ["right"],
      additional_backgrounds_tiling: ["no-repeat"]
    },
    colors: {
      // Use the selected color for the very top of the window frame
      frame: color, 
      
      // Make the main toolbar transparent so the background image shows through
      toolbar: 'transparent',
      
      // Make the URL bar transparent too
      toolbar_field: 'transparent',
      toolbar_field_border: 'transparent',
      
      // Set text colors to black so they are readable against the background
      tab_background_text: '#000000',
      toolbar_field_text: '#000000',
      toolbar_text: '#000000',
      bookmark_text: '#000000'
    }
  });
}

/**
 * Initializes the theme when the addon starts.
 * This runs on browser startup, addon install, and addon reload.
 */
function initialize() {
  browser.storage.local.get('lastColor').then(result => {
    const initialColor = result.lastColor || DEFAULT_COLOR;
    applyTheme(initialColor);
  });
}

// ---- Main Execution ----

// Run the initialization once when the script first loads
initialize();

// Listen for a color change from the popup (via storage)
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.lastColor) {
    applyTheme(changes.lastColor.newValue);
  }
});