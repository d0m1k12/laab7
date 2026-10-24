let globalStoreProducts = [];

let cart = [];

const container = document.querySelector(".products-grid");
const loader = document.getElementById("loader");

async function fetchProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products?limit=8");

    if (!response.ok) {
      throw new Error(`HTTP помилка: ${response.status}`);
    }

    const realProducts = await response.json();
    
    return realProducts;
  } catch (error) {
    console.error("Помилка завантаження товарів:", error.message);
    throw error;
  }
}

async function initShop() { 
  if (loader) loader.classList.remove("hidden");
  if (container) container.innerHTML = "";

  try {
    const data = await fetchProducts();

    globalStoreProducts = data;
    
    if (loader) loader.classList.add("hidden");

    const htmlString = data.map((product) => {
        return `
            <div class="product-card" draggable="true" data-id="${product.id}">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <h3 class="product-title">${product.title}</h3>
                <span class="product-price">$${product.price}</span>
                <button class="btn-buy" data-id="${product.id}">Купити</button>
            </div>
        `;
    }).join("");

    if (container) container.innerHTML = htmlString;  

  } catch (error) {
    if (loader) loader.classList.add("hidden");
    if (container) container.innerHTML = `<p class="error">Помилка: ${error.message}</p>`;
  }
}

initShop();

if (container) {
  container.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-buy")) {
      const productId = parseInt(event.target.dataset.id);
      const selectedProduct = globalStoreProducts.find(p => p.id === productId);
      if (selectedProduct) {
        addToCart(selectedProduct);
      }
    }
  });

  container.addEventListener("dragstart", (event) => {
    if (event.target.classList.contains("product-card")) {
      event.dataTransfer.setData("text/plain", event.target.dataset.id);
      event.target.classList.add("dragging");
    }
  });

  container.addEventListener("dragend", (event) => {
    if (event.target.classList.contains("product-card")) {
      event.target.classList.remove("dragging");
    }
  });
}

const favoritesZone = document.getElementById("favoritesZone");
if (favoritesZone) {
  favoritesZone.addEventListener("dragover", (event) => {
    event.preventDefault(); 
    favoritesZone.classList.add("drag-over");
  });

  favoritesZone.addEventListener("dragleave", () => {
    favoritesZone.classList.remove("drag-over");
  });

  favoritesZone.addEventListener("drop", (event) => {
    event.preventDefault();
    favoritesZone.classList.remove("drag-over");

    const productId = event.dataTransfer.getData("text/plain");
    if (productId) {
      favoritesZone.innerHTML += `<div class="fav-item">Товар #${productId} дод. в улюблене</div>`;
    }
  });
}


function addToCart(product) {
  const existingProduct = cart.find(p => p.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateUI();
}

function calculateTotal() {
  return cart.reduce(
    (total, product) => total + product.price * product.quantity, 0);
}

function renderCartItems() {
  const cartItemsContainer = document.getElementById("cartItemsContainer");
  const cartTotalSum = document.getElementById("cartTotalSum");

  if (!cartItemsContainer || !cartTotalSum) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<p>Кошик порожній.</p>`;
    cartTotalSum.textContent = "0";
    return;
  }

  const html = cart.map(item => `
    <div class="cart-item">
      <div>
        <h4>${item.title}</h4>
        <p>$${item.price} x ${item.quantity} = <strong>$${item.price * item.quantity}</strong></p>
      </div>
      <div class="cart-item-controls">
        <button class="btn-decrease" data-id="${item.id}">-</button>
        <span>${item.quantity}</span>
        <button class="btn-increase" data-id="${item.id}">+</button>
        <button class="btn-remove" data-id="${item.id}">Видалити</button>
      </div>
    </div>
  `).join("");

  cartItemsContainer.innerHTML = html;
  cartTotalSum.textContent = calculateTotal();
}

const cartItemsContainer = document.getElementById("cartItemsContainer");
if (cartItemsContainer) {
  cartItemsContainer.addEventListener("click", function (event) {
    const id = parseInt(event.target.dataset.id);
    if (!id) return;

    const product = cart.find(p => p.id === id);
    if (!product) return;

    if (event.target.classList.contains("btn-increase")) {
      product.quantity += 1;
    } else if (event.target.classList.contains("btn-decrease")) {
      product.quantity -= 1;
      if (product.quantity <= 0) {
        cart = cart.filter(p => p.id !== id);
      }
    } else if (event.target.classList.contains("btn-remove")) {
      cart = cart.filter(p => p.id !== id);
    }

    updateUI();
  });
}

function updateUI() {
  const numElement = document.getElementById("num");
  const totalElement = document.getElementById("total");

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (numElement) {
    numElement.textContent = totalItems;
  }

  if (totalElement) {
    totalElement.textContent = calculateTotal();
  }

  renderCartItems();
}

const cartButton = document.querySelector(".btn-cart");
const cartOverlay = document.getElementById("cartOverlay");
const closeBtn = document.getElementById("closeCartBtn");

function openCartModal() {
  if (cartOverlay) {
    cartOverlay.classList.remove("hidden");
    renderCartItems();
  }
}

function closeCartModal() {
  if (cartOverlay) {
    cartOverlay.classList.add("hidden");
  }
}

if (cartButton) {
  cartButton.addEventListener("click", openCartModal);
}

if (closeBtn) {
  closeBtn.addEventListener("click", closeCartModal);
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", (event) => {
    if (event.target === cartOverlay) {
      closeCartModal();
    }
  });
}