const CART_KEY = "mtk_cart";

const loadCart = () => {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  updateCartCount();
};

const updateCartCount = () => {
  const count = loadCart().length;
  document.querySelectorAll(".cart-count").forEach((el) => {
    el.textContent = count;
  });
};

const injectCartLink = () => {
  document.querySelectorAll(".top-header-inner").forEach((header) => {
    if (header.querySelector(".cart-link")) return;
    const actions = header.querySelector(".header-actions");
    if (!actions) return;
    const cart = document.createElement("a");
    cart.className = "cart-link";
    cart.href = "cart.html";
    cart.setAttribute("aria-label", "Warenkorb");
    cart.innerHTML = '🛒 <span class="cart-count">0</span>';
    const search = actions.querySelector(".header-search");
    if (search) {
      actions.insertBefore(cart, search);
    } else {
      actions.appendChild(cart);
    }
  });
};

const addToCart = (item) => {
  const items = loadCart();
  items.push(item);
  saveCart(items);
};

const removeFromCart = (index) => {
  const items = loadCart();
  items.splice(index, 1);
  saveCart(items);
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const getQuote = async (items) => {
  const response = await fetch("/api/quote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  if (!response.ok) {
    throw new Error("Quote request failed");
  }
  return response.json();
};

const renderCart = async () => {
  const list = document.querySelector("#cart-items");
  if (!list) return;

  const items = loadCart();
  list.innerHTML = "";

  if (items.length === 0) {
    list.innerHTML = "<p>Ihr Warenkorb ist leer.</p>";
    return;
  }

  items.forEach((item, index) => {
    const element = document.createElement("div");
    element.className = "cart-item";
    element.innerHTML = `
      <div>
        <h3>${item.name}</h3>
        <p>${item.configuration}</p>
      </div>
      <div class="cart-item-meta">
        <strong>${formatCurrency(item.totalGross)}</strong>
        <button type="button" data-remove="${index}">Entfernen</button>
      </div>
    `;
    list.appendChild(element);
  });

  list.querySelectorAll("button[data-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.remove));
      renderCart();
    });
  });

  const summary = document.querySelector("#cart-summary");
  if (summary) {
    const quote = await getQuote(items);
    summary.innerHTML = `
      <div><span>Zwischensumme (Brutto)</span><strong>${formatCurrency(
        quote.totalGross
      )}</strong></div>
      <div><span>MwSt. (20%)</span><strong>${formatCurrency(quote.vat)}</strong></div>
      <div class="total"><span>Gesamt</span><strong>${formatCurrency(
        quote.totalGross
      )}</strong></div>
    `;
  }
};

const initCartButtons = () => {
  document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
    button.addEventListener("click", () => {
      const payload = JSON.parse(button.dataset.payload);
      addToCart(payload);
      alert("Produkt wurde zum Warenkorb hinzugefügt.");
    });
  });
};

window.cartUtils = {
  loadCart,
  saveCart,
  addToCart,
  updateCartCount,
  renderCart,
  initCartButtons,
  formatCurrency,
  getQuote,
};

window.addEventListener("DOMContentLoaded", () => {
  injectCartLink();
  updateCartCount();
  renderCart();
  initCartButtons();
});
