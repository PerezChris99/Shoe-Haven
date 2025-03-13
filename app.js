document.addEventListener('DOMContentLoaded', function() {
    // Navigation and Header
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');
    const themeToggle = document.getElementById('theme-toggle');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            backToTopBtn.classList.add('show');
        } else {
            header.classList.remove('scrolled');
            backToTopBtn.classList.remove('show');
        }
    });
    
    // Back to top button functionality
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Theme toggle (dark/light mode)
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeToggle.classList.remove('fa-moon');
            themeToggle.classList.add('fa-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.classList.remove('fa-sun');
            themeToggle.classList.add('fa-moon');
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Check saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.classList.remove('fa-moon');
        themeToggle.classList.add('fa-sun');
    }
    
    // Product filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            productCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    
                    // Add animation
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // About section image gallery
    const galleryImages = document.querySelectorAll('.image-gallery img');
    const mainImage = document.getElementById('imagebox');
    
    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            mainImage.src = this.src;
            
            // Add animation
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 10);
        });
    });
    
    // Product hover effects
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add some animation or effect
            const image = card.querySelector('.product-image img');
            image.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            const image = card.querySelector('.product-image img');
            image.style.transform = 'scale(1)';
        });
    });
    
    // Cart functionality
    const cartBtn = document.querySelector('.cart-btn');
    const cartModal = document.querySelector('.cart-modal');
    const closeCartBtn = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-amount');
    const cartItemCount = document.querySelector('.cart-count');
    
    // Cart array
    let cart = [];
    
    // Open cart modal
    function openCart() {
        cartModal.classList.add('show-cart');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
    
    // Close cart modal
    function closeCart() {
        cartModal.classList.remove('show-cart');
        overlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
    
    // Set up event listeners for cart
    if(cartBtn) cartBtn.addEventListener('click', openCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(overlay) overlay.addEventListener('click', closeCart);
    
    // Add to cart functionality
    if(addToCartBtns) {
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', event => {
                event.preventDefault();
                
                // Get product info
                const card = btn.closest('.product-card');
                const id = card.dataset.id;
                const img = card.querySelector('.product-image img').src;
                const name = card.querySelector('h3').textContent;
                const price = card.querySelector('.price').textContent;
                const numPrice = parseFloat(price.replace(/[^0-9.-]+/g, ''));
                
                // Add item to cart
                addItemToCart(id, name, numPrice, img);
                
                // Show animation
                btn.innerHTML = '<i class="fas fa-check"></i> Added';
                btn.classList.add('added');
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
                    btn.classList.remove('added');
                }, 2000);
            });
        });
    }
    
    // Add item to cart
    function addItemToCart(id, name, price, img) {
        // Check if item already in cart
        const existingItem = cart.find(item => item.id === id);
        
        if(existingItem) {
            // Increase quantity
            existingItem.quantity++;
        } else {
            // Add new item
            const item = {
                id,
                name,
                price,
                img,
                quantity: 1
            };
            cart.push(item);
        }
        
        // Update UI
        updateCart();
        openCart();
        
        // Save cart to local storage
        saveCart();
    }
    
    // Update cart UI
    function updateCart() {
        // Clear cart items container
        cartItemsContainer.innerHTML = '';
        
        // Add each item to cart
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.dataset.id = item.id;
            
            cartItem.innerHTML = `
                <div class="cart-item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn increase" data-id="${item.id}">+</button>
                    </div>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Update cart total
        updateTotal();
        
        // Add event listeners to new buttons
        addCartButtonListeners();
    }
    
    // Update cart total
    function updateTotal() {
        let total = 0;
        let itemCount = 0;
        
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;
        });
        
        if(cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
        if(cartItemCount) {
            cartItemCount.textContent = itemCount;
            if(itemCount > 0) {
                cartItemCount.classList.add('show');
            } else {
                cartItemCount.classList.remove('show');
            }
        }
    }
    
    // Add event listeners to cart buttons
    function addCartButtonListeners() {
        // Remove buttons
        const removeBtns = document.querySelectorAll('.remove-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                removeItem(id);
            });
        });
        
        // Increase buttons
        const increaseBtns = document.querySelectorAll('.qty-btn.increase');
        increaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                increaseQuantity(id);
            });
        });
        
        // Decrease buttons
        const decreaseBtns = document.querySelectorAll('.qty-btn.decrease');
        decreaseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                decreaseQuantity(id);
            });
        });
    }
    
    // Remove item from cart
    function removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        updateCart();
        saveCart();
    }
    
    // Increase item quantity
    function increaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if(item) {
            item.quantity++;
            updateCart();
            saveCart();
        }
    }
    
    // Decrease item quantity
    function decreaseQuantity(id) {
        const item = cart.find(item => item.id === id);
        if(item) {
            item.quantity--;
            if(item.quantity <= 0) {
                removeItem(id);
            } else {
                updateCart();
                saveCart();
            }
        }
    }
    
    // Save cart to local storage
    function saveCart() {
        localStorage.setItem('shoeHavenCart', JSON.stringify(cart));
    }
    
    // Load cart from local storage
    function loadCart() {
        const savedCart = localStorage.getItem('shoeHavenCart');
        if(savedCart) {
            cart = JSON.parse(savedCart);
            updateCart();
        }
    }
    
    // Load cart on page load
    loadCart();
    
    // Form validation
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;
            
            // Simple validation
            if (name.value.trim() === '') {
                showError(name, 'Name is required');
                isValid = false;
            } else {
                removeError(name);
            }
            
            if (email.value.trim() === '') {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email.value)) {
                showError(email, 'Please enter a valid email');
                isValid = false;
            } else {
                removeError(email);
            }
            
            if (message.value.trim() === '') {
                showError(message, 'Message is required');
                isValid = false;
            } else {
                removeError(message);
            }
            
            if (isValid) {
                // Submit form or show success message
                showSuccessMessage(contactForm);
                contactForm.reset();
            }
        });
    }
    
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorElement = formGroup.querySelector('.error-message') || document.createElement('p');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.color = '#ff3860';
        errorElement.style.fontSize = '0.8rem';
        errorElement.style.marginTop = '5px';
        
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
        
        input.style.borderColor = '#ddd';
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showSuccessMessage(form) {
        const successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = 'Your message has been sent successfully!';
        successMsg.style.backgroundColor = '#4caf50';
        successMsg.style.color = 'white';
        successMsg.style.padding = '10px';
        successMsg.style.borderRadius = '5px';
        successMsg.style.marginTop = '20px';
        
        form.appendChild(successMsg);
    }
});