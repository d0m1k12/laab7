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

const container = document.querySelector(".products-grid");

const htmlString = products.map((product) => {
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

container.innerHTML = htmlString;