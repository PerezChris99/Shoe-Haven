document.addEventListener('DOMContentLoaded', function() {
    // Navigation and Header Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const backToTop = document.querySelector('.back-to-top');
    const themeToggle = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle');
    const overlay = document.querySelector('.overlay');
    
    // Toggle mobile menu
    hamburger?.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
        hamburger.classList.toggle('active');
        overlay?.classList.toggle('active');
    });

    // Sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('sticky');
            backToTop?.classList.add('show');
            header.classList.add('scrolled');
        } else {
            header.classList.remove('sticky');
            backToTop?.classList.remove('show');
            header.classList.remove('scrolled');
        }
    });

    // Back to top functionality
    backToTop?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Theme toggle functionality
    if (themeToggle) {
        // Check for saved theme preference or use device preference
        const savedTheme = localStorage.getItem('theme') || 
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply saved theme on page load
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        updateToggleButton(savedTheme === 'dark');
        
        // Add event listener to theme toggle button
        themeToggle.addEventListener('click', function() {
            // Toggle dark theme
            const isDarkMode = document.body.classList.toggle('dark-theme');
            
            // Save preference to localStorage
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            
            // Update button appearance
            updateToggleButton(isDarkMode);
        });
    }

    // Initialize cart on page load
    updateCartUI();
    updateCartTotal();
    
    // Add event listeners to cart buttons
    const cartButtons = document.querySelectorAll('.cart-btn');
    cartButtons.forEach(button => {
        button.addEventListener('click', () => openCart());
    });
    
    const closeCartButtons = document.querySelectorAll('.close-cart');
    closeCartButtons.forEach(button => {
        button.addEventListener('click', () => closeCart());
    });
    
    // Add event listeners to add-to-cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const product = e.target.closest('.product');
            const name = product.querySelector('.product-title').textContent;
            const priceText = product.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace('$', ''));
            const imgSrc = product.querySelector('img').src;
            
            addToCart(name, price, imgSrc);
        });
    });

    // Close modals when clicking on overlay
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (navLinks.classList.contains('active') || navLinks.classList.contains('nav-active')) {
                hamburger.classList.remove('active');
                hamburger.classList.remove('toggle');
                navLinks.classList.remove('active');
                navLinks.classList.remove('nav-active');
            }
            
            closeCart();
            overlay.classList.remove('active');
        });
    }

    // Product filtering functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(filterBtn => {
                filterBtn.classList.remove('active');
            });
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Initialize animations
    initAOS();
});

// Function to update toggle button appearance/text
function updateToggleButton(isDarkMode) {
    const themeToggle = document.getElementById('theme-toggle') || document.querySelector('.theme-toggle');
    if (!themeToggle) return;
    
    // Get icon element (assuming the icon is already in the HTML)
    const icon = themeToggle.querySelector('i') || themeToggle;
    if (icon) {
        // Update icon classes based on the current theme
        if (isDarkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
}

// Cart Functions
function openCart() {
    const cart = document.querySelector('.cart-sidebar') || document.querySelector('.cart-modal');
    cart.classList.add('open');
    document.body.classList.add('no-scroll');
    
    // Add overlay or activate existing one
    const existingOverlay = document.querySelector('.overlay');
    if (existingOverlay) {
        existingOverlay.classList.add('active');
    } else {
        const overlay = document.createElement('div');
        overlay.classList.add('cart-overlay');
        overlay.addEventListener('click', closeCart);
        document.body.appendChild(overlay);
    }
}

function closeCart() {
    const cart = document.querySelector('.cart-sidebar') || document.querySelector('.cart-modal');
    if (cart) {
        cart.classList.remove('open');
        document.body.classList.remove('no-scroll');
    }
    
    // Handle either overlay type
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) {
        cartOverlay.remove();
    }
    
    const pageOverlay = document.querySelector('.overlay');
    if (pageOverlay) {
        pageOverlay.classList.remove('active');
    }
}

function addToCart(name, price, imgSrc) {
    // Get or initialize cart items from localStorage
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if item is already in cart
    const existingItem = cartItems.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name,
            price,
            imgSrc,
            quantity: 1
        });
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Update cart UI
    updateCartUI();
    updateCartTotal();
    
    // Show notification
    showNotification(`Added ${name} to cart!`);
    
    // Open the cart
    openCart();
}

function updateCartUI() {
    const cartItemsContainer = document.querySelector('.cart-items');
    if (!cartItemsContainer) return;
    
    cartItemsContainer.innerHTML = '';
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        return;
    }
    
    cartItems.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        
        cartItem.innerHTML = `
            <img src="${item.imgSrc}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-name="${item.name}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" data-name="${item.name}">+</button>
                </div>
            </div>
            <button class="remove-item" data-name="${item.name}">×</button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Add event listeners for quantity buttons and remove buttons
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(btn.dataset.name, -1));
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', () => updateItemQuantity(btn.dataset.name, 1));
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
    });
}

function updateItemQuantity(name, change) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
        cartItems[itemIndex].quantity += change;
        
        if (cartItems[itemIndex].quantity <= 0) {
            cartItems.splice(itemIndex, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartUI();
        updateCartTotal();
    }
}

function removeFromCart(name) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const itemIndex = cartItems.findIndex(item => item.name === name);
    
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        updateCartUI();
        updateCartTotal();
        showNotification(`Removed ${name} from cart!`);
    }
}

function updateCartTotal() {
    const totalElement = document.querySelector('.cart-total-amount');
    if (!totalElement) return;
    
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    const total = cartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
    }, 0);
    
    totalElement.textContent = `$${total.toFixed(2)}`;
    
    // Update cart badge
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
        cartBadge.textContent = itemCount;
        cartBadge.style.display = itemCount > 0 ? 'block' : 'none';
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Animation on scroll initialization
function initAOS() {
    // If AOS library is loaded
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    } else {
        // Fallback for simple animations if AOS is not available
        const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
}
