document.addEventListener('DOMContentLoaded', function() {
    // Product Gallery Elements
    const mainProductImage = document.querySelector('.main-product-image img');
    const productThumbnails = document.querySelectorAll('.product-thumbnail');
    const zoomBtn = document.querySelector('.image-zoom-btn');
    const zoomModal = document.querySelector('.zoom-modal');
    const zoomImage = document.getElementById('zoom-image');
    const zoomCloseBtn = document.querySelector('.zoom-close-btn');
    
    // Product Selection Elements
    const sizeOptions = document.querySelectorAll('.size-option');
    const colorOptions = document.querySelectorAll('.color-option');
    const quantityInput = document.querySelector('.quantity-input input');
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    
    // Product Actions
    const addToCartBtn = document.querySelector('.add-to-cart');
    const wishlistBtn = document.querySelector('.wishlist-btn');
    const cartBtns = document.querySelectorAll('.add-to-cart');
    
    // Cart Elements
    const cartModal = document.querySelector('.cart-modal');
    const cartCloseBtn = document.querySelector('.cart-close-btn');
    const overlay = document.querySelector('.overlay');
    const cartIcon = document.querySelector('.cart-icon');
    
    // Tab Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Review Elements
    const ratingStars = document.querySelectorAll('.rating-selector i');
    
    // Product Gallery Functionality
    if (mainProductImage && productThumbnails.length > 0) {
        productThumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', () => {
                // Update main image
                const imgSrc = thumbnail.querySelector('img').src;
                mainProductImage.src = imgSrc;
                
                // Update active thumbnail
                productThumbnails.forEach(thumb => thumb.classList.remove('active'));
                thumbnail.classList.add('active');
                
                // Update zoom image if it exists
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
            zoomImage.src = mainProductImage.src;
        });
        
        zoomCloseBtn.addEventListener('click', function() {
            zoomModal.style.display = 'none';
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    }
    
    // Size Selection
    if (sizeOptions.length > 0) {
        sizeOptions.forEach(option => {
            if (!option.classList.contains('out-of-stock')) {
                option.addEventListener('click', () => {
                    sizeOptions.forEach(opt => opt.classList.remove('active'));
                    option.classList.add('active');
                });
            }
        });
    }
    
    // Color Selection
    if (colorOptions.length > 0) {
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
            });
        });
    }
    
    // Quantity Controls
    if (quantityInput && quantityBtns.length > 0) {
        quantityBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const operation = btn.getAttribute('data-operation');
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
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }
    
    // Tab Functionality
    if (tabBtns.length > 0 && tabContents.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons and contents
                tabBtns.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Show corresponding content
                const tabId = btn.getAttribute('data-tab');
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
                
                // Update hidden input
                const ratingInput = document.querySelector('.rating-selector input[type="hidden"]');
                if (ratingInput) {
                    ratingInput.value = rating;
                }
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
                const selectedRating = document.querySelector('.rating-selector input[type="hidden"]');
                const rating = selectedRating ? parseInt(selectedRating.value) : 0;
                
                // Update stars based on current selection
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
    
    // Cart functionality
    if (cartIcon) {
        cartIcon.addEventListener('click', openCart);
    }
    
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', closeCart);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCart);
    }
    
    if (cartBtns.length > 0) {
        cartBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation effect
                const btnIcon = btn.querySelector('i');
                btnIcon.classList.remove('fa-shopping-cart');
                btnIcon.classList.add('fa-check');
                btn.classList.add('added');
                
                // Reset after animation
                setTimeout(() => {
                    btnIcon.classList.remove('fa-check');
                    btnIcon.classList.add('fa-shopping-cart');
                    btn.classList.remove('added');
                }, 1500);
                
                // Get product data
                const card = btn.closest('.product-card') || btn.closest('.product-details-container');
                if (card) {
                    let productName, productPrice, productImg, productSize, productColor, productQuantity;
                    
                    // Check if on product detail page or listing page
                    if (btn.closest('.product-details-container')) {
                        // Product detail page
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
                        
                        productName = card.querySelector('h1')?.textContent || 'Product Name';
                        productPrice = card.querySelector('.price')?.textContent || '$0';
                        productImg = document.querySelector('.main-product-image img')?.src || '';
                        productSize = selectedSize.textContent;
                        productColor = getComputedStyle(selectedColor).backgroundColor;
                        productQuantity = parseInt(quantityInput?.value || 1);
                    } else {
                        // Product listing page
                        productName = card.querySelector('h3')?.textContent || 'Product Name';
                        productPrice = card.querySelector('.price')?.textContent || '$0';
                        productImg = card.querySelector('img')?.src || '';
                        productSize = 'Default';
                        productColor = 'Default';
                        productQuantity = 1;
                    }
                    
                    // Create product object
                    const product = {
                        id: new Date().getTime().toString(),
                        name: productName,
                        price: parseFloat(productPrice.replace(/[^\d.]/g, '')),
                        image: productImg,
                        quantity: productQuantity,
                        size: productSize,
                        color: productColor
                    };
                    
                    // Add to cart
                    addToCart(product);
                }
            });
        });
    }
});

