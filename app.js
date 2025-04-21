// Mock product data
const products = [
    {
        id: 1,
        name: 'Classic Leather Sandals',
        category: 'sandals',
        price: 49.99,
        image: 'Birkenstock_Arizona_sandal.gif',
        description: 'Comfortable leather sandals perfect for everyday wear.',
        colors: ['black', 'brown', 'white'],
        sizes: [6, 7, 8, 9, 10],
        rating: 4.5,
        reviews: 128
    },
    {
        id: 2,
        name: 'Beach Flip Flops',
        category: 'flipflops',
        price: 19.99,
        image: 'resized_flipflops_640x480.webp',
        description: 'Lightweight and durable flip flops for beach days.',
        colors: ['blue', 'red', 'black'],
        sizes: [6, 7, 8, 9, 10],
        rating: 4.2,
        reviews: 75
    },
    {
        id: 3,
        name: 'Running Shoes Pro',
        category: 'shoes',
        price: 89.99,
        image: 'Asics_Gel-Pulse_11.jpg',
        description: 'High-performance running shoes with excellent cushioning.',
        colors: ['black', 'blue', 'red'],
        sizes: [7, 8, 9, 10],
        rating: 4.8,
        reviews: 214
    },
    {
        id: 4,
        name: 'Casual Sneakers',
        category: 'shoes',
        price: 59.99,
        image: 'resized_image_640x480.webp',
        description: 'Stylish sneakers for casual everyday wear.',
        colors: ['white', 'black', 'brown'],
        sizes: [6, 7, 8, 9, 10],
        rating: 4.4,
        reviews: 156
    },
    {
        id: 5,
        name: 'Strappy Sandals',
        category: 'sandals',
        price: 39.99,
        image: 'resized_black_sandals_640x480.jpg',
        description: 'Elegant strappy sandals for a night out.',
        colors: ['black', 'white', 'red'],
        sizes: [6, 7, 8, 9],
        rating: 4.3,
        reviews: 92
    },
    {
        id: 6,
        name: 'Athletic Shoes',
        category: 'shoes',
        price: 79.99,
        image: 'resized_red_sneakers_640x480.jpg',
        description: 'Versatile athletic shoes for various sports activities.',
        colors: ['black', 'blue', 'red'],
        sizes: [7, 8, 9, 10],
        rating: 4.6,
        reviews: 187
    },
    {
        id: 7,
        name: 'Comfort Flip Flops',
        category: 'flipflops',
        price: 24.99,
        image: 'resized_custom_logo_slides_640x480.jpg',
        description: 'Extra comfortable flip flops with arch support.',
        colors: ['black', 'brown', 'blue'],
        sizes: [6, 7, 8, 9, 10],
        rating: 4.1,
        reviews: 63
    },
    {
        id: 8,
        name: 'Formal Dress Shoes',
        category: 'shoes',
        price: 99.99,
        image: 'brogue-shoes-6072988_640x480.jpg',
        description: 'Classic formal shoes for business and special occasions.',
        colors: ['black', 'brown'],
        sizes: [7, 8, 9, 10],
        rating: 4.7,
        reviews: 142
    },
    {
        id: 9,
        name: 'Platform Sandals',
        category: 'sandals',
        price: 54.99,
        image: 'images_640x480.jpg',
        description: 'Trendy platform sandals for added height.',
        colors: ['black', 'white', 'red'],
        sizes: [6, 7, 8, 9],
        rating: 4.0,
        reviews: 58
    }
];

// Shopping cart and wishlist
let cart = [];
let wishlist = [];
let currentCategory = 'all';
let currentFilters = {
    sizes: [],
    colors: [],
    maxPrice: 200
};
let isLoggedIn = false;
let currentUser = null;
let appliedCoupon = null;

