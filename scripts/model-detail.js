const parseParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    name: params.get("name") || "Produkt",
    base: Number(params.get("price") || 0),
    type: params.get("type") || "ambient",
  };
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("de-AT", {
    style: "currency",
    currency: "EUR",
  }).format(value);

const options = [
  { label: "Panoramakontur", price: 150 },
  { label: "Beleuchtung", price: 120 },
  { label: "Mittelkonsole", price: 100 },
];

const renderOptions = () => {
  const container = document.querySelector("#config-options");
  if (!container) return;
  container.innerHTML = options
    .map(
      (option, index) => `
        <label class="config-option">
          <input type="checkbox" data-option="${index}" />
          <span>${option.label}</span>
          <strong>${formatCurrency(option.price)}</strong>
        </label>
      `
    )
    .join("");
};

const calculateTotal = (base, selected) => {
  const extra = selected.reduce((sum, idx) => sum + options[idx].price, 0);
  const total = base + extra;
  const net = total / 1.2;
  const vat = total - net;
  return { total, net, vat };
};

const updateSummary = (base) => {
  const selected = Array.from(
    document.querySelectorAll("input[data-option]:checked")
  ).map((input) => Number(input.dataset.option));

  const { total, net, vat } = calculateTotal(base, selected);
  const summary = document.querySelector("#config-summary");
  if (summary) {
    summary.innerHTML = `
      <div><span>Grundpreis (Brutto)</span><strong>${formatCurrency(base)}</strong></div>
      <div><span>Konfiguration</span><strong>${formatCurrency(total - base)}</strong></div>
      <div><span>MwSt. (20%)</span><strong>${formatCurrency(vat)}</strong></div>
      <div class="total"><span>Gesamt (Brutto)</span><strong>${formatCurrency(
        total
      )}</strong></div>
    `;
  }

  return { total, selected };
};

const initGallery = () => {
  const modal = document.querySelector("#gallery-modal");
  const modalImage = document.querySelector("#gallery-modal img");
  const images = Array.from(document.querySelectorAll(".detail-gallery img"));
  let index = 0;

  const openModal = (idx) => {
    index = idx;
    modalImage.src = images[index].src;
    modal.classList.add("open");
  };

  const closeModal = () => {
    modal.classList.remove("open");
  };

  const showNext = (direction) => {
    index = (index + direction + images.length) % images.length;
    modalImage.src = images[index].src;
  };

  images.forEach((img, idx) => {
    img.addEventListener("click", () => openModal(idx));
  });

  modal.querySelector(".close").addEventListener("click", closeModal);
  modal.querySelector(".prev").addEventListener("click", () => showNext(-1));
  modal.querySelector(".next").addEventListener("click", () => showNext(1));
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
};

const init = () => {
  const { name, base, type } = parseParams();
  document.querySelector("#product-name").textContent = name;
  const basePrice = document.querySelector("#base-price");
  if (basePrice) {
    basePrice.textContent = formatCurrency(base);
  }
  document.querySelector("#product-type").textContent = type;

  renderOptions();
  updateSummary(base);
  document.querySelectorAll("input[data-option]").forEach((input) => {
    input.addEventListener("change", () => updateSummary(base));
  });

  const addButton = document.querySelector("#add-to-cart");
  addButton.addEventListener("click", () => {
    const { total, selected } = updateSummary(base);
    const configuration = selected
      .map((idx) => options[idx].label)
      .join(", ");

    const payload = {
      name,
      totalGross: Number(total.toFixed(2)),
      configuration: configuration || "Keine Zusatzoptionen",
      type,
    };

    window.cartUtils.addToCart(payload);
    alert("Produkt wurde zum Warenkorb hinzugefügt.");
  });

  initGallery();
};

window.addEventListener("DOMContentLoaded", init);
