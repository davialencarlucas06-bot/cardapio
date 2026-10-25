
const WHATSAPP_NUMBER = "5511999999999";
// Troque pelo número da pizzaria, com código do país e DDD.
// Exemplo: 5511987654321. Não use +, espaços ou traços.

const products = [
  {
    id: 1,
    name: "Mussarela",
    category: "tradicionais",
    label: "Tradicional",
    description: "Molho de tomate, mussarela derretida e orégano.",
    price: 39.90,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Calabresa",
    category: "tradicionais",
    label: "Tradicional",
    description: "Calabresa fatiada, cebola e mussarela.",
    price: 42.90,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Portuguesa",
    category: "tradicionais",
    label: "Tradicional",
    description: "Presunto, ovo, cebola, ervilha e mussarela.",
    price: 45.90,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Quatro Queijos",
    category: "especiais",
    label: "Especial",
    description: "Uma combinação cremosa de quatro queijos.",
    price: 49.90,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Frango com Catupiry",
    category: "especiais",
    label: "Especial",
    description: "Frango desfiado e requeijão cremoso.",
    price: 47.90,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Chocolate",
    category: "doces",
    label: "Pizza doce",
    description: "Chocolate cremoso sobre massa douradinha.",
    price: 44.90,
    image: "https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Refrigerante 2L",
    category: "bebidas",
    label: "Bebida",
    description: "Refrigerante de 2 litros. Consulte os sabores.",
    price: 12.00,
    image: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Água mineral",
    category: "bebidas",
    label: "Bebida",
    description: "Água mineral para acompanhar seu pedido.",
    price: 4.00,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&w=800&q=80"
  }
];

const cart = new Map();

const grid = document.querySelector("#product-grid");
const cartBar = document.querySelector("#cart-bar");
const cartDialog = document.querySelector("#cart-dialog");
const cartItems = document.querySelector("#cart-items");

const money = value =>
  value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });

function renderProducts(category = "todas") {
  const filtered = category === "todas"
    ? products
    : products.filter(product => product.category === category);

  grid.replaceChildren();

  if (!filtered.length) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "Nenhum produto encontrado.";
    grid.append(message);
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const label = document.createElement("span");
    label.className = "product-category";
    label.textContent = product.label;

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.className = "product-description";
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = money(product.price);

    const button = document.createElement("button");
    button.className = "add-button";
    button.textContent = " + Adicionar";
    button.setAttribute("aria-label", `Adicionar ${product.name} ao pedido`);
    button.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, button);
    info.append(label, title, description, bottom);
    card.append(image, info);
    grid.append(card);
  });
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
}

function changeQuantity(id, change) {
  const next = (cart.get(id) || 0) + change;

  if (next <= 0) {
    cart.delete(id);
  } else {
    cart.set(id, next);
  }

  renderCart();
}

function getCartCount() {
  return [...cart.values()].reduce((sum, quantity) => sum + quantity, 0);
}

function getCartTotal() {
  return [...cart.entries()].reduce((sum, [id, quantity]) => {
    const product = products.find(item => item.id === id);
    return sum + product.price * quantity;
  }, 0);
}

function renderCart() {
  const count = getCartCount();
  const total = getCartTotal();

  cartBar.hidden = count === 0;
  document.querySelector("#cart-count").textContent =
    `${count} ${count === 1 ? "item" : "itens"}`;
  document.querySelector("#cart-total").textContent = money(total);
  document.querySelector("#dialog-total").textContent = money(total);

  cartItems.replaceChildren();

  if (count === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Seu carrinho está vazio.";
    cartItems.append(empty);
    return;
  }

  cart.forEach((quantity, id) => {
    const product = products.find(item => item.id === id);

    const row = document.createElement("div");
    row.className = "cart-item";

    const info = document.createElement("div");
    info.className = "cart-item-info";

    const name = document.createElement("strong");
    name.textContent = product.name;

    const subtotal = document.createElement("small");
    subtotal.textContent = money(product.price * quantity);

    info.append(name, subtotal);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Diminuir ${product.name}`);
    minus.addEventListener("click", () => changeQuantity(id, -1));

    const qty = document.createElement("span");
    qty.textContent = quantity;

    const plus = document.createElement("button");
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Aumentar ${product.name}`);
    plus.addEventListener("click", () => changeQuantity(id, 1));

    controls.append(minus, qty, plus);
    row.append(info, controls);
    cartItems.append(row);
  });
}

document.querySelectorAll(".category").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".category").forEach(item => {
      item.classList.remove("active");
    });

    button.classList.add("active");
    renderProducts(button.dataset.category);
  });
});

document.querySelector("#open-cart").addEventListener("click", () => {
  renderCart();
  cartDialog.showModal();
});

document.querySelector("#close-cart").addEventListener("click", () => {
  cartDialog.close();
});

cartDialog.addEventListener("click", event => {
  if (event.target === cartDialog) {
    cartDialog.close();
  }
});

document.querySelector("#checkout").addEventListener("click", () => {
  if (cart.size === 0) {
    alert("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  const name = document.querySelector("#customer-name").value.trim();
  const address = document.querySelector("#customer-address").value.trim();
  const notes = document.querySelector("#customer-notes").value.trim();

  if (!name || !address) {
    alert("Preencha seu nome e o endereço de entrega.");
    return;
  }

  if (!/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
    alert("A pizzaria precisa configurar um número de WhatsApp válido.");
    return;
  }

  const lines = [...cart.entries()].map(([id, quantity]) => {
    const product = products.find(item => item.id === id);
    return `• ${quantity}x ${product.name} — ${money(product.price * quantity)}`;
  });

  const message = [
    "🍕 *NOVO PEDIDO - BELLA PIZZA*",
    "",
    `*Cliente:* ${name}`,
    `*Endereço:* ${address}`,
    "",
    "*Itens do pedido:*",
    ...lines,
    "",
    `*TOTAL: ${money(getCartTotal())}*`,
    notes ? `*Observações:* ${notes}` : "",
    "",
    "Olá! Gostaria de confirmar este pedido."
  ].filter(Boolean).join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
