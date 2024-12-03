class LanguageManager {
   constructor() {
       this.initializeLanguage();
       this.setupLanguageToggle();
   }

   initializeLanguage() {
       // Get saved language or detect from URL
       const savedLang = localStorage.getItem('language');
       const currentLang = window.location.pathname.includes('_gr') ? 'gr' : 'en';
       
       if (savedLang && savedLang !== currentLang) {
           // Redirect to correct language version
           this.switchToLanguage(savedLang);
       } else {
           localStorage.setItem('language', currentLang);
           this.updateActiveLanguage(currentLang);
       }
   }

   setupLanguageToggle() {
       document.querySelectorAll('.lang-option').forEach(option => {
           option.addEventListener('click', (e) => {
               e.preventDefault();
               const newLang = option.dataset.lang;
               this.switchToLanguage(newLang);
           });
       });
   }

   switchToLanguage(lang) {
    localStorage.setItem('language', lang);
    
    const currentPath = window.location.pathname;
    
    // Special handling for root/index
    if (currentPath === '/' || currentPath.endsWith('index.html')) {
        window.location.href = lang === 'gr' ? 'index_gr.html' : 'index_en.html';
        return;
    }
    
    // Normal path handling for other pages
    const basePath = currentPath.replace(/(_en|_gr)?\.html$/, '');
    const newPath = lang === 'gr' ? `${basePath}_gr.html` : `${basePath}_en.html`;
    window.location.href = newPath;
    }

   updateActiveLanguage(lang) {
       document.querySelectorAll('.lang-option').forEach(option => {
           option.classList.toggle('active', option.dataset.lang === lang);
       });
   }
}

document.addEventListener('DOMContentLoaded', () => {
   new LanguageManager();
});