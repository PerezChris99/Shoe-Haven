
// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
  // Navigation
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const header = document.querySelector('header');
  const backToTop = document.querySelector('.back-to-top');
  const themeToggle = document.getElementById('theme-toggle');
  
  // Product Elements
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');
  
  // Cart Elements
  const cartBtns = document.querySelectorAll('.add-to-cart');
  const cartModal = document.querySelector('.cart-modal');
  const cartCloseBtn = document.querySelector('.cart-close-btn');
  const overlay = document.querySelector('.overlay');
  const cartIcon = document.querySelector('.cart-icon');
  
  // Mobile Menu Toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
      
      // Transform hamburger into X
      const spans = hamburger.querySelectorAll('span');
      if (hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
  }
  
  // Header scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
      backToTop.classList.add('active');
    } else {
      header.classList.remove('scrolled');
      backToTop.classList.remove('active');
    }
  });
  
  // Back to top functionality
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // Dark mode toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      
      // Save preference to localStorage
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
    
    // Check for saved user preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark-mode');
    }
  }
  
  // Product filtering
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all buttons
        filterBtns.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        
        productCards.forEach(card => {
          if (filterValue === 'all') {
            card.style.display = 'block';
          } else {
            if (card.classList.contains(filterValue)) {
              card.style.display = 'block';
            } else {
              card.style.display = 'none';
            }
          }
        });
      });
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
          const productName = card.querySelector('h3')?.textContent || 'Product Name';
          const productPrice = card.querySelector('.price')?.textContent || '$0';
          const productImg = card.querySelector('img')?.src || '';
          
          // Add to cart
          addToCart(productName, productPrice, productImg);
        }
      });
    });
  }
  
  // Product Gallery on product detail page
  const mainProductImage = document.querySelector('.main-product-image img');
  const productThumbnails = document.querySelectorAll('.product-thumbnail');
  
  if (mainProductImage && productThumbnails.length > 0) {
    productThumbnails.forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        // Update main image
        const imgSrc = thumbnail.querySelector('img').src;
        mainProductImage.src = imgSrc;
        
        // Update active thumbnail
        productThumbnails.forEach(thumb => thumb.classList.remove('active'));
        thumbnail.classList.add('active');
      });
    });
  }
  
  // Product tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
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
  
  // Size selector
  const sizeOptions = document.querySelectorAll('.size-option');
  
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
  
  // Color selector
  const colorOptions = document.querySelectorAll('.color-option');
  
  if (colorOptions.length > 0) {
    colorOptions.forEach(option => {
      option.addEventListener('click', () => {
        colorOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
      });
    });
  }
  
  // Quantity selector
  const quantityInput = document.querySelector('.quantity-input input');
  const quantityBtns = document.querySelectorAll('.quantity-btn');
  
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

function addToCart(name, price, imgSrc) {
  const cartItems = document.querySelector('.cart-items');
  if (!cartItems) return;
  
  // Create new cart item
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  
  cartItem.innerHTML = `
    <div class="cart-item-img">
      <img src="${imgSrc}" alt="${name}">
    </div>
    <div class="cart-item-info">
      <h4 class="cart-item-title">${name}</h4>
      <div class="cart-item-price">${price}</div>
      <div class="cart-item-details">Size: 42, Color: Black</div>
      <div class="cart-item-actions">
        <div class="cart-item-quantity">
          <button class="cart-quantity-btn" data-operation="decrement">-</button>
          <span>1</span>
          <button class="cart-quantity-btn" data-operation="increment">+</button>
        </div>
        <button class="remove-item-btn">Remove</button>
      </div>
    </div>
  `;
  
  // Add to cart
  cartItems.appendChild(cartItem);
  
  // Update cart total
  updateCartTotal();
  
  // Add event listeners for new item
  const removeBtn = cartItem.querySelector('.remove-item-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      cartItem.remove();
      updateCartTotal();
    });
  }
  
  const quantityBtns = cartItem.querySelectorAll('.cart-quantity-btn');
  const quantitySpan = cartItem.querySelector('.cart-item-quantity span');
  
  if (quantityBtns.length > 0 && quantitySpan) {
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const operation = btn.getAttribute('data-operation');
        let currentValue = parseInt(quantitySpan.textContent);
        
        if (operation === 'increment') {
          quantitySpan.textContent = currentValue + 1;
        } else if (operation === 'decrement' && currentValue > 1) {
          quantitySpan.textContent = currentValue - 1;
        }
        
        updateCartTotal();
      });
    });
  }
  
  // Open cart
  openCart();
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

// Animation on scroll initialization
function initAOS() {
  AOS.init({
    duration: 1000,
    easing: 'ease-in-out',
    once: true,
    mirror: false
  });
}
