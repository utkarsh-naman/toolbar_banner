document.addEventListener('DOMContentLoaded', () => {
  const colorOptionsContainer = document.getElementById('color-options');
  
  const colors = [
    '#ffffff', '#000000', '#ffeb3b', '#f44336', 
    '#2196f3', '#ff9800', '#4caf50'
  ];

  // Create a swatch for each color
  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.dataset.color = color;
    colorOptionsContainer.appendChild(swatch);

    // Add click event listener to each swatch
    swatch.addEventListener('click', (event) => {
      const currentSelected = document.querySelector('.swatch.selected');
      if (currentSelected) {
        currentSelected.classList.remove('selected');
      }

      const clickedSwatch = event.target;
      clickedSwatch.classList.add('selected');
      const colorToSave = clickedSwatch.dataset.color;

      // NEW LOGIC: Save directly to storage instead of sending a message
      browser.storage.local.set({ lastColor: colorToSave });
    });
  });
});