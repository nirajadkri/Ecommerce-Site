// cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Wait for DOM to load before executing
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    
    // Setup event listener for clearing cart
    document.getElementById('clear-cart').addEventListener('click', function() {
        localStorage.removeItem('cart');
        cart = [];
        displayCartItems(); // Refresh the displayed cart items
    });
});

// Display cart items and total price
function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceElement = document.getElementById('total-price');

    cartItemsContainer.innerHTML = ''; // Clear previous items
    let totalPrice = 0;

    // Loop through the cart and display each item
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - Rs. ${item.price} x ${item.quantity} = Rs. ${item.price * item.quantity}`;
        cartItemsContainer.appendChild(li);
        totalPrice += item.price * item.quantity; // Calculate total price
    });

    totalPriceElement.textContent = `Total Price: Rs. ${totalPrice}`; // Update total price display
}
