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

// Горизонтальная прокрутка категорий: колёсико мыши и кнопки-стрелки.
document.addEventListener("DOMContentLoaded", () => {
  const tracks = [
    document.querySelector("#featured-track"),
    document.querySelector("#all-category-track")
  ].filter(Boolean);

  function updateButtons(track) {
    const id = track.id;
    const maxScroll = track.scrollWidth - track.clientWidth;
    document.querySelectorAll(`[data-scroll-target="${id}"]`).forEach((button) => {
      const direction = button.dataset.direction;
      button.disabled = direction === "left"
        ? track.scrollLeft <= 2
        : track.scrollLeft >= maxScroll - 2;
    });
  }

  tracks.forEach((track) => {
    // Вертикальное колесо мыши над каруселью двигает ленту по горизонтали.
    track.addEventListener("wheel", (event) => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;
      const delta = Math.abs(event.deltaY) > Math.abs(event.deltaX)
        ? event.deltaY
        : event.deltaX;
      if (delta !== 0) {
        event.preventDefault();
        track.scrollLeft += delta;
      }
    }, { passive: false });

    track.addEventListener("scroll", () => updateButtons(track), { passive: true });
    window.addEventListener("resize", () => updateButtons(track));
    updateButtons(track);
  });

  document.querySelectorAll("[data-scroll-target]").forEach((button) => {
    button.addEventListener("click", () => {
      const track = document.getElementById(button.dataset.scrollTarget);
      if (!track) return;
      const firstCard = track.querySelector(".category-card, .category-slide");
      const step = firstCard ? firstCard.getBoundingClientRect().width + 16 : 250;
      track.scrollBy({
        left: (button.dataset.direction === "right" ? 1 : -1) * step,
        behavior: "smooth"
      });
    });
  });
});
