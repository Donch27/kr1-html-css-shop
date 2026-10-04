document.addEventListener('DOMContentLoaded', () => {

  /* ===============================
     Модальное окно заказа
     =============================== */

  const orderDialog = document.getElementById('order-dialog');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const cancelOrderButton = document.getElementById('cancel-order');
  const selectedProductInput = document.getElementById('selected-product');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  const productButtons = document.querySelectorAll(
    '.product-card__button'
  );

  productButtons.forEach((button) => {
    button.addEventListener('click', () => {

      const productName = button.dataset.product;

      if (selectedProductInput) {
        selectedProductInput.value = productName || '';
      }

      if (orderDialog) {
        orderDialog.showModal();
      }
    });
  });

  const closeDialog = () => {
    if (orderDialog) {
      orderDialog.close();
    }
  };

  if (closeDialogButton) {
    closeDialogButton.addEventListener('click', closeDialog);
  }

  if (cancelOrderButton) {
    cancelOrderButton.addEventListener('click', closeDialog);
  }

  if (orderDialog) {
    orderDialog.addEventListener('click', (event) => {

      if (event.target === orderDialog) {
        closeDialog();
      }

    });
  }

  if (orderForm) {
    orderForm.addEventListener('submit', (event) => {

      event.preventDefault();

      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      orderForm.reset();

      if (selectedProductInput) {
        selectedProductInput.value = '';
      }

      closeDialog();

      if (successMessage) {

        successMessage.hidden = false;

        setTimeout(() => {
          successMessage.hidden = true;
        }, 3000);

      }

    });
  }

  /* ===============================
     Кнопка "Наверх"
     =============================== */

  const scrollTopButton = document.getElementById('scroll-top');

  if (scrollTopButton) {

    const updateScrollButton = () => {

      if (window.scrollY > 300) {
        scrollTopButton.classList.add('scroll-top--visible');
      } else {
        scrollTopButton.classList.remove('scroll-top--visible');
      }

    };

    window.addEventListener('scroll', updateScrollButton);

    updateScrollButton();

    scrollTopButton.addEventListener('click', () => {

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    });

  }

});