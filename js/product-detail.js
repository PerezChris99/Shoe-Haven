document.addEventListener('DOMContentLoaded', function() {
    // Product image gallery
    const mainImage = document.querySelector('.product-main-image img');
    const thumbnails = document.querySelectorAll('.product-thumbnail');
    
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    
    // Quantity control
    const quantityInput = document.querySelector('.quantity-input');
    const increaseBtn = document.querySelector('.quantity-increase');
    const decreaseBtn = document.querySelector('.quantity-decrease');
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.product-add-to-cart');
    
    // Image gallery functionality
    thumbnails?.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Update main image
            if (mainImage) {
                mainImage.src = this.src.replace('-thumbnail', '');
                mainImage.alt = this.alt;
                
                // Update active thumbnail
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Size selection
    sizeOptions?.forEach(option => {
        option.addEventListener('click', function() {
            // Update active size
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update hidden input if exists
            const sizeInput = document.querySelector('input[name="selected-size"]');
            if (sizeInput) {
                sizeInput.value = this.dataset.size;
            }
        });
    });
    
    // Quantity control
    increaseBtn?.addEventListener('click', function() {
        if (quantityInput) {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        }
    });
    
    decreaseBtn?.addEventListener('click', function() {
        if (quantityInput && parseInt(quantityInput.value) > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    });
    
    // Add to cart functionality
    addToCartBtn?.addEventListener('click', function() {
        // Get product details
        const productName = document.querySelector('.product-title')?.textContent;
        const productPrice = parseFloat(document.querySelector('.product-price')?.textContent.replace(/[^0-9.]/g, ''));
        const productImage = mainImage?.src || document.querySelector('.product-image img')?.src;
        const selectedSize = document.querySelector('.size-option.active')?.dataset.size || 'One Size';
        const quantity = parseInt(quantityInput?.value || 1);
        
        if (productName && productPrice && productImage) {
            // Add to cart with size and quantity
            for (let i = 0; i < quantity; i++) {
                addToCart(productName, productPrice, productImage);
            }
            
            // Show confirmation message
            showProductAddedMessage(productName, selectedSize);
        }
    });
    
    // Product description tabs
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons?.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    function showProductAddedMessage(productName, size) {
        const message = document.createElement('div');
        message.classList.add('product-added-message');
        message.innerHTML = `
            <div class="message-content">
                <i class="fas fa-check-circle"></i>
                <p>${productName} (${size}) has been added to your cart!</p>
                <button class="view-cart">View Cart</button>
                <button class="close-message">Continue Shopping</button>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Show message with animation
        setTimeout(() => message.classList.add('show'), 10);
        
        // Add event listeners to buttons
        message.querySelector('.view-cart').addEventListener('click', function() {
            message.remove();
            openCart();
        });
        
        message.querySelector('.close-message').addEventListener('click', function() {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(message)) {
                message.classList.remove('show');
                setTimeout(() => message.remove(), 300);
            }
        }, 5000);
    }
});