// DOM elements
document.addEventListener('DOMContentLoaded', function() {
    // Initialize products
    displayProducts(products);
    
    // Event listeners for category selection
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
    
    // Event listeners for modals
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', closeAllModals);
    });
    
    // Login and signup buttons
    document.getElementById('loginBtn').addEventListener('click', openLoginModal);
    document.getElementById('signupBtn').addEventListener('click', openSignupModal);
    document.getElementById('switchToSignup').addEventListener('click', function(e) {
        e.preventDefault();
        closeAllModals();
        openSignupModal();
    });
    document.getElementById('switchToLogin').addEventListener('click', function(e) {
        e.preventDefault();
        closeAllModals();
        openLoginModal();
    });
    
    // Cart and wishlist buttons
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('wishlistBtn').addEventListener('click', openWishlistModal);
    
    // Form submissions
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    
    // Filter and sort
    document.getElementById('applyFilters').addEventListener('click', applyFilters);
    document.getElementById('sortBy').addEventListener('change', sortProducts);
    document.getElementById('priceRange').addEventListener('input', updatePriceValue);
    
    // Cart functionality
    document.getElementById('applyCoupon').addEventListener('click', applyCoupon);
    document.getElementById('checkoutBtn').addEventListener('click', proceedToCheckout);
    
    // Checkout process
    document.getElementById('continueToPayment').addEventListener('click', continueToPayment);
    document.getElementById('backToShipping').addEventListener('click', backToShipping);
    document.getElementById('placeOrder').addEventListener('click', placeOrder);
    document.getElementById('continueShopping').addEventListener('click', continueShopping);
    document.getElementById('downloadInvoice').addEventListener('click', downloadInvoice);
    
    // Payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
        input.addEventListener('change', togglePaymentDetails);
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeAllModals();
        }
    });
});

// Product display functions
function displayProducts(productsToShow) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (productsToShow.length === 0) {
        productsGrid.innerHTML = '<div class="no-products">No products found matching your criteria.</div>';
        return;
    }
    
    productsToShow.forEach(product => {
        const isInWishlist = wishlist.some(item => item.id === product.id);
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-category">${capitalizeFirstLetter(product.category)}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" data-id="${product.id}">
                        ${isInWishlist ? '♥' : '♡'} Wishlist
                    </button>
                    <button class="primary-btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
        
        // Add event listeners
        productCard.querySelector('.wishlist-btn').addEventListener('click', toggleWishlist);
        productCard.querySelector('.add-to-cart-btn').addEventListener('click', addToCart);
    });
}

function filterProductsByCategory(category) {
    currentCategory = category;
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
        document.getElementById('categoryTitle').textContent = capitalizeFirstLetter(category);
    } else {
        document.getElementById('categoryTitle').textContent = 'All Products';
    }
    
    // Scroll to products section
    document.getElementById('productsSection').scrollIntoView({ behavior: 'smooth' });
    
    // Apply current filters to the category results
    applyCurrentFilters(filteredProducts);
}

function applyFilters() {
    const selectedSizes = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(input => parseInt(input.value));
    const selectedColors = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(input => input.value);
    const maxPrice = parseInt(document.getElementById('priceRange').value);
    
    currentFilters = {
        sizes: selectedSizes,
        colors: selectedColors,
        maxPrice: maxPrice
    };
    
    let filteredProducts = products;
    
    // Filter by category if set
    if (currentCategory !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === currentCategory);
    }
    
    // Apply current filters
    applyCurrentFilters(filteredProducts);
}

function applyCurrentFilters(productsToFilter) {
    let filtered = [...productsToFilter];
    
    // Filter by size
    if (currentFilters.sizes.length > 0) {
        filtered = filtered.filter(product => 
            product.sizes.some(size => currentFilters.sizes.includes(size))
        );
    }
    
    // Filter by color
    if (currentFilters.colors.length > 0) {
        filtered = filtered.filter(product => 
            product.colors.some(color => currentFilters.colors.includes(color))
        );
    }
    
    // Filter by price
    filtered = filtered.filter(product => product.price <= currentFilters.maxPrice);
    
    // Sort products based on current sort option
    const sortOption = document.getElementById('sortBy').value;
    sortProductsList(filtered, sortOption);
}

function sortProducts() {
    const sortOption = document.getElementById('sortBy').value;
    let productsToSort = [...products];
    
    // Filter by category if set
    if (currentCategory !== 'all') {
        productsToSort = productsToSort.filter(product => product.category === currentCategory);
    }
    
    // Apply current filters
    applyCurrentFilters(productsToSort);
}

function sortProductsList(productsList, sortOption) {
    let sortedProducts = [...productsList];
    
    switch (sortOption) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            // For demo purposes, we'll just reverse the order as if newer products are at the end
            sortedProducts.reverse();
            break;
        case 'popularity':
            sortedProducts.sort((a, b) => b.reviews - a.reviews);
            break;
    }
    
    displayProducts(sortedProducts);
}

function updatePriceValue() {
    const value = document.getElementById('priceRange').value;
    document.getElementById('priceValue').textContent = `$${value}`;
}

