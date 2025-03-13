document.addEventListener('DOMContentLoaded', function() {
    // Product Gallery
    const mainImage = document.querySelector('.main-product-image img');
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    const zoomBtn = document.querySelector('.image-zoom-btn');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomCloseBtn = document.querySelector('.zoom-close-btn');
    const overlay = document.querySelector('.overlay');
    
    // Product Options
    const sizeOptions = document.querySelectorAll('.size-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    const quantityInput = document.querySelector('.quantity-controls input');
    const addToCartBtn = document.querySelector('.add-to-cart');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    // Product Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Review Form
    const ratingStars = document.querySelectorAll('.rating-selector i');
    const reviewForm = document.querySelector('.review-form');
    
    // Product Image Gallery
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Get image source
                const imgSrc = this.querySelector('img').src;
                
                // Fade out main image
                mainImage.style.opacity = '0';
                
                // Change source and fade in after a short delay
                setTimeout(() => {
                    mainImage.src = imgSrc;
                    zoomImage.src = imgSrc;
                    
                    // Fade in
                    setTimeout(() => {
                        mainImage.style.opacity = '1';
                    }, 50);
                }, 300);
            });
        });
    }
    
    // Image Zoom
    if (zoomBtn && zoomModal && overlay) {
        zoomBtn.addEventListener('click', function() {
            zoomModal.style.display = 'flex';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Animate zoom modal
            setTimeout(() => {
                zoomModal.style.opacity = '1';
            }, 10);
        });
        
        // Close zoom modal
        function closeZoom() {
            zoomModal.style.opacity = '0';
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            
            setTimeout(() => {
                zoomModal.style.display = 'none';
            }, 300);
        }
        
        if (zoomCloseBtn) zoomCloseBtn.addEventListener('click', closeZoom);
        if (overlay) overlay.addEventListener('click', closeZoom);
    }
    
    // Size Options
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            if (!option.classList.contains('out-of-stock')) {
                option.addEventListener('click', function() {
                    // Remove active class from all size options
                    sizeOptions.forEach(o => o.classList.remove('active'));
                    
                    // Add active class to clicked option
                    this.classList.add('active');
                });
            }
        });
    }
    
    // Color Options
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                // Remove active class from all color options
                colorOptions.forEach(o => o.classList.remove('active'));
                
                // Add active class to clicked option
                this.classList.add('active');
            });
        });
    }
    
    // Quantity Controls
    if (quantityBtns.length > 0 && quantityInput) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const operation = this.getAttribute('data-operation');
                let value = parseInt(quantityInput.value);
                
                if (operation === 'increment' && value < 10) {
                    value++;
                } else if (operation === 'decrement' && value > 1) {
                    value--;
                }
                
                quantityInput.value = value;
            });
        });
    }
    
    // Product Tabs
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all tabs
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Wishlist Button
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            const icon = this.querySelector('i');
            
            if (this.classList.contains('active')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showFeedback('Added to wishlist!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showFeedback('Removed from wishlist!');
            }
        });
    }
    
    // Review Rating Stars
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            // Highlight on hover
            star.addEventListener('mouseover', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                highlightStars(rating);
            });
            
            // Return to selected rating when mouse leaves
            star.addEventListener('mouseleave', function() {
                const selectedRating = getSelectedRating();
                highlightStars(selectedRating);
            });
            
            // Set rating on click
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                setRating(rating);
                showFeedback(`You rated this product ${rating} stars!`);
            });
        });
        
        function highlightStars(rating) {
            ratingStars.forEach((star, index) => {
                if (index < rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        }
        
        function getSelectedRating() {
            let selected = 0;
            ratingStars.forEach((star, index) => {
                if (star.classList.contains('selected')) {
                    selected = index + 1;
                }
            });
            return selected;
        }
        
        function setRating(rating) {
            ratingStars.forEach((star, index) => {
                star.classList.remove('selected');
                if (index < rating) {
                    star.classList.add('selected');
                }
            });
        }
    }
    
    // Review Form Submission
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const rating = getSelectedRating();
            const title = document.getElementById('review-title').value;
            const content = document.getElementById('review-content').value;
            const name = document.getElementById('review-name').value;
            const email = document.getElementById('review-email').value;
            
            // Validate form
            if (rating === 0) {
                showFeedback('Please select a rating!', 'error');
                return;
            }
            
            if (!title || !content || !name || !email) {
                showFee