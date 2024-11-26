class Gallery {
constructor() {
      this.modal = document.getElementById("imageModal");
      this.modalImg = document.getElementById("modalImage");
      this.galleryItems = document.querySelectorAll('.gallery-item');
      this.currentImageIndex = 0;
      
      if (this.modal) {
         this.initializeEventListeners();
      }
}

initializeEventListeners() {
      // Category filtering
      document.querySelectorAll('.nav a[data-category]').forEach(link => {
         link.addEventListener('click', (e) => {
            e.preventDefault();
            this.updateActiveNav(link);
            this.filterImages(link.dataset.category);
         });
      });

      // Modal events
      this.modal.onclick = (e) => {
         if (e.target === this.modal) {
            this.closeModal();
         }
      };

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
         if (this.modal.style.display === "block") {
            switch(e.key) {
                  case 'ArrowLeft':
                     this.navigate(-1);
                     break;
                  case 'ArrowRight':
                     this.navigate(1);
                     break;
                  case 'Escape':
                     this.closeModal();
                     break;
            }
         }
      });

      // Touch events
      let touchStartX = 0;
      this.modal.addEventListener('touchstart', e => {
         touchStartX = e.changedTouches[0].screenX;
      });

      this.modal.addEventListener('touchend', e => {
         const touchEndX = e.changedTouches[0].screenX;
         this.handleSwipe(touchStartX - touchEndX);
      });
}

updateActiveNav(clickedLink) {
      document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
      clickedLink.classList.add('active');
}

filterImages(category) {
      this.galleryItems.forEach(item => {
         if (category === 'all') {
            item.classList.remove('hidden');
         } else {
            const categories = item.dataset.categories.split(',');
            item.classList.toggle('hidden', !categories.includes(category));
         }
      });
}

openModal(imgElement) {
      this.modal.style.display = "block";
      this.modalImg.src = imgElement.src;
      
      const visibleItems = Array.from(this.galleryItems)
         .filter(item => !item.classList.contains('hidden'));
      this.currentImageIndex = visibleItems
         .findIndex(item => item.contains(imgElement));
}

closeModal() {
      this.modal.style.display = "none";
}

navigate(direction) {
      const visibleItems = Array.from(this.galleryItems)
         .filter(item => !item.classList.contains('hidden'));
      this.currentImageIndex = 
         (this.currentImageIndex + direction + visibleItems.length) % visibleItems.length;
      const nextImage = visibleItems[this.currentImageIndex].querySelector('img');
      this.modalImg.src = nextImage.src;
}

handleSwipe(diff) {
      const swipeThreshold = 50;
      if (Math.abs(diff) > swipeThreshold) {
         if (diff > 0) {
            this.navigate(1); // Swipe left
         } else {
            this.navigate(-1); // Swipe right
         }
      }
}
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
const gallery = new Gallery();

// Expose necessary methods
window.openModal = (imgElement) => gallery.openModal(imgElement);
window.closeModal = () => gallery.closeModal();
window.navigate = (direction) => gallery.navigate(direction);
});