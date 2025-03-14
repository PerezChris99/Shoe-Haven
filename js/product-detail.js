document.addEventListener('DOMContentLoaded', function() {
    // Product Gallery
    const mainImage = document.querySelector('.main-product-image img');
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    const zoomBtn = document.querySelector('.image-zoom-btn');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomCloseBtn = document.querySelector('.zoom-close-btn');
    const overlay = document.querySelector('.overlay');
    
    // Size & Color Selection
    const sizeOptions = document.querySelectorAll('.size-option');
    const colorOptions = document.querySelectorAll('.color-option');
    
    // Quantity Controls
    const quantityInput = document.querySelector('.quantity-input input');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // Product Actions
    const addToCartBtn = document.querySelector('.add-to-cart');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    
    // Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Review Rating Selector
    const ratingStars = document.querySelectorAll('.rating-selector i');
    
    // Image Gallery Functionality
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(t => t.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image source
                const imgSrc = this.querySelector('img').getAttribute('src');
                mainImage.src = imgSrc;
                if (zoomImage) {
                    zoomImage.src = imgSrc;
                }
            });
        });
    }
    
    // Image Zoom Functionality
    if (zoomBtn && zoomModal && zoomImage) {
        zoomBtn.addEventListener('click', function() {
            zoomModal.style.display = 'flex';
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Set zoom image source to current main image
            zoomImage.src = mainImage.src;
        });
        
        zoomCloseBtn.addEventListener('click', function() {
            zoomModal.style.display = 'none';
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        overlay.addEventListener('click', function() {
            zoomModal.style.display = 'none';
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Size Selection
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            if (!option.classList.contains('out-of-stock')) {
                option.addEventListener('click', function() {
                    sizeOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                });
            }
        });
    }
    
    // Color Selection
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', function() {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Quantity Controls
    if (quantityBtns.length > 0 && quantityInput) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const operation = this.getAttribute('data-operation');
                let currentValue = parseInt(quantityInput.value);
                
                if (operation === 'increment') {
                    quantityInput.value = currentValue + 1;
                } else if (operation === 'decrement' && currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        });
        
        // Prevent negative values on manual input
        quantityInput.addEventListener('change', function() {
            if (this.value < 1) {
                this.value = 1;
            }
        });
    }
    
    // Wishlist Toggle
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
    
    // Tab Functionality
    if (tabButtons.length > 0 && tabContents.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Remove active class from all buttons and content
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to current button and content
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Review Rating Selector
    if (ratingStars.length > 0) {
        ratingStars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Update stars based on selection
                ratingStars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
                setRating(rating);
                showFeedback(`You rated this product ${rating} stars!`);
            });
            
            // Hover effect
            star.addEventListener('mouseenter', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                ratingStars.forEach((s, index) => {
                    if (index < rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
        
        // Reset stars when mouse leaves the container
        const ratingContainer = document.querySelector('.rating-selector');
        if (ratingContainer) {
            ratingContainer.addEventListener('mouseleave', function() {
                // Find any selected rating
                const selectedRating = getSelectedRating();
                
                // Update stars based on current selection
                ratingStars.forEach((s, index) => {
                    if (index < selectedRating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        }
    }
    
    // Review Form Validation
    const reviewForm = document.querySelector('.review-form');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('review-title');
            const content = document.getElementById('review-content');
            const name = document.getElementById('review-name');
            const email = document.getElementById('review-email');
            let isValid = true;
            
            // Simple validation
            if (title.value.trim() === '') {
                showError(title, 'Please enter a review title');
                isValid = false;
            } else {
                removeError(title);
            }
            
            if (content.value.trim() === '') {
                showError(content, 'Please enter your review');
                isValid = false;
            } else {
                removeError(content);
            }
            
            if (name.value.trim() === '') {
                showError(name, 'Please enter your name');
                isValid = false;
            } else {
                removeError(name);
            }
            
            if (email.value.trim() === '') {
                showError(email, 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(email);
            }
            
            if (isValid) {
                // Submit form or show success message
                showSuccessMessage(reviewForm);
                reviewForm.reset();
                
                // Reset stars
                ratingStars.forEach(s => {
                    s.classList.remove('fas');
                    s.classList.add('far');
                });
            }
        });
    }
    
    // Helper functions for form validation
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('p');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ff3860';
        errorElement.style.fontSize = '1.2rem';
        errorElement.style.marginTop = '0.5rem';
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorElement);
        }
        
        input.style.borderColor = '#ff3860';
    }
    
    function removeError(input) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            formGroup.removeChild(errorElement);
        }
        
        input.style.borderColor = '';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showSuccessMessage(form) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Your review has been submitted successfully!';
        successMsg.style.backgroundColor = '#4caf50';
        successMsg.style.color = 'white';
        successMsg.style.padding = '1rem';
        successMsg.style.borderRadius = 'var(--border-radius)';
        successMsg.style.marginTop = '2rem';
        
        form.appendChild(successMsg);
        
        // Remove success message after 3 seconds
        setTimeout(() => {
            form.removeChild(successMsg);
        }, 3000);
    }
    
    // Add to Cart Functionality from Product Detail Page
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get selected options
            const selectedSize = document.querySelector('.size-option.active');
            const selectedColor = document.querySelector('.color-option.active');
            
            if (!selectedSize) {
                alert('Please select a size');
                return;
            }
            
            if (!selectedColor) {
                alert('Please select a color');
                return;
            }
            
            // Get product details
            const productName = document.querySelector('.product-info-details h1').textContent;
            const productPrice = document.querySelector('.product-info-details .price').textContent;
            const productImage = document.querySelector('.main-product-image img').src;
            const quantity = parseInt(quantityInput.value);
            const size = selectedSize.textContent;
            const color = window.getComputedStyle(selectedColor).backgroundColor;
            
            // Create product object
            const product = {
                id: new Date().getTime().toString(),
                name: productName,
                price: parseFloat(productPrice.replace(/[^\d.]/g, '')),
                image: productImage,
                quantity: quantity,
                size: size,
                color: color
            };
            
            // Add to cart (use localStorage)
            addProductToCart(product);
            
            // Show confirmation
            this.innerHTML = '<i class="fas fa-check"></i> Added to Cart';
            this.classList.add('added');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                this.classList.remove('added');
            }, 2000);
        });
    }
    
    function addProductToCart(product) {
        let cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
        
        // Check if product already exists with same size and color
        const existingProductIndex = cart.findIndex(item => 
            item.name === product.name && 
            item.size === product.size && 
            item.color === product.color
        );
        
        if (existingProductIndex > -1) {
            // Update quantity if product exists
            cart[existingProductIndex].quantity += product.quantity;
        } else {
            // Add new product
            cart.push(product);
        }
        
        // Update cart count in nav
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            let totalItems = 0;
            cart.forEach(item => {
                totalItems += item.quantity;
            });
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
        
        // Save to localStorage
        localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
    }
    
    // Feedback Notification System
    function showFeedback(message, type = 'info') {
        // Create feedback element if it doesn't exist
        let feedback = document.querySelector('.feedback-notification');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'feedback-notification';
            document.body.appendChild(feedback);
        }
        
        // Clear any existing classes and set new ones
        feedback.className = 'feedback-notification';
        feedback.classList.add(type);
        
        // Set message
        feedback.textContent = message;
        
        // Show feedback
        feedback.classList.add('active');
        
        // Hide feedback after 3 seconds
        setTimeout(() => {
            feedback.classList.remove('active');
        }, 3000);
    }
    
    // Helper function to add item to cart
    function addItemToCart(item) {
        // Get existing cart from localStorage
        let cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
        
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(cartItem => 
            cartItem.id === item.id && 
            cartItem.size === item.size && 
            cartItem.color === item.color
        );
        
        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item if it doesn't exist
            cart.push(item);
        }
        
        // Save updated cart to localStorage
        localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
    }
    
    // Helper function to update cart count in header
    function updateCartCount() {
        const cartCountElement = document.querySelector('.cart-count');
        if (!cartCountElement) return;
        
        // Get cart from localStorage
        const cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
        
        // Calculate total quantity
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart count element
        cartCountElement.textContent = totalItems;
        
        // Show cart count if there are items
        if (totalItems > 0) {
            cartCountElement.classList.add('active');
        } else {
            cartCountElement.classList.remove('active');
        }
    }
    
    // Initialize cart count on page load
    updateCartCount();
});