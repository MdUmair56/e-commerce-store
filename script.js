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
    if (!product) {
        alert("Product not found!");
        return;
    }


    const detailsContainer = document.getElementById("Product-details");
    const productsContainer = document.getElementById("Products-container");

    // Get similar products by category (excluding the current one)
    const similarProducts = products.filter(p => p.category === product.category && p.id !== product.id);

    // Create similar products HTML
    const recommendedHTML = similarProducts.length > 0 
        ? `<h3>Recommended Products</h3>
           <div class="recommended-products">
               ${similarProducts.slice(0, 4).map(p => `
                   <div class="recommended-product-card">
                       <img src="${p.image}" alt="${p.title}" class="recommended-product-image"/>
                       <h4>${p.title}</h4>
                       <p>INR ${p.price}</p>
                       <button onclick="showproductDetails(${p.id})">View</button>
                       <button onclick="addToCart(${p.id})">Add To Cart</button>
                   </div>
               `).join('')}
           </div>`
        : '';

    detailsContainer.innerHTML = `
        <button onclick="showProducts()">← Back to Products</button>
        <h2>${product.title}</h2>
        <img class="Product-image" src="${product.image}" alt="${product.title}" />
        <p class="price">INR ${product.price}</p>
        <p>${product.description}</p>
        <button onclick="addToCart(${product.id})">Add To Cart</button>
        ${recommendedHTML}
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

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-message">Your Shopping Cart is empty.</p>`;
        cartTotalElement.textContent = "" ;
        cartCountElement.textContent = "0";
        return;
    }

    let total = 0;
    let count = 0;
    let cartHTML = '';


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

    cartTotalElement.textContent = `INR ${total.toFixed(2)}`;
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
        updateCartUI(); 
        modal.style.display = 'block';
        overlay.style.display = 'block';
    }
}


   
 fetchproducts();