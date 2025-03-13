document.addEventListener('DOMContentLoaded', function() {
    // Cart elements
    const cartContent = document.getElementById('cart-content');
    const cartItemsTable = document.getElementById('cart-items-table');
    const emptyCartMessage = document.querySelector('.cart-page-empty');
    const cartWithItems = document.querySelector('.cart-with-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const discountAmount = document.querySelector('.discount-amount');
    const totalAmount = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    
    // Cart storage
    let cart = [];
    
    // Load cart from localStorage
    function loadCart() {
        const savedCart = localStorage.getItem('shoeHavenCart');
        
        if (savedCart) {
            cart = JSON.parse(savedCart);
            updateCartDisplay();
        } else {
            showEmptyCart();
        }
    }
    
    // Show empty cart message
    function showEmptyCart() {
        if (emptyCartMessage && cartWithItems) {
            emptyCartMessage.style.display = 'block';
            cartWithItems.style.display = 'none';
        }
    }
    
    // Show cart with items
    function showCartWithItems() {
        if (emptyCartMessage && cartWithItems) {
            emptyCartMessage.style.display = 'none';
            cartWithItems.style.display = 'block';
        }
    }
    
    // Update cart display
    function updateCartDisplay() {
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }
        
        showCartWithItems();
        
        if (cartItemsTable) {
            // Clear existing items
            cartItemsTable.innerHTML = '';
            
            // Add cart items to table
            cart.forEach(item => {
                const tr = document.createElement('tr');
                tr.classList.add('cart-item');
                tr.dataset.id = item.id;
                
                const subtotal = (item.price * item.quantity).toFixed(2);
                
                tr.innerHTML = `
                    <td data-label="Product">
                        <div class="cart-product">
                            <div class="cart-product-img">
                                <img src="${item.img}" alt="${item.name}">
                            </div>
                            <div class="cart-product-info">
                                <h4>${item.name}</h4>
                                <p class="product-variant">Size: ${item.size || 40} | Color: ${item.color || 'Default'}</p>
                            </div>
                        </div>
                    </td>
                    <td data-label="Price">$${item.price.toFixed(2)}</td>
                    <td data-label="Quantity">
                        <div class="cart-quantity">
                            <div class="quantity-controls">
                                <button class="quantity-btn decrement" data-id="${item.id}">-</button>
                                <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-id="${item.id}">
                                <button class="quantity-btn increment" data-id="${item.id}">+</button>
                            </div>
                        </div>
                    </td>
                    <td data-label="Subtotal" class="cart-total-price">$${subtotal}</td>
                    <td>
                        <button class="cart-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                `;
                
                cartItemsTable.appendChild(tr);
            });
            
            // Add event listeners to quantity buttons and remove buttons
            addCartEventListeners();
            
            // Update totals
            updateCartTotals();
        }
    }
    
    // Update cart totals
    function updateCartTotals() {
        let subtotal = 0;
        let discount = 0;
        let total = 0;
        let itemCount = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        // Apply discount if there's a coupon
        // This is a placeholder - you would implement your own coupon logic
        const couponCode = localStorage.getItem('shoeHavenCoupon');
        if (couponCode === 'DISCOUNT10') {
            discount = subtotal * 0.1;
        }
        
        total = subtotal - discount;
        
        // Update display
        if (subtotalAmount) subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
        if (discountAmount) discountAmount.textContent = `$${discount.toFixed(2)}`;
        if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
        
        // Update cart count badge
        if (cartCount) {
            cartCount.textContent = itemCount;
            if (itemCount > 0) {
                cartCount.classList.add('show');
            } else {
                cartCount.classList.remove('show');
            }
        }
    }
    
    // Add event listeners to cart elements
    function addCartEventListeners() {
        // Quantity increment buttons
        const incrementBtns = document.querySelectorAll('.quantity-btn.increment');
        incrementBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                incrementQuantity(id);
            });
        });
        
        // Quantity decrement buttons
        const decrementBtns = document.querySelectorAll('.quantity-btn.decrement');
        decrementBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                decrementQuantity(id);
            });
        });
        
        // Quantity input fields
        const quantityInputs = document.querySelectorAll('.quantity-input');
        quantityInputs.forEach(input => {
            input.addEventListener('change', () => {
                const id = input.getAttribute('data-id');
                const newQuantity = parseInt(input.value);
                updateQuantity(id, newQuantity);
            });
        });
        
        // Remove buttons
        const removeBtns = document.querySelectorAll('.cart-remove');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                removeItem(id);
            });
        });
    }
    
    // Increment item quantity
    function incrementQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item && item.quantity < 10) {
            item.quantity++;
            saveCart();
            updateCartDisplay();
        }
    }
    
    // Decrement item quantity
    function decrementQuantity(id) {
        const item = cart.find(item => item.id === id);
        if (item && item.quantity > 1) {
            item.quantity--;
            saveCart();
            updateCartDisplay();
        }
    }
    
    // Update item quantity directly
    function updateQuantity(id, quantity) {
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity = Math.max(1, Math.min(10, quantity)); // Limit between 1 and 10
            saveCart();
            updateCartDisplay();
        }
    }
    
    // Remove item from cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartDisplay();
        
        // Show animation feedback
        showFeedback('Item removed from cart!');
    }
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
    }
    
    // Apply coupon
    const couponForm = document.querySelector('.cart-coupon');
    if (couponForm) {
        couponForm.addEventListener('click', function(e) {
            if (e.target.classList.contains('primary-btn')) {
                e.preventDefault();
                const couponInput = couponForm.querySelector('input');
                const couponCode = couponInput.value.trim();
                
                if (couponCode) {
                    // This is a simple example - you would validate the coupon on your server
                    if (couponCode === 'DISCOUNT10') {
                        localStorage.setItem('shoeHavenCoupon', couponCode);
                        updateCartTotals();
                        showFeedback('Coupon applied successfully!', 'success');
                    } else {
                        showFeedback('Invalid coupon code!', 'error');
                    }
                }
            }
        });
    }
    
    // Update cart button
    const updateCartBtn = document.querySelector('.cart-actions .secondary-btn');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            updateCartDisplay();
            showFeedback('Cart updated!', 'success');
        });
    }
    
    // Show feedback message
    function showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.classList.add('feedback-message', type);
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        // Show with animation
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 500);
        }, 3000);
    }
    
    // Load cart when page loads
    loadCart();
    
    // Add product recommendations slider functionality
    const productCards = document.querySelectorAll('.recommendations .product-card');
    
    if (productCards.length > 0) {
        productCards.forEach(card => {
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                const image = card.querySelector('.product-image img');
                image.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                const image = card.querySelector('.product-image img');
                image.style.transform = 'scale(1)';
            });
            
            // Add to cart functionality
            const addToCartBtn = card.querySelector('.add-to-cart');
            if (addToCartBtn) {
                addToCartBtn.addEventListener('click', () => {
                    const id = card.dataset.id;
                    const name = card.querySelector('h3').textContent;
                    const priceText = card.querySelector('.price').textContent;
                    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
                    const img = card.querySelector('.product-image img').src;
                    
                    // Check if item is already in cart
                    const existingItem = cart.find(item => item.id === id);
                    
                    if (existingItem) {
                        existingItem.quantity++;
                    } else {
                        cart.push({
                            id,
                            name,
                            price,
                            img,
                            quantity: 1
                        });
                    }
                    
                    // Save and update
                    saveCart();
                    updateCartDisplay();
                    
                    // Show animation feedback
                    addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added';
                    addToCartBtn.classList.add('added');
                    
                    setTimeout(() => {
                        addToCartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                        addToCartBtn.classList.remove('added');
                    }, 2000);
                    
                    showFeedback('Item added to cart!', 'success');
                });
            }
        });
    }
});
