const products = [
  { id: 1, name: "Jasmine Rice (5kg)", price: 12.5, img: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300" },
  { id: 2, name: "Fresh Eggs (10pcs)", price: 3.2, img: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=300" },
  { id: 3, name: "Red Apples (5pk)", price: 4.5, img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=300" },
  { id: 4, name: "Mandrin Oranges (5pk)", price: 5.9, img: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300" },
  { id: 5, name: "Spaghetti (500g)", price: 2.1, img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=300" },
  { id: 6, name: "Full Cream Milk (1L)", price: 3.45, img: "https://mydiagnostics.in/cdn/shop/articles/img-1748326586409_1200x.jpg?v=1748327918" },
  { id: 7, name: "Bread", price: 2.7, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300" },
  { id: 8, name: "Bananas", price: 2.5, img: "https://trudes.co.uk/cdn/shop/products/TRUDE1010.jpg?v=1587563100" },
  { id: 9, name: "Cheddar Cheese", price: 6.2, img: "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=300" },
  { id: 10, name: "Macaroni Pasta", price: 1.8, img: "https://upload.wikimedia.org/wikipedia/commons/0/01/Macaroni2.jpg" }
];

const bundles = [
  { id: 101, name: "Mac & Cheese Kit", items: "Macaroni, Cheese, Milk", originalPrice: 11.45, img: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=400" },
  { id: 102, name: "Fruit Fiesta", items: "Apple, Orange, Banana", originalPrice: 12.9, img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400" },
  { id: 103, name: "Breakfast Set", items: "Eggs, Bread, Milk", originalPrice: 9.35, img: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=400" },
  { id: 104, name: "Pasta Night", items: "Spaghetti, Cheese, Eggs", originalPrice: 11.5, img: "https://images.unsplash.com/photo-1546548970-71785318a17b?auto=format&fit=crop&w=400" },
  { id: 105, name: "Energy Booster", items: "Banana, Milk, Rice", originalPrice: 18.45, img: "https://images.unsplash.com/photo-1505253149613-112d21d9f6a9?auto=format&fit=crop&w=400" }
];

const recipes = {
  101: "Boil macaroni for 8 mins. Melt cheese into warm milk to create a sauce, then combine.",
  102: "Slice all fruits into a bowl. Squeeze a bit of orange juice over to keep them fresh.",
  103: "Toast the bread. Fry or scramble the eggs. Serve with a chilled glass of milk.",
  104: "Cook spaghetti. Whisk eggs and cheese together, toss with hot pasta for a creamy carbonara style.",
  105: "Cook rice as a base. Slice bananas on top and serve with milk for a traditional energy bowl."
};

let cart = [];

// ---------- Persistence ----------
function loadCart() {
  try {
    const saved = localStorage.getItem("sgFreshCart");
    cart = saved ? JSON.parse(saved) : [];
  } catch {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem("sgFreshCart", JSON.stringify(cart));
}

// ---------- Rendering ----------
function init() {
  // products
  const pGrid = document.getElementById("product-grid");
  let pHTML = "";
  for (const p of products) {
    pHTML += `
      <div class="card">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p class="price">S$${p.price.toFixed(2)}</p>
        <button class="add-btn" data-id="${p.id}" data-type="solo">Add to Cart</button>
      </div>`;
  }
  pGrid.innerHTML = pHTML;

  // bundles + recipes
  const bGrid = document.getElementById("bundle-grid");
  const rGrid = document.getElementById("recipe-grid");

  let bHTML = "";
  let rHTML = "";

  for (const b of bundles) {
    const discounted = b.originalPrice * 0.8;
    bHTML += `
      <div class="card">
        <img src="${b.img}" alt="${b.name}">
        <h4>${b.name}</h4>
        <small>${b.items}</small>
        <p>
          <span class="old-price">S$${b.originalPrice.toFixed(2)}</span>
          <span class="price">S$${discounted.toFixed(2)}</span>
        </p>
        <button class="add-btn" data-id="${b.id}" data-type="bundle">Add Bundle</button>
      </div>`;

    rHTML += `
      <div class="recipe-card">
        <h3>${b.name} Recipe</h3>
        <p>${recipes[b.id] ?? ""}</p>
      </div>`;
  }

  bGrid.innerHTML = bHTML;
  rGrid.innerHTML = rHTML;

  // Event delegation for all add buttons
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const type = btn.dataset.type;
    addToCart(id, type);
  });

  loadCart();
  updateCartUI();
}

function getItemFromCatalog(id, type) {
  if (type === "solo") {
    const p = products.find((x) => x.id === id);
    if (!p) return null;
    return { id: p.id, name: p.name, price: p.price };
  }

  const b = bundles.find((x) => x.id === id);
  if (!b) return null;
  return { id: b.id, name: b.name, price: b.originalPrice * 0.8 };
}

function addToCart(id, type) {
  const item = getItemFromCatalog(id, type);
  if (!item) return;

  const existing = cart.find((x) => x.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });

  saveCart();
  updateCartUI();
  showToast(`${item.name} added to cart`);

}

function updateCartUI() {
  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");

  let total = 0;
  let count = 0;

  let html = "";
  for (const item of cart) {
    total += item.price * item.qty;
    count += item.qty;

    html += `
      <div class="cart-item">
        <div>
          <strong>${item.name}</strong><br>
          S$${item.price.toFixed(2)} x ${item.qty}
        </div>
        <div class="qty-controls">
          <button class="minus-button" data-id="${item.id}" data-delta="-1">-</button>
          <button class="plus-button" data-id="${item.id}" data-delta="1">+</button>
        </div>
      </div>`;
  }

  list.innerHTML = html || `<p style="color:#777;">Your cart is empty.</p>`;
  totalEl.innerText = total.toFixed(2);
  countEl.innerText = count;

  // qty buttons
  list.querySelectorAll("button[data-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const delta = Number(btn.dataset.delta);
      changeQty(id, delta);
    });
  });
}

function changeQty(id, delta) {
  const item = cart.find((x) => x.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter((x) => x.id !== id);
  }

  saveCart();
  updateCartUI();
}

function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("active");
}

function checkout() {
  if (cart.length === 0) {
    showModal("Your cart is empty.\nPlease add items before checkout.");
    return;
  }

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
  });

  let deliveryFee = 0;
  let deliveryText = "Free Delivery 🎉";

  if (subtotal < 20) {
    deliveryFee = subtotal * 0.10;
    deliveryText = `Delivery Fee (10%): S$${deliveryFee.toFixed(2)}`;
  }

  const total = subtotal + deliveryFee;

  const message =
    `Subtotal: S$${subtotal.toFixed(2)}\n` +
    `${deliveryText}\n\n` +
    `Total Payable: S$${total.toFixed(2)}\n\n` +
    `Thank you for your order!`;

  showModal(message);

  // clear cart
  cart = [];
  localStorage.removeItem("sgFreshCart");
  updateCartUI();
}

function showModal(text) {
  document.getElementById("modal-content").textContent = text;
  document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  toast.classList.remove("hidden");
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 1500);
}


// init
init();
