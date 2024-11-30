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

        this.handleInitialCategory();
    }

    handleInitialCategory() {
        const hash = window.location.hash.substring(1);
        if (hash && hash !== 'all') {
            const categoryLink = document.querySelector(`.nav a[data-category="${hash}"]`);
            if (categoryLink) {
                this.updateActiveNav(categoryLink);
                this.filterImages(hash);
            }
        } else {
            this.filterImages('all');
        }
    }

    initializeEventListeners() {
        document.querySelectorAll('.nav a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                const category = link.dataset.category;
                
                if (!window.location.pathname.includes('contact.html')) {
                    e.preventDefault();
                }
                
                if (category === 'all') {
                    history.pushState(null, null, window.location.pathname);
                } else {
                    history.pushState(null, null, `#${category}`);
                }
                
                this.updateActiveNav(link);
                this.filterImages(category);
            });
        });

        this.modal.onclick = (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        };

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

        let lastTap = 0;
        
        this.modal.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.touchStartY = e.touches[0].clientY;
            
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
                const categories = item.dataset.categories.split(',');
                item.classList.toggle('hidden', !categories.includes('featured'));
            } else {
                const categories = item.dataset.categories.split(',');
                item.classList.toggle('hidden', !categories.includes(category));
            }
        });
    }

    openModal(imgElement) {
        this.modal.style.display = "block";
        this.modalImg.src = imgElement.src;
        
        const captionElement = imgElement.closest('.gallery-item').querySelector('.image-caption h3');
        const caption = captionElement ? captionElement.textContent : '';
        document.getElementById('modalCaption').innerHTML = caption ? `<h3>${caption}</h3>` : '';
        
        const visibleItems = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hidden'));
        this.currentImageIndex = visibleItems.findIndex(item => item.contains(imgElement));
        document.body.style.overflow = 'hidden';

        // Trigger animation
        requestAnimationFrame(() => {
            this.modal.classList.add('show');
        });
    }

    closeModal() {
        this.modal.classList.remove('show');
        
        setTimeout(() => {
            this.modal.style.display = "none";
            document.body.style.overflow = '';
        }, 300);
    }

    handleSwipe(touchEndX, touchEndY) {
        const deltaX = this.touchStartX - touchEndX;
        const deltaY = this.touchStartY - touchEndY;

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const swipeThreshold = 50;
            if (Math.abs(deltaX) > swipeThreshold) {
                if (deltaX > 0) {
                    this.navigate(1);
                } else {
                    this.navigate(-1);
                }
            }
        }
    }

    navigate(direction) {
        const visibleItems = Array.from(this.galleryItems)
            .filter(item => !item.classList.contains('hidden'));
        this.currentImageIndex = 
            (this.currentImageIndex + direction + visibleItems.length) % visibleItems.length;
        
        const nextItem = visibleItems[this.currentImageIndex];
        const nextImage = nextItem.querySelector('img');
        
        // Fade out current image
        this.modalImg.style.opacity = '0';
        
        const captionElement = nextItem.querySelector('.image-caption h3');
        const nextCaption = captionElement ? captionElement.textContent : '';
        
        const tempImage = new Image();
        tempImage.onload = () => {
            setTimeout(() => {
                this.modalImg.src = tempImage.src;
                document.getElementById('modalCaption').innerHTML = nextCaption ? `<h3>${nextCaption}</h3>` : '';
                this.modalImg.style.opacity = '1';
            }, 150);
        };
        tempImage.src = nextImage.src;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const gallery = new Gallery();
    
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        const category = hash || 'all';
        const categoryLink = document.querySelector(`.nav a[data-category="${category}"]`);
        if (categoryLink) {
            gallery.updateActiveNav(categoryLink);
            gallery.filterImages(category);
        }
    });
    
    window.openModal = (imgElement) => gallery.openModal(imgElement);
    window.closeModal = () => gallery.closeModal();
    window.navigate = (direction) => gallery.navigate(direction);
});