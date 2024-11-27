class Gallery {
    constructor() {
        this.modal = document.getElementById("imageModal");
        this.modalImg = document.getElementById("modalImage");
        this.galleryItems = document.querySelectorAll('.gallery-item');
        this.currentImageIndex = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        
        if (this.modal) {
            this.initializeEventListeners();
        }

        // Handle initial category from URL
        this.handleInitialCategory();
    }

    handleInitialCategory() {
        const hash = window.location.hash.substring(1); // Remove the # symbol
        if (hash && hash !== 'all') {
            const categoryLink = document.querySelector(`.nav a[data-category="${hash}"]`);
            if (categoryLink) {
                this.updateActiveNav(categoryLink);
                this.filterImages(hash);
            }
        } else {
            // Add this else block to handle initial page load
            this.filterImages('all'); // This will show only featured items
        }
    }

    initializeEventListeners() {
        // Category filtering
        document.querySelectorAll('.nav a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                const category = link.dataset.category;
                
                // Only prevent default if we're already on index.html
                if (!window.location.pathname.includes('contact.html')) {
                    e.preventDefault();
                }
                
                // Update URL hash without triggering scroll
                if (category === 'all') {
                    history.pushState(null, null, window.location.pathname);
                } else {
                    history.pushState(null, null, `#${category}`);
                }
                
                this.updateActiveNav(link);
                this.filterImages(category);
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
        let lastTap = 0;
        
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            
            // Double tap prevention
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
                e.preventDefault();
            }
            lastTap = currentTime;
        }, false);

        this.modal.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(touchEndX, touchEndY);
        }, false);
    }

    updateActiveNav(clickedLink) {
        document.querySelectorAll('.nav a').forEach(a => a.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    filterImages(category) {
        this.galleryItems.forEach(item => {
            if (category === 'all') {
                // Show only featured items in overview
                const categories = item.dataset.categories.split(',');
                item.classList.toggle('hidden', !categories.includes('featured'));
            } else {
                const categories = item.dataset.categories.split(',');
                item.classList.toggle('hidden', !categories.includes(category));
            }
        });
    }

    // openModal(imgElement) {
    //     this.modal.style.display = "block";
    //     this.modalImg.src = imgElement.src;
        
    //     // Find the index of current image
    //     const visibleItems = Array.from(this.galleryItems)
    //         .filter(item => !item.classList.contains('hidden'));
    //     this.currentImageIndex = visibleItems
    //         .findIndex(item => item.contains(imgElement));

    //     // Prevent body scrolling when modal is open
    //     document.body.style.overflow = 'hidden';
    // }
    openModal(imgElement) {
        this.modal.style.display = "block";
        this.modalImg.src = imgElement.src;
        
        // error handling for caption
        const captionElement = imgElement.closest('.gallery-item').querySelector('.image-caption h3');
        const caption = captionElement ? captionElement.textContent : '';
        document.getElementById('modalCaption').innerHTML = caption ? `<h3>${caption}</h3>` : '';
        
        const visibleItems = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hidden'));
        this.currentImageIndex = visibleItems.findIndex(item => item.contains(imgElement));
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = "none";
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }

    handleSwipe(touchEndX, touchEndY) {
        const deltaX = this.touchStartX - touchEndX;
        const deltaY = this.touchStartY - touchEndY;

        // Only handle horizontal swipes
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const swipeThreshold = 50;
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.navigate(1); // Swipe left
                } else {
                    this.navigate(-1); // Swipe right
                }
            }
        }
    }

    // navigate(direction) {
    //     const visibleItems = Array.from(this.galleryItems)
    //         .filter(item => !item.classList.contains('hidden'));
    //     this.currentImageIndex = 
    //         (this.currentImageIndex + direction + visibleItems.length) % visibleItems.length;
        
    //     // Create temporary image to handle loading
    //     const tempImage = new Image();
    //     tempImage.onload = () => {
    //         this.modalImg.src = tempImage.src;
    //     };
    //     tempImage.src = visibleItems[this.currentImageIndex].querySelector('img').src;
    // }
    navigate(direction) {
        const visibleItems = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hidden'));
        this.currentImageIndex = 
            (this.currentImageIndex + direction + visibleItems.length) % visibleItems.length;
        
        const nextItem = visibleItems[this.currentImageIndex];
        const nextImage = nextItem.querySelector('img');
        
        // error handling for caption
        const captionElement = nextItem.querySelector('.image-caption h3');
        const nextCaption = captionElement ? captionElement.textContent : '';
        
        const tempImage = new Image();
        tempImage.onload = () => {
            this.modalImg.src = tempImage.src;
            document.getElementById('modalCaption').innerHTML = nextCaption ? `<h3>${nextCaption}</h3>` : '';
        };
        tempImage.src = nextImage.src;
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        const category = hash || 'all';
        const categoryLink = document.querySelector(`.nav a[data-category="${category}"]`);
        if (categoryLink) {
            gallery.updateActiveNav(categoryLink);
            gallery.filterImages(category);
        }
    });
    
    // Expose necessary methods
    window.openModal = (imgElement) => gallery.openModal(imgElement);
    window.closeModal = () => gallery.closeModal();
    window.navigate = (direction) => gallery.navigate(direction);
});