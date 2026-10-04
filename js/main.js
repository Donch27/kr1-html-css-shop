// Модальное окно
const orderDialog = document.getElementById('order-dialog');

// Кнопки заказа
const orderButtons = document.querySelectorAll('.product-card__button');

// Кнопка закрытия
const closeDialogButton = document.getElementById('close-order-dialog');

// Скрытое поле выбранного товара
const selectedProductInput =
  document.getElementById('selected-product');

// Форма
const orderForm = document.getElementById('order-form');

// Сообщение об успешной отправке
const successMessage =
  document.getElementById('success-message');


// Проверяем, что элементы формы существуют.
// Это позволяет безопасно подключать JS только к нужным страницам.
if (
  orderDialog &&
  orderButtons.length > 0 &&
  closeDialogButton &&
  selectedProductInput &&
  orderForm &&
  successMessage
) {

  // Открытие модального окна
  orderButtons.forEach((button) => {

    button.addEventListener('click', () => {

      const productName = button.dataset.product;

      selectedProductInput.value = productName;

      orderDialog.showModal();
    });

  });


  // Закрытие модального окна
  closeDialogButton.addEventListener('click', () => {
    orderDialog.close();
  });


  // Отправка формы
  orderForm.addEventListener('submit', (event) => {

    event.preventDefault();

    // Убираем предыдущие признаки ошибок
    const formElements = Array.from(orderForm.elements);

    formElements.forEach((element) => {

      if (element.willValidate) {
        element.removeAttribute('aria-invalid');
      }

    });


    // Проверяем встроенную HTML-валидацию
    if (!orderForm.checkValidity()) {

      formElements.forEach((element) => {

        if (
          element.willValidate &&
          !element.checkValidity()
        ) {
          element.setAttribute('aria-invalid', 'true');
        }

      });

      orderForm.reportValidity();

      return;
    }


    // Показываем сообщение
    successMessage.hidden = false;


    // Очищаем форму
    orderForm.reset();


    // Закрываем окно
    orderDialog.close();
  });

}