// Cart Functions
function openCart() {
    const cartModal = document.querySelector('.cart-modal');
    const overlay = document.querySelector('.overlay');
    
    if (cartModal && overlay) {
        cartModal.classList.add('open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCart() {
    const cartModal = document.querySelector('.cart-modal');
    const overlay = document.querySelector('.overlay');
    
    if (cartModal && overlay) {
        cartModal.classList.remove('open');
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
    const cartItems = document.querySelector('.cart-items');
    
    if (!cartItems) return;
    
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
    
    // Create cart item element
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <h4 class="cart-item-title">${item.name}</h4>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-details">Size: ${item.size}, Color: ${item.color}</div>
                <div class="cart-item-actions">
                    <div class="cart-item-quantity">
                        <button class="cart-quantity-btn" data-id="${item.id}" data-operation="decrement">-</button>
                        <span>${item.quantity}</span>
                        <button class="cart-quantity-btn" data-id="${item.id}" data-operation="increment">+</button>
                    </div>
                    <button class="remove-item-btn" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Add event listeners for quantity control and remove
    setupCartItemEvents();
    
    // Update total
    updateCartTotal();
    
    // Open cart
    openCart();
}

function setupCartItemEvents() {
    // Handle quantity buttons
    document.querySelectorAll('.cart-quantity-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const operation = btn.getAttribute('data-operation');
            const id = btn.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
            
            const item = cart.find(item => item.id === id);
            if (item) {
                if (operation === 'increment') {
                    item.quantity++;
                } else if (operation === 'decrement' && item.quantity > 1) {
                    item.quantity--;
                }
                
                // Update localStorage
                localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
                
                // Update display
                const quantitySpan = btn.parentElement.querySelector('span');
                quantitySpan.textContent = item.quantity;
                
                // Update total
                updateCartTotal();
            }
        });
    });
    
    // Handle remove buttons
    document.querySelectorAll('.remove-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            let cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
            
            // Filter out the item
            cart = cart.filter(item => item.id !== id);
            
            // Update localStorage
            localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
            
            // Remove from DOM
            btn.closest('.cart-item').remove();
            
            // Update total
            updateCartTotal();
            
            // Update cart count
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let totalItems = 0;
                cart.forEach(item => {
                    totalItems += item.quantity;
                });
                cartCount.textContent = totalItems;
                cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        });
    });
}

function updateCartTotal() {
    const cartItems = document.querySelectorAll('.cart-item');
    const cartTotalAmount = document.querySelector('.cart-total-amount');
    
    if (cartTotalAmount) {
        let total = 0;
        
        cartItems.forEach(item => {
            const price = item.querySelector('.cart-item-price').textContent.replace(/[^0-9.]/g, '');
            const quantity = parseInt(item.querySelector('.cart-item-quantity span').textContent);
            total += price * quantity;
        });
        
        cartTotalAmount.textContent = `$${total.toFixed(2)}`;
    }
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
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
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

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    // Load cart data from localStorage
    const cart = JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
    
    // Update cart count
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        let totalItems = 0;
        cart.forEach(item => {
            totalItems += item.quantity;
        });
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
});
