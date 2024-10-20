// cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Wait for DOM to load before executing
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart count
    updateCartCount();

    // Set up event listeners for buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function(event) {
            const productName = event.target.getAttribute('data-name');
            const productPrice = parseFloat(event.target.getAttribute('data-price'));
            addToCart(productName, productPrice);
        });
    });

    document.getElementById('view-cart').addEventListener('click', function() {
        toggleCartDisplay();
    });

    document.getElementById('close-cart').addEventListener('click', function() {
        toggleCartDisplay();
    });

    displayCartItems();
});

// Toggle cart display
function toggleCartDisplay() {
    const cartElement = document.getElementById('cart');
    if (cartElement.style.display === "none") {
        cartElement.style.display = "block";
        displayCartItems();
    } else {
        cartElement.style.display = "none";
    }
}

// Display cart items and total price
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalPrice = 0;

    // Loop through the cart and display each item
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Rs. ${item.price} x ${item.quantity}`;
        cartItemsContainer.appendChild(li);
        totalPrice += item.price * item.quantity; // Calculate total price
    });

    totalPriceElement.textContent = `Total Price: Rs. ${totalPrice}`; // Update total price display
}

// Add item to the cart
function addToCart(productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count displayed in the nav bar
function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = cart.reduce((count, item) => count + item.quantity, 0);
}
