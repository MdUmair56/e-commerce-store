let products = [];
let cart = [];

function fetchproducts(){
    fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {
        console.log(data);
        products = data;
        displayproducts()
    })
    .catch(error => console.log(error))
}

function displayproducts() {
    const container = document.getElementById("Products-container")
    container.innerHTML = products.map(product => {
        return(
            `<div class= "product-cart">
                <img class="Product-image" src="${product.image}" alt="${product.title}"/>
                <h3>${product.title}</h3>
                <p class="price">INR ${product.price}</p>
                <button onclick="showproductDetails(${product.id})">view Details</button>
                <button onclick="addToCart(${product.id})">Add To Cart</button>
            </div>`
        );
    }).join('')
}

function showProducts() {
    document.getElementById("Products-container").style.display = 'grid';
    document.getElementById("Product-details").style.display = 'none';
}

function showproductDetails(productId) {
    const product = products.find(p => p.id === productId);
    const detailsContainer = document.getElementById("Product-details");
    const productsContainer = document.getElementById("Products-container");

    detailsContainer.innerHTML = `
        <button onclick="showProducts()">← Back to Products</button>
        <h2>${product.title}</h2>
        <img class="Product-image" src="${product.image}" alt="${product.title}" />
        <p class="price">INR ${product.price}</p>
        <p>${product.description}</p>
        <button onclick="addToCart(${product.id})">Add To Cart</button>
    `;

    productsContainer.style.display = 'none';
    detailsContainer.style.display = 'block';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotalElement = document.getElementById("cart-total");
    const cartCountElement = document.querySelector(".cart-count");

    cartItemsContainer.innerHTML = "";

    let total = 0;
    let count = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        const itemHTML = `
            <div class="cart-product">
                <img src="${item.image}" alt="${item.title}" class="cart-product-image"/>
                <div>
                    <h4>${item.title}</h4>
                    <p>Price: INR ${item.price}</p>
                    <p>
                        Quantity: 
                        <button onclick="changeQuantity(${item.id}, -1)">-</button>
                        ${item.quantity}
                        <button onclick="changeQuantity(${item.id}, 1)">+</button>
                    </p>
                </div>
                <button onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;

        cartItemsContainer.innerHTML += itemHTML;
    });

    cartTotalElement.textContent = total.toFixed(2);
    cartCountElement.textContent = count;
}

function changeQuantity(productId, delta) {
    const item = cart.find(p => p.id === productId);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== productId);
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(p => p.id !== productId);
    updateCartUI();
}

function tooglecart() {
    const modal = document.getElementById("cart-modal");
    const overlay = document.getElementById("overlay");

    const isOpen = modal.style.display === 'block';

    if (isOpen) {
        modal.style.display = 'none';
        overlay.style.display = 'none';
    } else {
        updateCartUI(); // 👈 Populate the cart before showing it
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
}

// function addToCart(productId){
//     const product = products.find(p => p.id === productId);/
//        if (product) {
//         cart.push(product);
//         alert(`${product.title} added to cart!`);
//     }.join('')
// }
   
 fetchproducts();