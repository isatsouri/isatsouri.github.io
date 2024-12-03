// Set active language based on current URL
document.addEventListener('DOMContentLoaded', () => {
   const currentLang = window.location.pathname.includes('_gr') ? 'gr' : 'en';
   document.querySelector(`.lang-option[data-lang="${currentLang}"]`).classList.add('active');
});