document.addEventListener("DOMContentLoaded", () => {
  const sizes = [
    { value: "YTH", label: "Youth (YTH) — детский" },
    { value: "JR", label: "Junior (JR) — юниорский" },
    { value: "INT", label: "Intermediate (INT) — промежуточный" },
    { value: "SR", label: "Senior (SR) — взрослый" }
  ];

  // Создание поля выбора размера
  function createSizeField() {
    const wrapper = document.createElement("div");
    wrapper.className = "order-form__field";

    const label = document.createElement("label");
    label.htmlFor = "order-size";
    label.className = "order-form__label";
    label.textContent = "Размерная категория";

    const select = document.createElement("select");
    select.id = "order-size";
    select.name = "size";
    select.className = "order-form__input";
    select.required = true;

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Выберите размер";
    placeholder.disabled = true;
    placeholder.selected = true;
    select.appendChild(placeholder);

    sizes.forEach((size) => {
      const option = document.createElement("option");
      option.value = size.value;
      option.textContent = size.label;
      select.appendChild(option);
    });

    wrapper.append(label, select);
    return wrapper;
  }

  // Ищем существующее окно заказа на главной странице
  let dialog = document.getElementById("order-dialog");
  let catalogDialog = false;

  // Если окна нет, создаём его для каталога
  if (!dialog) {
    catalogDialog = true;

    dialog = document.createElement("dialog");
    dialog.id = "order-dialog";
    dialog.className = "order-dialog";

    dialog.innerHTML = `
      <div class="order-dialog__content">
        <button
          type="button"
          class="order-dialog__close"
          id="close-order-dialog"
          aria-label="Закрыть окно"
        >&times;</button>

        <h2 class="order-dialog__title">Оформление заказа</h2>

        <form class="order-form" id="order-form">
          <div class="order-form__field">
            <label class="order-form__label" for="selected-product">
              Товар
            </label>
            <input
              class="order-form__input"
              id="selected-product"
              name="product"
              type="text"
              readonly
              required
            >
          </div>

          <div class="order-form__field">
            <label class="order-form__label" for="order-name">
              Ваше имя
            </label>
            <input
              class="order-form__input"
              id="order-name"
              name="name"
              type="text"
              autocomplete="name"
              required
            >
          </div>

          <div class="order-form__field">
            <label class="order-form__label" for="order-email">
              Email
            </label>
            <input
              class="order-form__input"
              id="order-email"
              name="email"
              type="email"
              autocomplete="email"
              required
            >
          </div>

          <div class="order-form__field">
            <label class="order-form__label" for="order-phone">
              Телефон
            </label>
            <input
              class="order-form__input"
              id="order-phone"
              name="phone"
              type="tel"
              autocomplete="tel"
              required
            >
          </div>

          <div id="order-size-container"></div>

          <div class="order-form__actions">
            <button class="button button--primary" type="submit">
              Подтвердить заказ
            </button>
            <button
              class="button button--secondary"
              id="cancel-order"
              type="button"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(dialog);
  }

  const form = dialog.querySelector("#order-form");

  if (!form) {
    console.warn("IceForce: форма заказа не найдена.");
    return;
  }

  // Добавляем размер, если его ещё нет
  if (!form.querySelector("#order-size")) {
    const field = createSizeField();
    const container = form.querySelector("#order-size-container");

    if (container) {
      container.appendChild(field);
    } else {
      const actions = form.querySelector(".order-form__actions");
      const submitButton = form.querySelector('[type="submit"]');

      if (actions) {
        form.insertBefore(field, actions);
      } else if (submitButton) {
        submitButton.before(field);
      } else {
        form.appendChild(field);
      }
    }
  }

  const productInput = dialog.querySelector("#selected-product");
  const sizeSelect = dialog.querySelector("#order-size");

  function openDialog(productName) {
    if (productInput) {
      productInput.value = productName;
    }

    sizeSelect.value = "";

    if (!dialog.open) {
      dialog.showModal();
    }
  }

  function closeDialog() {
    if (dialog.open) {
      dialog.close();
    }
  }

  // Обработчики кнопок каталога
  if (catalogDialog) {
    document
      .querySelectorAll(".product-card .button")
      .forEach((button) => {
        button.addEventListener("click", (event) => {
          event.preventDefault();

          const card = button.closest(".product-card");
          const title = card?.querySelector(".product-card__title");

          if (title) {
            openDialog(title.textContent.trim());
          }
        });
      });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const product = productInput.value;
      const size = sizeSelect.value;

      closeDialog();
      form.reset();

      let message = document.getElementById("size-order-success");

      if (!message) {
        message = document.createElement("p");
        message.id = "size-order-success";
        message.className = "success-message";
        message.setAttribute("role", "status");
        document.body.appendChild(message);
      }

      message.textContent =
        `Вы выбрали: ${product}. Размер: ${size}. ` +
        "Демонстрационная заявка оформлена.";
    });
  } else {
    // На главной сохраняем выбранный размер до сброса формы
    // существующим обработчиком main.js.
    let selectedSize = "";
    let selectedProduct = "";

    form.addEventListener(
      "submit",
      () => {
        selectedSize = sizeSelect.value;
        selectedProduct = productInput
          ? productInput.value
          : "Товар";
      },
      true
    );

    form.addEventListener("submit", () => {
      if (!selectedSize) return;

      const successMessage =
        document.getElementById("success-message");

      if (successMessage) {
        successMessage.textContent =
          `Заявка на «${selectedProduct}», размер ${selectedSize}, ` +
          "подготовлена.";
      }
    });
  }

  const closeButton = dialog.querySelector("#close-order-dialog");
  const cancelButton = dialog.querySelector("#cancel-order");

  closeButton?.addEventListener("click", closeDialog);
  cancelButton?.addEventListener("click", closeDialog);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog();
    }
  });
});