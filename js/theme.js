class ThemeManager {
      constructor() {
          this.initializeTheme();
      }
  
      initializeTheme() {
          const savedTheme = localStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-theme', savedTheme);
          this.updateThemeToggleIcon(savedTheme);
      }
  
      toggleTheme() {
          const currentTheme = document.documentElement.getAttribute('data-theme');
          const newTheme = currentTheme === 'light' ? 'dark' : 'light';
          
          document.documentElement.setAttribute('data-theme', newTheme);
          localStorage.setItem('theme', newTheme);
          this.updateThemeToggleIcon(newTheme);
      }
  
      updateThemeToggleIcon(theme) {
          const themeIcon = document.getElementById('theme-icon');
          if (themeIcon) {
              themeIcon.src = `icons/${theme === 'light' ? 'moon' : 'sun'}.svg`;
          }
      }
  }
  
  // Initialize theme manager when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
      const themeManager = new ThemeManager();
      window.toggleTheme = () => themeManager.toggleTheme();
  });