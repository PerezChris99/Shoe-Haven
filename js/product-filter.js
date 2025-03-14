document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const priceRange = document.getElementById('price-range');
    const priceOutput = document.getElementById('price-value');
    const searchInput = document.getElementById('search-products');
    const sortSelect = document.getElementById('sort-products');
    const productContainer = document.querySelector('.products-container');
    
    // Initialize price filter if elements exist
    if (priceRange && priceOutput) {
        priceOutput.textContent = `$0 - $${priceRange.value}`;
        
        priceRange.addEventListener('input', function() {
            priceOutput.textContent = `$0 - $${this.value}`;
            filterProducts();
        });
    }
    
    // Category filter
    filterBtns?.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            filterProducts();
        });
    });
    
    // Search filter
    searchInput?.addEventListener('input', filterProducts);
    
    // Sort products
    sortSelect?.addEventListener('change', filterProducts);
    
    function filterProducts() {
        // Get filter values
        const activeCategory = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
        const maxPrice = priceRange ? parseInt(priceRange.value) : Infinity;
        const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
        const sortBy = sortSelect ? sortSelect.value : 'default';
        
        // Get all products
        const products = document.querySelectorAll('.product');
        
        products.forEach(product => {
            // Get product data
            const category = product.dataset.category;
            const price = parseInt(product.dataset.price || 
                          product.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || 0);
            const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
            
            // Apply filters
            const categoryMatch = activeCategory === 'all' || category === activeCategory;
            const priceMatch = price <= maxPrice;
            const searchMatch = title.includes(searchTerm);
            
            // Show/hide product based on filters
            if (categoryMatch && priceMatch && searchMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
        
        // Sort products
        sortProducts(sortBy);
    }
    
    function sortProducts(sortBy) {
        const products = Array.from(document.querySelectorAll('.product:not([style*="display: none"])'));
        const container = document.querySelector('.products-container');
        
        if (!container) return;
        
        products.sort((a, b) => {
            const priceA = parseInt(a.dataset.price || a.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || 0);
            const priceB = parseInt(b.dataset.price || b.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || 0);
            
            switch (sortBy) {
                case 'price-low':
                    return priceA - priceB;
                case 'price-high':
                    return priceB - priceA;
                case 'name-az':
                    return a.querySelector('.product-title').textContent.localeCompare(
                        b.querySelector('.product-title').textContent
                    );
                case 'name-za':
                    return b.querySelector('.product-title').textContent.localeCompare(
                        a.querySelector('.product-title').textContent
                    );
                default:
                    return 0;
            }
        });
        
        // Clear container and append sorted products
        container.innerHTML = '';
        products.forEach(product => container.appendChild(product));
    }
    
    // Initialize filters on page load
    filterProducts();
});
