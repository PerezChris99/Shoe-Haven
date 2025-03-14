document.addEventListener('DOMContentLoaded', function() {
    // Get theme toggle button
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply saved theme on page load
    document.body.classList.toggle('dark-theme', savedTheme === 'dark');
    updateToggleButton(savedTheme === 'dark');
    
    // Add event listener to theme toggle button
    themeToggle?.addEventListener('click', function() {
        // Toggle dark theme
        const isDarkMode = document.body.classList.toggle('dark-theme');
        
        // Save preference to localStorage
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        
        // Update button appearance
        updateToggleButton(isDarkMode);
    });
    
    // Function to update toggle button appearance/text
    function updateToggleButton(isDarkMode) {
        if (!themeToggle) return;
        
        // Update button icon/text based on current theme
        if (themeToggle.querySelector('i')) {
            // If using icons
            const icon = themeToggle.querySelector('i');
            if (isDarkMode) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        } else {
            // If using text
            themeToggle.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
        }
    }
});
