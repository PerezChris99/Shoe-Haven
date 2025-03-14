document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const checkoutForm = document.getElementById('checkout-form');
    const orderSummary = document.querySelector('.order-summary');
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const shippingOptions = document.querySelectorAll('input[name="shipping-method"]');
    const totalElement = document.querySelector('.checkout-total');
    
    // Initialize order summary
    updateOrderSummary();
    
    // Form validation
    checkoutForm?.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Simulate order processing
            showProcessingOverlay();
            
            setTimeout(() => {
                // Clear cart after successful order
                localStorage.removeItem('cartItems');
                
                // Redirect to confirmation page
                window.location.href = 'order-confirmation.html';
            }, 2000);
        }
    });
    
    // Update totals when shipping method changes
    shippingOptions?.forEach(option => {
        option.addEventListener('change', function() {
            updateOrderSummary();
        });
    });
    
    // Toggle payment method details
    paymentOptions?.forEach(option => {
        option.addEventListener('change', function() {
            // Hide all payment details
            document.querySelectorAll('.payment-details').forEach(detail => {
                detail.classList.remove('active');
            });
            
            // Show selected payment details
            const selectedPaymentDetails = document.getElementById(`${this.value}-details`);
            if (selectedPaymentDetails) {
                selectedPaymentDetails.classList.add('active');
            }
        });
    });
    
    // Address same as shipping checkbox
    const sameAsShipping = document.getElementById('same-as-shipping');
    sameAsShipping?.addEventListener('change', function() {
        const billingAddressSection = document.querySelector('.billing-address-section');
        
        if (billingAddressSection) {
            if (this.checked) {
                billingAddressSection.classList.add('hidden');
                copyShippingToBilling();
            } else {
                billingAddressSection.classList.remove('hidden');
            }
        }
    });
    
    function updateOrderSummary() {
        if (!orderSummary) return;
        
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const itemsContainer = orderSummary.querySelector('.order-items') || orderSummary;
        
        // Clear previous items
        itemsContainer.innerHTML = '';
        
        if (cartItems.length === 0) {
            itemsContainer.innerHTML = '<p>Your cart is empty</p>';
            return;
        }
        
        // Add items to summary
        let subtotal = 0;
        
        cartItems.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const itemElement = document.createElement('div');
            itemElement.classList.add('order-item');
            itemElement.innerHTML = `
                <div class="item-image">
                    <img src="${item.imgSrc}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            `;
            
            itemsContainer.appendChild(itemElement);
        });
        
        // Calculate shipping cost
        let shippingCost = 0;
        const selectedShipping = document.querySelector('input[name="shipping-method"]:checked');
        
        if (selectedShipping) {
            shippingCost = parseFloat(selectedShipping.dataset.cost || 0);
        }
        
        // Calculate tax (assume 10%)
        const tax = subtotal * 0.1;
        
        // Calculate total
        const total = subtotal + shippingCost + tax;
        
        // Add summary details
        const summaryElement = document.createElement('div');
        summaryElement.classList.add('order-totals');
        summaryElement.innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>$${shippingCost.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
        `;
        
        itemsContainer.appendChild(summaryElement);
        
        // Update the checkout total if available
        if (totalElement) {
            totalElement.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    function validateForm() {
        // Get all required fields
        const requiredFields = checkoutForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, 'This field is required');
            } else {
                clearError(field);
                
                // Validate specific fields
                if (field.type === 'email' && !validateEmail(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid email address');
                } else if (field.name === 'card-number' && !validateCardNumber(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid card number');
                } else if (field.name === 'card-expiry' && !validateExpiry(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid expiry date (MM/YY)');
                } else if (field.name === 'card-cvv' && !validateCVV(field.value)) {
                    isValid = false;
                    showError(field, 'Please enter a valid CVV code');
                }
            }
        });
        
        return isValid;
    }
    
    function showError(field, message) {
        // Clear any existing error
        clearError(field);
        
        // Add error class
        field.classList.add('error');
        
        // Create error message
        const errorElement = document.createElement('span');
        errorElement.classList.add('error-message');
        errorElement.textContent = message;
        
        // Insert error message after field
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    
    function clearError(field) {
        field.classList.remove('error');
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validateCardNumber(number) {
        const cleaned = number.replace(/\s+/g, '');
        return /^\d{16}$/.test(cleaned);
    }
    
    function validateExpiry(expiry) {
        return /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
    }
    
    function validateCVV(cvv) {
        return /^\d{3,4}$/.test(cvv);
    }
    
    function copyShippingToBilling() {
        const shippingFields = {
            'shipping-firstname': 'billing-firstname',
            'shipping-lastname': 'billing-lastname',
            'shipping-address': 'billing-address',
            'shipping-city': 'billing-city',
            'shipping-state': 'billing-state',
            'shipping-zip': 'billing-zip',
            'shipping-country': 'billing-country'
        };
        
        for (const [shippingField, billingField] of Object.entries(shippingFields)) {
            const sourceField = document.querySelector(`[name="${shippingField}"]`);
            const targetField = document.querySelector(`[name="${billingField}"]`);
            
            if (sourceField && targetField) {
                targetField.value = sourceField.value;
            }
        }
    }
    
    function showProcessingOverlay() {
        const overlay = document.createElement('div');
        overlay.classList.add('processing-overlay');
        overlay.innerHTML = `
            <div class="processing-content">
                <div class="spinner"></div>
                <p>Processing your order...</p>
            </div>
        `;
        
        document.body.appendChild(overlay);
    }
});
