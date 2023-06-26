const icons = {
  edit: `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.9019 11.8619L13.2974 1.46643C13.3066 1.46378 13.3162 1.4611 13.3262 1.45839C13.463 1.42133 13.6609 1.38264 13.893 1.37944C14.3372 1.37331 14.9283 1.49293 15.5138 2.07843C16.0993 2.66392 16.2189 3.25504 16.2128 3.69925C16.2096 3.93131 16.1709 4.1292 16.1339 4.266C16.1312 4.27601 16.1285 4.28563 16.1258 4.29486L5.73032 14.6904L2.5162 15.076L2.9019 11.8619Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M2.9019 11.8619L13.2974 1.46643C13.3066 1.46378 13.3162 1.4611 13.3262 1.45839C13.463 1.42133 13.6609 1.38264 13.893 1.37944C14.3372 1.37331 14.9283 1.49293 15.5138 2.07843C16.0993 2.66392 16.2189 3.25504 16.2128 3.69925C16.2096 3.93131 16.1709 4.1292 16.1339 4.266C16.1312 4.27601 16.1285 4.28563 16.1258 4.29486L5.73032 14.6904L2.5162 15.076L2.9019 11.8619Z" stroke="url(#paint-linear-1)" stroke-width="2" stroke-linecap="round"/>
        <path d="M10.7012 2.64844L14.7418 6.68905" stroke="white" stroke-width="2"/>
        <path d="M10.7012 2.64844L14.7418 6.68905" stroke="url(#paint-linear-2)" stroke-width="2"/>
        <defs>

        <linearGradient id="paint-linear-1" x1="14.1302" y1="-0.780605" x2="18.3729" y2="3.46204" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF0079"/>
        <stop offset="1" stop-color="#FF8714"/>
        </linearGradient>

        <linearGradient id="paint-linear-2" x1="10.7026" y1="2.64698" x2="14.7432" y2="6.68759" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF0079"/>
        <stop offset="1" stop-color="#FF8714"/>
        </linearGradient>
        </defs>
    </svg>
  `,
  dublicate: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9.25" y="8.5" width="9" height="9.75" rx="3" stroke="url(#paint-linear-3)" stroke-width="2"/>
      <path d="M10.75 4.53571V4.53571C10.75 2.99721 9.50279 1.75 7.96429 1.75H4.75C3.09315 1.75 1.75 3.09315 1.75 4.75V8.5C1.75 10.1569 3.09315 11.5 4.75 11.5H5.5" stroke="url(#paint-linear-4)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

      <linearGradient id="paint-linear-3" x1="14.1302" y1="-0.780605" x2="18.3729" y2="3.46204" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF0079"/>
      <stop offset="1" stop-color="#FF8714"/>
      </linearGradient>

      <linearGradient id="paint-linear-4" x1="10.7026" y1="2.64698" x2="14.7432" y2="6.68759" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF0079"/>
      <stop offset="1" stop-color="#FF8714"/>
      </linearGradient>
    </svg>
  `,
  remove: `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.25 4.56836H16.75L16.305 13.7753C16.1762 16.4397 13.9784 18.5339 11.3108 18.5339H8.68917C6.02159 18.5339 3.82378 16.4397 3.695 13.7753L3.25 4.56836Z" stroke="url(#paint-linear-5)" stroke-width="2"/>
      <path d="M6.25 4.56836V4.46491C6.25 2.80806 7.59315 1.46491 9.25 1.46491H10.75C12.4069 1.46491 13.75 2.80806 13.75 4.46491V4.56836" stroke="url(#paint-linear-6)" stroke-width="2"/>
      <path d="M12.25 9.22461V13.1039" stroke="url(#paint-linear-5)" stroke-width="2" stroke-linecap="round"/>
      <path d="M7.75 9.22461V13.1039" stroke="url(#paint-linear-6)" stroke-width="2" stroke-linecap="round"/>
      <path d="M1.75 4.56836H18.25" stroke="url(#paint-linear-5)" stroke-width="2" stroke-linecap="round"/>

      <linearGradient id="paint-linear-5" x1="14.1302" y1="-0.780605" x2="18.3729" y2="3.46204" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF0079"/>
      <stop offset="1" stop-color="#FF8714"/>
      </linearGradient>

      <linearGradient id="paint-linear-6" x1="10.7026" y1="2.64698" x2="14.7432" y2="6.68759" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF0079"/>
      <stop offset="1" stop-color="#FF8714"/>
      </linearGradient>
    </svg>
  `,
  plus: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      class="icon icon-plus"
      fill="none"
      viewBox="0 0 10 10"
      >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1 4.51a.5.5 0 000 1h3.5l.01 3.5a.5.5 0 001-.01V5.5l3.5-.01a.5.5 0 00-.01-1H5.5L5.49.99a.5.5 0 00-1 .01v3.5l-3.5.01H1z" fill="currentColor">
    </svg>
  `,
  minus: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      class="icon icon-minus"
      fill="none"
      viewBox="0 0 10 2"
    >
      <path fill-rule="evenodd" clip-rule="evenodd" d="M.5 1C.5.7.7.5 1 .5h8a.5.5 0 110 1H1A.5.5 0 01.5 1z" fill="currentColor">
    </svg>
  `,
}

class ConfirmModal extends HTMLElement {
  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();
  }

  attributesChangeCallback(name, oldValue, newValue) {
  }

  getConfirm({
    content,
    text,
    actionText,
    callback
  }) {
    this.setAttribute('state', 'open');

    if (!content) {
      this.setDefaultContent(text, actionText);
    }


    setTimeout(() => {
      window.addEventListener('click', this.windowListener);
    }, 10);

    this.actionBtn.addEventListener('click', () => {
      callback();

      this.setAttribute('state', 'close');

      this.clear();
    });
  }

  setDefaultContent(text, actionText) {
    this.content = document.createElement('div');
    this.content.classList.add('confirm-modal__content');

    const message = document.createElement('div');
    message.classList.add('text', 'content__text');
    message.textContent = text;

    this.cancelBtn = document.createElement('button');
    this.cancelBtn.textContent = 'Cancel';
    this.cancelBtn.classList.add('button', 'button--primary');

    this.cancelBtn.addEventListener('click', () => {
      this.setAttribute('state', 'close');

      this.clear();
    });

    this.windowListener = this.windowClose.bind(this);

    this.actionBtn = document.createElement('button');
    this.actionBtn.classList.add('button');
    this.actionBtn.textContent = actionText;

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('content__button-group');

    btnGroup.append(this.cancelBtn, this.actionBtn)

    this.content.append(message, btnGroup);

    this.append(this.content);
  }

  windowClose(event) {
    if (event.target !== this && !this.contains(event.target)) {
      this.setAttribute('state', 'close');

      this.clear();

      window.removeEventListener('click', this.windowListener);
    }
  }

  clear() {
    this.content.remove();
  }
}
customElements.define('confirm-modal', ConfirmModal);

const confirmModal = document.querySelector('confirm-modal');

function formatMoney(cents, format) {
  if (typeof cents == 'string') { cents = cents.replace('.',''); }
  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = (format || this.money_format);

  function defaultOption(opt, def) {
      return (typeof opt == 'undefined' ? def : opt);
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal   = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) { return 0; }

    number = (number/100.0).toFixed(precision);

    var parts   = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents   = parts[1] ? (decimal + parts[1]) : '';

    return dollars + cents;
  }

  switch(formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;
    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;
    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;
    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

const orderItemTemplate = (order, idx) => {
  const { id, status, product, quantity } = order;

  const { imageUrl, title, handle, price } = product;

  console.log(price);

  const index = idx + 1;

  const shopify_id = order.product.shopify_id.split('/').pop();

  const lineItem = window.lineItems.find(item => item.product_id === +shopify_id);

  const duplicateOrder = async () => {
    const state = await fetch(`orders/state/${id}?id=${customerId}`).then(res => {
      return res.json();
    });

    if (!lineItem) {
      return;
    }

    const itemQuantity = lineItem.quantity;

    fetch(location.origin + '/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        updates: {
          [lineItem.id]: itemQuantity + quantity
        }
      })
    });

    if (state && state.productId) {
      const response = await fetch(`orders/create?id=${customerId}&status=active  `, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state)
      }).then(res => res.json());

      if (response.error) {
        console.log(response.error);
        return;
      }

      const duplicatedOrder = orderItemTemplate(response);

      container.after(duplicatedOrder)
    }    
  };

  const removeOrder = () => {
    confirmModal.getConfirm({
      text: 'Are you sure you want to delete?',
      callback: async () => {
        const deleteLink = `orders/delete/${id}?id=${customerId}&inactive=true`;
        removeBtn.classList.add('is-loading');
        removeBtn.toggleAttribute('disabled');

        if (lineItem) {
          const itemQuantity = lineItem.quantity;

          fetch(location.origin + '/cart/update.js', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              updates: {
                [lineItem.id]: itemQuantity - quantity
              }
            })
          });
        }

        fetch(deleteLink, {
          method: 'DELETE',
        }).then(res => res.json()).then(data => {
          if (!data.error) {
            container.remove();
          } else {
            removeBtn.classList.remove('is-loading');
            removeBtn.toggleAttribute('disabled');
          }
        });
      },
      actionText: 'Delete'
    })
  };

  const container = document.createElement('div');
  container.classList.add('cart-item', 'cart-grid');
  container.id = `CartItem-${index}`
  container.setAttribute('order-id', id);

  const itemInfo = document.createElement('div');
  itemInfo.classList.add('cart-item__info')

  if (imageUrl) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cart-item__media');

    const image = new Image();
    image.classList.add('cart-item__image');

    image.src = imageUrl + '?width=150&height=150'

    const link = document.createElement('a');
    link.href = `/products/${handle}`;
    link.classList.add('cart-item__link');
    link.setAttribute('aria-hidden', true);
    link.setAttribute('tabindex', -1);
    link.textContent = ' ';

    imageWrapper.append(image, link);

    itemInfo.append(imageWrapper);
  }

  const itemDetails = document.createElement('div');
  itemDetails.classList.add('cart-item__details');

  const itemTitle = document.createElement('a');
  itemTitle.classList.add('cart-item__name', 'h4', 'break');
  itemTitle.textContent = title;
  itemTitle.href = `/products/${handle}`;

  const itemPrice = document.createElement('div');
  itemPrice.classList.add('product-option', 'text');
  itemPrice.textContent = `Price: ${formatMoney(price * 100, window.money_format)}`;

  itemDetails.append(itemTitle, itemPrice);

  const itemDraftControl = document.createElement('div');
  itemDraftControl.classList.add('cart-item__draft-control');

  const editBtn = document.createElement('a');
  editBtn.classList.add('draft-control', 'draft-control--edit');
  editBtn.href = location.origin + `/apps/product-builder?order-id=${id}`;
  editBtn.innerHTML = icons.edit;

  const duplicate = document.createElement('button');
  duplicate.classList.add('draft-control', 'draft-control--duplicate');
  duplicate.setAttribute('type', 'button');
  duplicate.innerHTML = icons.dublicate;

  duplicate.addEventListener('click', duplicateOrder);

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('draft-control', 'draft-control--remove');
  removeBtn.id = `Remove-${index}`;
  removeBtn.setAttribute('data-index', index);
  removeBtn.setAttribute('type', 'button');
  removeBtn.innerHTML = icons.remove;

  removeBtn.addEventListener('click', removeOrder);

  itemDraftControl.append(editBtn, duplicate, removeBtn);

  const itemQuantity = document.createElement('div');
  itemQuantity.classList.add('cart-item__quantity');
  const quantityWrapper = document.createElement('div');
  quantityWrapper.classList.add('cart-item__quantity-wrapper');

  const quantityValue = document.createElement('input');
  quantityValue.classList.add('quantity__input');
  quantityValue.value = quantity;
  quantityValue.setAttribute('type', 'number');

  quantityWrapper.append(quantityValue);
  itemQuantity.append(quantityWrapper);

  const itemTotals = document.createElement('div');
  itemTotals.classList.add('cart-item__totals', 'right');

  const itemTotalLoader = document.createElement('div');
  itemTotalLoader.classList.add('loading-overlay__spinner');
  itemTotalLoader.innerHTML = `
    <div class="loading-overlay__spinner">
      <svg
        aria-hidden="true"
        focusable="false"
        class="spinner"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  `;

  const totalPrice = document.createElement('div');
  totalPrice.classList.add('cart-item__price-wrapper');

  const totalPriceSpan = document.createElement('span');
  totalPriceSpan.classList.add('price', 'price--end');
  totalPriceSpan.textContent = formatMoney(quantity * price * 100, window.money_format);

  totalPrice.append(totalPriceSpan);

  itemTotals.append(itemTotalLoader, totalPriceSpan);

  itemInfo.append(itemDetails, itemDraftControl)

  container.append(itemInfo, itemQuantity, itemTotals);

  return container;
};

const defaultProductItemTemplate = (product, idx) => {
  const index = idx + 1;

  const { id, line_price, product_id, url, image: imageUrl, final_line_price, title, quantity, variant_id } = product;

  const container = document.createElement('div');
  container.classList.add('cart-item', 'cart-grid');
  container.id = `CartItem-${index}`;
  container.setAttribute('product-id', product_id);

  const itemInfo = document.createElement('div');
  itemInfo.classList.add('cart-item__info')

  if (imageUrl) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('cart-item__media');

    const image = new Image();
    image.classList.add('cart-item__image');

    image.src = imageUrl + '?width=150&height=150'

    const link = document.createElement('a');
    link.href = url;
    link.classList.add('cart-item__link');
    link.setAttribute('aria-hidden', true);
    link.setAttribute('tabindex', -1);
    link.textContent = ' ';

    imageWrapper.append(image, link);

    itemInfo.append(imageWrapper);
  }

  const itemDetails = document.createElement('div');
  itemDetails.classList.add('cart-item__details');

  const itemTitle = document.createElement('a');
  itemTitle.classList.add('cart-item__name', 'h4', 'break');
  itemTitle.textContent = title;
  itemTitle.href = url;

  const itemPrice = document.createElement('div');
  itemPrice.classList.add('product-option', 'text');
  itemPrice.textContent = `Price: ${formatMoney(line_price, window.money_format)}`;

  itemDetails.append(itemTitle, itemPrice);

  const itemDraftControl = document.createElement('div');
  itemDraftControl.classList.add('cart-item__draft-control');

  const removeBtn = document.createElement('cart-remove-button');
  removeBtn.classList.add('draft-control', 'draft-control--remove');
  removeBtn.id = `Remove-${index}`;
  removeBtn.setAttribute('data-index', index);
  removeBtn.setAttribute('type', 'button');
  removeBtn.innerHTML = icons.remove;

  itemDraftControl.append(removeBtn);

  const itemQuantity = document.createElement('div');
  itemQuantity.classList.add('cart-item__quantity');

  const quantityWrapper = document.createElement('div');
  quantityWrapper.classList.add('cart-item__quantity-wrapper');

  const quantityLabel = document.createElement('label');
  quantityLabel.classList.add('visually-hidden');
  quantityLabel.setAttribute('for', `Quantity-${index}`);
  quantityLabel.textContent = 'Quantity';

  const quantityInput = document.createElement('quantity-input');
  quantityInput.classList.add('quantity', 'cart-quantity')

  const plus = document.createElement('button');
  plus.classList.add('quantity__button', 'no-js-hidden')
  plus.setAttribute('name', 'plus');
  plus.setAttribute('type', 'button');
  plus.innerHTML = icons.plus;

  const minus = document.createElement('button');
  minus.classList.add('quantity__button', 'no-js-hidden')
  minus.setAttribute('name', 'minus');
  minus.setAttribute('type', 'button');
  minus.innerHTML = '';
  minus.innerHTML = icons.minus;

  const quantityValue = document.createElement('input');
  quantityValue.classList.add('quantity__input');
  quantityValue.setAttribute('data-quantity-variant-id', variant_id);
  // quantityValue.setAttribute('data-cart-quantity', variant_id);
  quantityValue.name = 'updates[]';
  quantityValue.id = `Quantity-${index}`;
  quantityValue.value = quantity;
  quantityValue.setAttribute('type', 'number');

  quantityInput.append(plus, quantityValue, minus);

  quantityWrapper.append(quantityLabel, quantityInput);
  itemQuantity.append(quantityWrapper);

  const itemTotals = document.createElement('div');
  itemTotals.classList.add('cart-item__totals', 'right');

  const itemTotalLoader = document.createElement('div');
  itemTotalLoader.classList.add('loading-overlay__spinner');
  itemTotalLoader.innerHTML = `
    <div class="loading-overlay__spinner">
      <svg
        aria-hidden="true"
        focusable="false"
        class="spinner"
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
      </svg>
    </div>
  `;

  const totalPrice = document.createElement('div');
  totalPrice.classList.add('cart-item__price-wrapper');

  const totalPriceSpan = document.createElement('span');
  totalPriceSpan.classList.add('price', 'price--end');
  totalPriceSpan.textContent = formatMoney(final_line_price, window.money_format);

  totalPrice.append(totalPriceSpan);

  itemTotals.append(itemTotalLoader, totalPriceSpan);

  itemInfo.append(itemDetails, itemDraftControl)

  container.append(itemInfo, itemQuantity, itemTotals);

  itemsList.append(container);

  return container;
};

const itemsList = document.querySelector('[data-cart-items-list');
const customerId = document.querySelector('cart-items').getAttribute('customer-id');

fetch(`orders/list/${customerId}?status=active`)
  .then(res => res.json())
  .then(data => {
    const items = data.map((item, idx) => orderItemTemplate(item, idx));

    itemsList.append(...items);
  });

const additionalProducts = window.lineItems.map(item => {
  return new Promise(async (resolve, reject) => {
    const isDefaultProduct = await fetch(`cart/checkProduct?id=${item.product_id}`)
      .then(res => res.json())
      .then(res => res.allowed === 'yes' ? true : false);

    if (!isDefaultProduct) {
      resolve();
      return;
    }

    resolve(defaultProductItemTemplate(item));
  });
});
