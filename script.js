// Sample product data
let products = [
    { id: 1, name: 'T-Shirt', price: 19.99, image: 'https://via.placeholder.com/150?text=T-Shirt' },
    { id: 2, name: 'Jeans', price: 49.99, image: 'https://via.placeholder.com/150?text=Jeans' },
    { id: 3, name: 'Dress', price: 79.99, image: 'https://via.placeholder.com/150?text=Dress' },
    { id: 4, name: 'Jacket', price: 89.99, image: 'https://via.placeholder.com/150?text=Jacket' },
];

// Admin accounts
let adminAccounts = [];

// Current logged in admin
let currentAdmin = null;

// Shopping cart
let cart = [];

// Function to display products
function displayProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(productItem);
    });
}

// Function to add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    updateCartDisplay();
    alert(`${product.name} added to cart!`);
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <span>${item.name} - $${item.price.toFixed(2)}</span>
            <button onclick="removeFromCart(${cart.indexOf(item)})">Remove</button>
        `;
        cartItems.appendChild(cartItem);
        total += item.price;
    });

    cartCount.textContent = cart.length;
    cartTotal.textContent = total.toFixed(2);
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Function to display admin login or panel
function displayAdminSection() {
    const adminSection = document.getElementById('admin-section');
    if (currentAdmin) {
        adminSection.innerHTML = `
            <h2>Welcome, ${currentAdmin.username}!</h2>
            <button onclick="logout()">Logout</button>
            <button onclick="showAddProductForm()">Add New Product</button>
            <div id="product-list"></div>
        `;
        displayProductList();
    } else {
        adminSection.innerHTML = `
            <h2>Admin Login</h2>
            <form id="login-form">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <button onclick="showRegisterForm()">Register</button></p>
        `;
        document.getElementById('login-form').addEventListener('submit', handleLogin);
    }
}

// Function to show registration form
function showRegisterForm() {
    const adminSection = document.getElementById('admin-section');
    adminSection.innerHTML = `
        <h2>Admin Registration</h2>
        <form id="register-form">
            <input type="text" name="username" placeholder="Username" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Register</button>
        </form>
        <button onclick="displayAdminSection()">Back to Login</button>
    `;
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Function to handle registration
function handleRegister(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    if (adminAccounts.some(admin => admin.username === username)) {
        alert('Username already exists. Please choose a different one.');
        return;
    }

    adminAccounts.push({ username, password });
    alert('Registration successful. You can now log in.');
    displayAdminSection();
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const username = form.username.value;
    const password = form.password.value;

    const admin = adminAccounts.find(admin => admin.username === username && admin.password === password);
    if (admin) {
        currentAdmin = admin;
        displayAdminSection();
    } else {
        alert('Invalid username or password');
    }
}

// Function to handle logout
function logout() {
    currentAdmin = null;
    displayAdminSection();
}

// Function to display product list in admin panel
function displayProductList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '<h3>Product List</h3>';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h4>${product.name}</h4>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="showEditProductForm(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(productItem);
    });
}

// Function to show add product form
function showAddProductForm() {
    const adminSection = document.getElementById('admin-section');
    adminSection.innerHTML = `
        <h2>Add New Product</h2>
        <form id="add-product-form">
            <input type="text" name="name" placeholder="Product Name" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <input type="url" name="image" placeholder="Image URL" required>
            <button type="submit">Add Product</button>
        </form>
        <button onclick="displayAdminSection()">Back to Admin Panel</button>
    `;
    document.getElementById('add-product-form').addEventListener('submit', addProduct);
}

// Function to add a new product
function addProduct(event) {
    event.preventDefault();
    const form = event.target;
    const newProduct = {
        id: products.length + 1,
        name: form.name.value,
        price: parseFloat(form.price.value),
        image: form.image.value
    };
    products.push(newProduct);
    displayAdminSection();
    displayProducts();
}

// Function to show edit product form
function showEditProductForm(productId) {
    const product = products.find(p => p.id === productId);
    const adminSection = document.getElementById('admin-section');
    adminSection.innerHTML = `
        <h2>Edit Product</h2>
        <form id="edit-product-form">
            <input type="text" name="name" value="${product.name}" required>
            <input type="number" name="price" value="${product.price}" step="0.01" required>
            <input type="url" name="image" value="${product.image}" required>
            <button type="submit">Update Product</button>
        </form>
        <button onclick="displayAdminSection()">Back to Admin Panel</button>
    `;
    document.getElementById('edit-product-form').addEventListener('submit', (event) => updateProduct(event, productId));
}

// Function to update a product
function updateProduct(event, productId) {
    event.preventDefault();
    const form = event.target;
    const updatedProduct = {
        id: productId,
        name: form.name.value,
        price: parseFloat(form.price.value),
        image: form.image.value
    };
    const index = products.findIndex(p => p.id === productId);
    products[index] = updatedProduct;
    displayAdminSection();
    displayProducts();
}

// Function to delete a product
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== productId);
        displayAdminSection();
        displayProducts();
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    displayAdminSection();
    document.getElementById('checkout-btn').addEventListener('click', () => {
        alert(`Total: $${document.getElementById('cart-total').textContent}\nThank you for your purchase!`);
        cart = [];
        updateCartDisplay();
    });
});