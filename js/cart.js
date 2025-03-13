document.addEventListener('DOMContentLoaded', function() {
    // Cart elements
    const cartContent = document.getElementById('cart-content');
    const cartItemsTable = document.getElementById('cart-items-table');
    const cartEmpty = document.querySelector('.cart-page-empty');
    const cartWithItems = document.querySelector('.cart-with-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');
    const discountAmount = document.querySelector('.discount-amount');
    const totalAmount = document.querySelector('.total-amount');
    const cartCount = document.querySelector('.cart-count');
    
    // Cart functionality
    loadCart();
    
    // Handle quantity changes
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('quantity-btn')) {
            const operation = e.target.getAttribute('data-operation');
            const input = e.target.parentElement.querySelector('input');
            let value = parseInt(input.value);
            
            if (operation === 'increment') {
                input.value = value + 1;
            } else if (operation === 'decrement' && value > 1) {
                input.value = value - 1;
            }
            
            // Update cart
            const row = e.target.closest('.cart-item');
            const id = row.getAttribute('data-id');
            updateCartItemQuantity(id, parseInt(input.value));
        }
    });
    
    // Remove item from cart
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cart-remove') || e.target.closest('.cart-remove')) {
            const row = e.target.closest('.cart-item');
            const id = row.getAttribute('data-id');
            
            // Remove from DOM
            row.classList.add('removing');
            
            // Animation before removal
            setTimeout(() => {
                row.remove();
                removeCartItem(id);
                
                // Update totals
                updateCartTotals();
                
                // Check if cart is empty
                checkIfCartEmpty();
            }, 300);
        }
    });
    
    // Apply coupon
    const couponForm = document.querySelector('.cart-coupon');
    if (couponForm) {
        couponForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const couponInput = this.querySelector('input');
            const couponCode = couponInput.value.trim();
            
            if (!couponCode) {
                showNotification('Please enter a coupon code', 'error');
                return;
            }
            
            // Mock coupon codes
            const validCoupons = {
                'WELCOME10': 10, // 10% discount
                'SUMMER20': 20,  // 20% discount
                'SHOES30': 30    // 30% discount
            };
            
            if (validCoupons[couponCode]) {
                // Apply discount
                const discount = validCoupons[couponCode];
                applyCoupon(discount);
                showNotification(`Coupon applied! ${discount}% off your order`, 'success');
                couponInput.value = '';
            } else {
                showNotification('Invalid coupon code', 'error');
            }
        });
    }
    
    // Update cart button
    const updateCartBtn = document.querySelector('.cart-actions .secondary-btn');
    if (updateCartBtn) {
        updateCartBtn.addEventListener('click', function() {
            // Get all quantity inputs
            const quantityInputs = document.querySelectorAll('.quantity-input');
            let cartUpdated = false;
            
            quantityInputs.forEach(input => {
                const row = input.closest('.cart-item');
                const id = row.getAttribute('data-id');
                const newQuantity = parseInt(input.value);
                
                if (updateCartItemQuantity(id, newQuantity)) {
                    cartUpdated = true;
                }
            });
            
            if (cartUpdated) {
                showNotification('Cart updated', 'success');
                updateCartTotals();
            } else {
                showNotification('No changes made', 'info');
            }
        });
    }
    
    // Load cart contents from localStorage
    function loadCart() {
        const cart = getCartItems();
        
        // Check if cart is empty
        if (cart.length === 0) {
            showEmptyCart();
            return;
        }
        
        // Show cart with items
        hideEmptyCart();
        
        // Clear existing items
        if (cartItemsTable) {
            cartItemsTable.innerHTML = '';
        }
        
        // Add items to cart
        cart.forEach(item => {
            addItemToCartDOM(item);
        });
        
        // Update totals
        updateCartTotals();
    }
    
    // Get cart items from localStorage
    function getCartItems() {
        return JSON.parse(localStorage.getItem('shoeHavenCart')) || [];
    }
    
    // Show empty cart message
    function showEmptyCart() {
        if (cartEmpty && cartWithItems) {
            cartEmpty.style.display = 'block';
            cartWithItems.style.display = 'none';
        }
    }
    
    // Hide empty cart message
    function hideEmptyCart() {
        if (cartEmpty && cartWithItems) {
            cartEmpty.style.display = 'none';
            cartWithItems.style.display = 'block';
        }
    }
    
    // Add item to cart DOM
    function addItemToCartDOM(item) {
        if (!cartItemsTable) return;
        
        const row = document.createElement('tr');
        row.classList.add('cart-item');
        row.setAttribute('data-id', item.id);
        
        // Format color for display
        let colorDisplay = item.color;
        if (item.color.startsWith('rgb')) {
            // If it's an RGB value, create a small colored square
            colorDisplay = `<span class="color-preview" style="background-color: ${item.color}"></span>`;
        }
        
        row.innerHTML = `
            <td data-label="Product">
                <div class="cart-product">
                    <div class="cart-product-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-product-info">
                        <h4>${item.name}</h4>
                        <p class="product-variant">Size: ${item.size} | Color: ${colorDisplay}</p>
                    </div>
                </div>
            </td>
            <td data-label="Price">$${item.price.toFixed(2)}</td>
            <td data-label="Quantity">
                <div class="cart-quantity">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-operation="decrement">-</button>
                        <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input">
                        <button class="quantity-btn" data-operation="increment">+</button>
                    </div>
                </div>
            </td>
            <td data-label="Subtotal" class="cart-total-price">$${(item.price * item.quantity).toFixed(2)}</td>
            <td>
                <button class="cart-remove">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        
        cartItemsTable.appendChild(row);
    }
    
    // Update cart totals
    function updateCartTotals() {
        const cart = getCartItems();
        let subtotal = 0;
        let itemCount = 0;
        
        // Calculate subtotal
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        // Update cart count in nav
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.display = itemCount > 0 ? 'flex' : 'none';
        }
        
        // Get discount if applied
        let discount = 0;
        const appliedDiscount = localStorage.getItem('shoeHavenDiscount');
        
        if (appliedDiscount) {
            discount = (subtotal * parseInt(appliedDiscount)) / 100;
        }
        
        // Calculate total
        const total = subtotal - discount;
        
        // Update DOM
        if (subtotalAmount) subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
        if (discountAmount) discountAmount.textContent = `$${discount.toFixed(2)}`;
        if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
    }
    
    // Update cart item quantity
    function updateCartItemQuantity(id, quantity) {
        const cart = getCartItems();
        let updated = false;
        
        cart.forEach(item => {
            if (item.id === id && item.quantity !== quantity) {
                item.quantity = quantity;
                updated = true;
            }
        });
        
        if (updated) {
            localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
            updateItemSubtotal(id, cart);
            return true;
        }
        
        return false;
    }
    
    // Update item subtotal in DOM
    function updateItemSubtotal(id, cart) {
        const item = cart.find(item => item.id === id);
        if (!item) return;
        
        const row = document.querySelector(`.cart-item[data-id="${id}"]`);
        if (!row) return;
        
        const subtotalCell = row.querySelector('.cart-total-price');
        if (subtotalCell) {
            subtotalCell.textContent = `$${(item.price * item.quantity).toFixed(2)}`;
        }
    }
    
    // Remove cart item
    function removeCartItem(id) {
        const cart = getCartItems();
        const updatedCart = cart.filter(item => item.id !== id);
        
        localStorage.setItem('shoeHavenCart', JSON.stringify(updatedCart));
    }
    
    // Check if cart is empty
    function checkIfCartEmpty() {
        const cart = getCartItems();
        if (cart.length === 0) {
            showEmptyCart();
            
            // Reset discount if cart is empty
            localStorage.removeItem('shoeHavenDiscount');
        }
    }
    
    // Apply coupon
    function applyCoupon(discountPercentage) {
        localStorage.setItem('shoeHavenDiscount', discountPercentage.toString());
        updateCartTotals();
    }
    
    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 20px';
        notification.style.borderRadius = 'var(--border-radius)';
        notification.style.zIndex = '1000';
        notification.style.maxWidth = '300px';
        notification.style.boxShadow = 'var(--box-shadow)';
        notification.style.animation = 'fadeInOut 4s forwards';
        
        // Set color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#4caf50';
            notification.style.color = 'white';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
            notification.style.color = 'white';
        } else if (type === 'info') {
            notification.style.backgroundColor = '#2196F3';
            notification.style.color = 'white';
        }
        
        // Add animation keyframes
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(-20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 4000);
    }
});
