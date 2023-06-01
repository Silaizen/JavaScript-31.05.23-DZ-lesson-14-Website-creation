let totalPrice = 0;
let cartItemsCount = 0;

function validateLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");
  const loginContainer = document.getElementById("login-container");
  const mainContainer = document.getElementById("main-container");

  if (username === "admin" && password === "password") {
    loginContainer.style.display = "none";
    mainContainer.style.display = "block";
    showMessage("Успішний вхід!", "success-message");
  } else {
    errorMessage.innerHTML = "Неправильний логін або пароль. Спробуйте ще раз.";
  }
}

function addToCart(item, price) {
  const cartItems = document.getElementById("cart-items");
  const messageContainer = document.getElementById("message-container");

  const existingCartItem = Array.from(cartItems.children).find((cartItem) => {
    const itemName = cartItem.querySelector(".item-name").textContent;
    return itemName === item;
  });

  if (existingCartItem) {
    const quantityInput = existingCartItem.querySelector(".item-quantity");
    let quantity = parseInt(quantityInput.value) + 1;
    if (quantity < 0) {
      quantity = 0;
    }
    quantityInput.value = quantity;
    updateCartItemTotal(existingCartItem, price, quantity);
  } else {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    const itemText = document.createElement("span");
    itemText.className = "item-name";
    itemText.innerHTML = item;

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.className = "item-quantity";
    quantityInput.value = 1;
    quantityInput.oninput = function () {
      let quantity = parseInt(quantityInput.value);
      if (quantity < 0) {
        quantity = 0;
        quantityInput.value = 0;
      }
      updateCartItemTotal(cartItem, price, quantity);
      if (quantity === 0) {
        cartItems.removeChild(cartItem);
      }
    };

    const deleteButton = document.createElement("span");
    deleteButton.innerHTML = "Видалити";
    deleteButton.className = "delete-button";
    deleteButton.onclick = function () {
      cartItems.removeChild(cartItem);
      const quantity = parseInt(quantityInput.value);
      const itemTotal = price * quantity;
      totalPrice -= itemTotal;
      cartItemsCount -= quantity;
      if (cartItemsCount < 0) {
        cartItemsCount = 0; 
      }
      updateTotalPrice();
      if (cartItemsCount === 0) {
        totalPrice = 0;
        updateTotalPrice();
      }
    };

    const itemTotal = document.createElement("span");
    itemTotal.innerHTML = "Сума: " + price + " грн";
    itemTotal.className = "item-total";

    cartItem.appendChild(itemText);
    cartItem.appendChild(quantityInput);
    cartItem.appendChild(deleteButton);
    cartItem.appendChild(itemTotal);

    cartItems.appendChild(cartItem);

    totalPrice += price;
    cartItemsCount += parseInt(quantityInput.value);
    updateTotalPrice();

    
    showMessage("Товар додано до кошика");
  }
}

function updateCartItemTotal(cartItem, price, quantity) {
  const itemTotal = cartItem.querySelector(".item-total");

  const total = price * quantity;

  itemTotal.innerHTML = "Сума: " + total + " грн";

  const previousTotal =
    parseInt(itemTotal.getAttribute("data-previous-total")) || 0;
  const priceDifference = total - previousTotal || 0;

  totalPrice += priceDifference;
  cartItemsCount +=
    quantity - parseInt(itemTotal.getAttribute("data-previous-quantity")) || 0;

  itemTotal.setAttribute("data-previous-total", total);
  itemTotal.setAttribute("data-previous-quantity", quantity);
  updateTotalPrice();
}

function showMessage(message) {
  const messageContainer = document.getElementById("message-container");
  messageContainer.innerHTML = message;

  setTimeout(function () {
    messageContainer.innerHTML = "";
  }, 3000);
}
