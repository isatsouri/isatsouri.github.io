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
      const themeToggle = document.querySelector('.theme-toggle i');
      if (themeToggle) {
         themeToggle.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
      }
}
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
const themeManager = new ThemeManager();
window.toggleTheme = () => themeManager.toggleTheme();
});