class ThemeManager {
    constructor() {
        this.initializeTheme();
        // Determine if we're in a subdirectory once, at initialization
        this.isSubdirectory = window.location.pathname.includes('/contact/') || 
                             window.location.pathname.includes('/resume/');
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
            const pathPrefix = this.isSubdirectory ? '../' : '';
            themeIcon.src = `${pathPrefix}icons/${theme === 'light' ? 'moon' : 'sun'}.svg`;
        }
    }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    window.toggleTheme = () => themeManager.toggleTheme();
});