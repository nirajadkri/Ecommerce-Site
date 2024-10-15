// Sample product data
let products = [
    { id: 1, name: 'T-Shirt', price: 19.99, image: 'https://example.com/tshirt.jpg' },
    { id: 2, name: 'Jeans', price: 49.99, image: 'https://example.com/jeans.jpg' },
    { id: 3, name: 'Dress', price: 79.99, image: 'https://example.com/dress.jpg' },
    { id: 4, name: 'Jacket', price: 89.99, image: 'https://example.com/jacket.jpg' },
];

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

// Function to add product to cart (placeholder)
function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
    // Implement actual cart functionality here
}

// Function to display admin panel
function displayAdminPanel() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `
        <h2>Admin Panel</h2>
        <button onclick="showAddProductForm()">Add New Product</button>
        <div id="product-list"></div>
    `;
    displayProductList();
}

// Function to display product list in admin panel
function displayProductList() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price.toFixed(2)}</p>
            <button onclick="showEditProductForm(${product.id})">Edit</button>
            <button onclick="deleteProduct(${product.id})">Delete</button>
        `;
        productList.appendChild(productItem);
    });
}

// Function to show add product form
function showAddProductForm() {
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `
        <h2>Add New Product</h2>
        <form id="add-product-form">
            <input type="text" name="name" placeholder="Product Name" required>
            <input type="number" name="price" placeholder="Price" step="0.01" required>
            <input type="url" name="image" placeholder="Image URL" required>
            <button type="submit">Add Product</button>
        </form>
        <button onclick="displayAdminPanel()">Back to Admin Panel</button>
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
    displayAdminPanel();
    displayProducts();
}

// Function to show edit product form
function showEditProductForm(productId) {
    const product = products.find(p => p.id === productId);
    const adminPanel = document.getElementById('admin-panel');
    adminPanel.innerHTML = `
        <h2>Edit Product</h2>
        <form id="edit-product-form">
            <input type="text" name="name" value="${product.name}" required>
            <input type="number" name="price" value="${product.price}" step="0.01" required>
            <input type="url" name="image" value="${product.image}" required>
            <button type="submit">Update Product</button>
        </form>
        <button onclick="displayAdminPanel()">Back to Admin Panel</button>
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
    displayAdminPanel();
    displayProducts();
}

// Function to delete a product
function deleteProduct(productId) {
    products = products.filter(p => p.id !== productId);
    displayAdminPanel();
    displayProducts();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    displayAdminPanel();
});