// Cart functions
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Product added to cart!');
}

function toggleWishlist(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const existingItemIndex = wishlist.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        wishlist.splice(existingItemIndex, 1);
        e.target.classList.remove('active');
        e.target.innerHTML = '♡ Wishlist';
    } else {
        wishlist.push(product);
        e.target.classList.add('active');
        e.target.innerHTML = '♥ Wishlist';
    }
    
    updateWishlistCount();
    showNotification(existingItemIndex !== -1 ? 'Product removed from wishlist!' : 'Product added to wishlist!');
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

function updateWishlistCount() {
    document.getElementById('wishlistCount').textContent = wishlist.length;
}

function openCartModal() {
    renderCartItems();
    updateCartTotals();
    document.getElementById('cartModal').style.display = 'block';
}

function openWishlistModal() {
    renderWishlistItems();
    document.getElementById('wishlistModal').style.display = 'block';
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty.</div>';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
                </div>
            </div>
            <div class="remove-btn" data-id="${item.id}">✕</div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        
        // Add event listeners
        cartItem.querySelector('.decrease-quantity').addEventListener('click', decreaseQuantity);
        cartItem.querySelector('.increase-quantity').addEventListener('click', increaseQuantity);
        cartItem.querySelector('.remove-btn').addEventListener('click', removeFromCart);
    });
}

