class MobileMenu {
   constructor() {
       this.menuToggle = document.querySelector('.menu-toggle');
       this.themeToggle = document.querySelector('.theme-toggle');
       this.nav = document.querySelector('.nav');
       this.overlay = document.querySelector('.menu-overlay');
       this.modal = document.getElementById('imageModal');
       this.isMenuOpen = false;

       this.initializeMenu();
   }

   initializeMenu() {
       // Toggle menu
       this.menuToggle.addEventListener('click', () => {
           // Only allow toggle if modal doesn't exist or is not open
           if (!this.modal || this.modal.style.display !== 'block') {
               this.toggleMenu();
           }
       });

       // Close menu when clicking overlay
       this.overlay.addEventListener('click', () => this.closeMenu());

       // Close menu when clicking a link
       document.querySelectorAll('.nav a').forEach(link => {
           link.addEventListener('click', () => this.closeMenu());
       });

       // Close menu on escape key
       document.addEventListener('keydown', (e) => {
           if (e.key === 'Escape' && this.isMenuOpen) {
               this.closeMenu();
           }
       });

       // Handle modal state changes if modal exists
       if (this.modal) {
           this.observeModal();
       }
   }

   observeModal() {
       const observer = new MutationObserver((mutations) => {
           mutations.forEach((mutation) => {
               if (mutation.attributeName === 'style') {
                   const isModalOpen = this.modal.style.display === 'block';
                   if (isModalOpen) {
                       this.menuToggle.style.visibility = 'hidden';
                       this.themeToggle.style.visibility = 'hidden';
                       this.closeMenu();
                   } else {
                       this.menuToggle.style.visibility = 'visible';
                       this.themeToggle.style.visibility = 'visible';
                   }
               }
           });
       });

       observer.observe(this.modal, {
           attributes: true,
           attributeFilter: ['style']
       });
   }

   toggleMenu() {
       this.isMenuOpen = !this.isMenuOpen;
       this.nav.classList.toggle('active');
       this.overlay.classList.toggle('active');
       // Update icon
       const menuIcon = this.menuToggle.querySelector('.icon');
       if (this.isMenuOpen) {
           menuIcon.style.display = 'none';
           this.menuToggle.innerHTML += '<i class="fas fa-times"></i>';
       } else {
           menuIcon.style.display = 'block';
           const closeIcon = this.menuToggle.querySelector('.fas');
           if (closeIcon) closeIcon.remove();
       }
       document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
   }

   closeMenu() {
       if (this.isMenuOpen) {
           this.isMenuOpen = false;
           this.nav.classList.remove('active');
           this.overlay.classList.remove('active');
           // Reset to menu icon
           const menuIcon = this.menuToggle.querySelector('.icon');
           menuIcon.style.display = 'block';
           const closeIcon = this.menuToggle.querySelector('.fas');
           if (closeIcon) closeIcon.remove();
           document.body.style.overflow = '';
       }
   }
}

// Initialize mobile menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
   new MobileMenu();
});