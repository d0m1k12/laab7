const products = [
  {
    id: 1,
    title: "Смартфон Galaxy S21",
    desc: "Потужний процесор та неймовірна камера.",
    price: 25000,
    category: "smartphones",
    image: "img/GalaxyS21.webp"
  },
  {
    id: 2,
    title: "Ноутбук Asus ZenBook",
    desc: "Ідеальний для роботи та навчання. Легкий та швидкий.",
    price: 35000,
    category: "laptops",
    image: "img/AsusZenBook.webp"
  },
  {
    id: 3,
    title: "Навушники Sony WH-1000XM4",
    desc: "Найкраще шумозаглушення та чистий звук.",
    price: 12000,
    category: "headphones",
    image: "img/SonyWH-1000XM4.webp"
  },
  {
    id: 4,
    title: "Apple Watch Series 8",
    desc: "Надійний фітнес-трекер та помічник на щодень.",
    price: 18000,
    category: "watches",
    image: "img/AWS8.webp"
  },
  {
    id: 5,
    title: "Планшет Apple iPad Air",
    desc: "Потужність ПК у компактному форматі.",
    price: 28000,
    category: "tablets",
    image: "img/iPadAir.webp" 
  },
  {
    id: 6,
    title: "Миша Logitech MX Master 3S",
    desc: "Ергономічна миша для професіоналів.",
    price: 4500,
    category: "accessories",
    image: "img/LogitechMXMaster3S.webp"
  }
];

let cart = [];

const container = document.querySelector(".products-grid");
const loader = document.getElementById("loader");

function fetchProducts() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(products);
    }, 1500);
  });
}

async function initShop() {
  if (loader) loader.classList.remove("hidden");
  if (container) container.innerHTML = "";

  try {
    const data = await fetchProducts();
    
    if (loader) loader.classList.add("hidden");

    const htmlString = data.map((product) => {
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}" class="product-img">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-desc">${product.desc}</p>
                <span class="product-price">${product.price} грн</span>
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
      const selectedProduct = products.find(p => p.id === productId);
      if (selectedProduct) {
        addToCart(selectedProduct);
      }
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
        <p>${item.price} грн x ${item.quantity} = <strong>${item.price * item.quantity} грн</strong></p>
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