function renderWishlistItems() {
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    wishlistItemsContainer.innerHTML = '';
    
    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<div class="empty-wishlist">Your wishlist is empty.</div>';
        return;
    }
    
    wishlist.forEach(item => {
        const wishlistItem = document.createElement('div');
        wishlistItem.className = 'wishlist-item';
        wishlistItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="wishlist-item-img">
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <button class="primary-btn add-to-cart-from-wishlist" data-id="${item.id}">Add to Cart</button>
            <div class="remove-btn" data-id="${item.id}">✕</div>
        `;
        
        wishlistItemsContainer.appendChild(wishlistItem);
        
        // Add event listeners
        wishlistItem.querySelector('.add-to-cart-from-wishlist').addEventListener('click', addToCartFromWishlist);
        wishlistItem.querySelector('.remove-btn').addEventListener('click', removeFromWishlist);
    });
}

function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        renderCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += 1;
        renderCartItems();
        updateCartTotals();
        updateCartCount();
    }
}

function removeFromCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    renderCartItems();
    updateCartTotals();
    updateCartCount();
}

function addToCartFromWishlist(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = wishlist.find(item => item.id === productId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCartCount();
    showNotification('Product added to cart!');
}

function removeFromWishlist(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    wishlist = wishlist.filter(item => item.id !== productId);
    
    renderWishlistItems();
    updateWishlistCount();
    
    // Update product cards in the main view
    const wishlistBtn = document.querySelector(`.wishlist-btn[data-id="${productId}"]`);
    if (wishlistBtn) {
        wishlistBtn.classList.remove('active');
        wishlistBtn.innerHTML = '♡ Wishlist';
    }
}

function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    let discount = 0;
    
    if (appliedCoupon) {
        discount = subtotal * (appliedCoupon.discountPercentage / 100);
    }
    
    const total = subtotal - discount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discount').textContent = `$${discount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    
    // Update payment form totals too if checkout modal is open
    if (document.getElementById('checkoutModal').style.display === 'block') {
        document.getElementById('paymentSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('paymentDiscount').textContent = `$${discount.toFixed(2)}`;
        const shippingCost = 5.00;
        document.getElementById('paymentTotal').textContent =document.getElementById('paymentShipping').textContent = `$${shippingCost.toFixed(2)}`;
        document.getElementById('paymentTotal').textContent = `$${(total + shippingCost).toFixed(2)}`;
    }
}

function applyCoupon() {
    const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
    
    // In a real app, this would be validated against a database
    const coupons = {
        'SUMMER20': { code: 'SUMMER20', discountPercentage: 20 },
        'WELCOME10': { code: 'WELCOME10', discountPercentage: 10 }
    };
    
    if (couponCode && coupons[couponCode]) {
        appliedCoupon = coupons[couponCode];
        document.getElementById('couponCode').value = '';
        document.getElementById('couponStatus').textContent = `Coupon "${couponCode}" applied for ${appliedCoupon.discountPercentage}% off`;
        document.getElementById('couponStatus').className = 'success-message';
        updateCartTotals();
    } else {
        document.getElementById('couponStatus').textContent = 'Invalid coupon code';
        document.getElementById('couponStatus').className = 'error-message';
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    if (!isLoggedIn) {
        showNotification('Please log in to checkout', 'error');
        closeAllModals();
        openLoginModal();
        return;
    }
    
    // Close cart modal and open checkout modal
    document.getElementById('cartModal').style.display = 'none';
    renderCheckoutItems();
    updateCartTotals();
    document.getElementById('checkoutModal').style.display = 'block';
    document.getElementById('shippingSection').style.display = 'block';
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'none';
}

function renderCheckoutItems() {
    const checkoutItemsContainer = document.getElementById('checkoutItems');
    checkoutItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
            <div class="checkout-item-info">
                <div class="checkout-item-name">${item.name}</div>
                <div class="checkout-item-quantity">Qty: ${item.quantity}</div>
                <div class="checkout-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `;
        
        checkoutItemsContainer.appendChild(checkoutItem);
    });
}

// Authentication functions
function openLoginModal() {
    document.getElementById('loginModal').style.display = 'block';
}

function openSignupModal() {
    document.getElementById('signupModal').style.display = 'block';
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // In a real app, this would be validated against a database
    if (email && password) {
        isLoggedIn = true;
        currentUser = { email, name: email.split('@')[0] };
        
        updateLoginUI();
        closeAllModals();
        showNotification('Successfully logged in!');
    } else {
        document.getElementById('loginError').textContent = 'Please fill in all fields';
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (!email || !password || !confirmPassword) {
        document.getElementById('signupError').textContent = 'Please fill in all fields';
        return;
    }
    
    if (password !== confirmPassword) {
        document.getElementById('signupError').textContent = 'Passwords do not match';
        return;
    }
    
    // In a real app, this would create a new user in the database
    isLoggedIn = true;
    currentUser = { email, name: email.split('@')[0] };
    
    updateLoginUI();
    closeAllModals();
    showNotification('Account created successfully!');
}

function updateLoginUI() {
    if (isLoggedIn) {
        document.getElementById('authButtons').innerHTML = `
            <span>Welcome, ${currentUser.name}</span>
            <button id="logoutBtn" class="secondary-btn">Logout</button>
        `;
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    } else {
        document.getElementById('authButtons').innerHTML = `
            <button id="loginBtn" class="secondary-btn">Login</button>
            <button id="signupBtn" class="primary-btn">Sign Up</button>
        `;
        document.getElementById('loginBtn').addEventListener('click', openLoginModal);
        document.getElementById('signupBtn').addEventListener('click', openSignupModal);
    }
}

function handleLogout() {
    isLoggedIn = false;
    currentUser = null;
    updateLoginUI();
    showNotification('Successfully logged out!');
}

// Checkout process functions
function continueToPayment() {
    // Validate shipping info
    const name = document.getElementById('shippingName').value;
    const address = document.getElementById('shippingAddress').value;
    const city = document.getElementById('shippingCity').value;
    const zip = document.getElementById('shippingZip').value;
    
    if (!name || !address || !city || !zip) {
        showNotification('Please fill in all shipping details', 'error');
        return;
    }
    
    document.getElementById('shippingSection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
}

function backToShipping() {
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('shippingSection').style.display = 'block';
}

function placeOrder() {
    // Validate payment info
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    
    if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
        showNotification('Please fill in all payment details', 'error');
        return;
    }
    
    // Process order
    const orderNumber = generateOrderNumber();
    document.getElementById('orderNumber').textContent = orderNumber;
    document.getElementById('confirmationDate').textContent = new Date().toLocaleDateString();
    
    // Show confirmation section
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('confirmationSection').style.display = 'block';
    
    // Clear cart
    cart = [];
    updateCartCount();
}

function generateOrderNumber() {
    return 'ORD-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function continueShopping() {
    closeAllModals();
    filterProductsByCategory('all');
}

function downloadInvoice() {
    showNotification('Invoice downloaded!');
    // In a real app, this would generate and download a PDF invoice
}

function togglePaymentDetails() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'card') {
        document.getElementById('cardDetails').style.display = 'block';
        document.getElementById('paypalDetails').style.display = 'none';
    } else if (paymentMethod === 'paypal') {
        document.getElementById('cardDetails').style.display = 'none';
        document.getElementById('paypalDetails').style.display = 'block';
    }
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}