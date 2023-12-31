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

const draftsList = document.querySelector('[data-drafts-list]');
const customerId = draftsList.dataset.draftsList || Cookies.get('product-builder-anonim-id');
const shopOrders = draftsList.dataset.shop;

const deleteIcon = `
  <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.77734 4.74976H15.8273L15.4048 13.4911C15.2761 16.1556 13.0783 18.2498 10.4107 18.2498H8.19402C5.52643 18.2498 3.32863 16.1556 3.19984 13.4911L2.77734 4.74976Z" stroke="#FF0079" stroke-width="2"/>
    <path d="M5.67578 4.74976V4.74976C5.67578 3.0929 7.01893 1.74976 8.67578 1.74976H9.92578C11.5826 1.74976 12.9258 3.0929 12.9258 4.74976V4.74976" stroke="#FF0079" stroke-width="2"/>
    <path d="M11.4766 9.24976V12.9998" stroke="#FF0079" stroke-width="2" stroke-linecap="round"/>
    <path d="M7.125 9.24976V12.9998" stroke="#FF0079" stroke-width="2" stroke-linecap="round"/>
    <path d="M1.32812 4.74976H17.2781" stroke="#FF0079" stroke-width="2" stroke-linecap="round"/>
  </svg>
`;

const onImageLoad = async (picture, src) => {
  return new Promise(res => {
    picture.onload = () => {
      res();
    }

    picture.onerror = () => {
      res(new Error('no image'));
    }

    picture.src = src;
  })
}

const userEmptyState = () => {
  draftsList.querySelectorAll('li.order').forEach(order => order.remove());
  draftsList.classList.remove('is-loading');
}

const orderItem = (draft) => {
  return new Promise(async (res, rej) => {
    const { root, primary } = localization.language;

    console.log(draft.product);

    if (draft.product) {
      const shopifyProduct = await fetch(`${primary ? root : root + '/'}products/${draft.product.handle}.json`)
        .then(res => {
          if (res.ok) {
            return res.json()
          };

          return {
            error: 'No file'
          }
        })
        .then(res => res.product);

      draft.product = {
        ...draft.product,
        title: shopifyProduct ? shopifyProduct.title : draft.product.title,
        imageUrl: shopifyProduct && shopifyProduct.image ? shopifyProduct.image.src : draft.product.imageUrl
      }
    }


    const { projectId: id, product: draftProduct = {}, updatedAt, status } = draft;

    const li = document.createElement('li');
    li.classList.add('order', 'is-loading');
    li.setAttribute('data-project', id);

    const picture = new Image();
    picture.width = 100;
    picture.height = 100;
    picture.classList.add('order__image');

    if (draftProduct.imageUrl) {
      const response = await onImageLoad(picture, draftProduct.imageUrl);
      if (response instanceof Error) {
        picture.alt = response.message;
      }
    }

    const title = document.createElement('div');
    title.classList.add('order__title');

    let additionalInfo = '';

    switch (status) {
      case 'active':
        additionalInfo = ' (added to cart)';
        break;
      case 'draft':
        break;
      case 'ordered':
        additionalInfo = ' (ordered)'
        break;
      default:
        additionalInfo = ' (completed)'
        break;
    }

    title.textContent = draftProduct.title + additionalInfo;

    const lastUpdated = document.createElement('div');

    const secondsAgo = Math.floor((Date.now() - updatedAt) / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    const diffDaysHours = hoursAgo - daysAgo * 24;
    const diffHoursString = ` ${diffDaysHours} ${diffDaysHours === 1 ? 'hour' : 'hours'} ago`;

    const showTime = secondsAgo < 60
        ? `less than minute ago`
        : minutesAgo < 60
            ? `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`
            : hoursAgo < 24
                ? `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`
                : `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'}${diffDaysHours ? diffHoursString : ' ago'}`;

    lastUpdated.textContent = `Saved ${showTime}`;
    lastUpdated.classList.add('text');

    const orderSubInfo = document.createElement('div');
    orderSubInfo.classList.add('order__subinfo');

    orderSubInfo.append(title, lastUpdated);

    const orderInfo = document.createElement('div');
    orderInfo.classList.add('order__info');

    orderInfo.append(picture, orderSubInfo);

    const editBtn = document.createElement('a');
    editBtn.textContent = localization.drafts.edit;
    editBtn.classList.add('button', 'button--primary');
    editBtn.href = location.origin + `${Shopify.routes.root}apps/product-builder?project-id=${id}`;
    editBtn.disabled = status !== 'draft' && status !== 'active';
    if (status !== 'draft' && status !== 'active') {
      editBtn.href = '';
      editBtn.classList.add('is-disabled');

      editBtn.addEventListener('click', (event) => {
        event.preventDefault();
      })
    }

    const deleteBtn = document.createElement('button');
    deleteBtn.disabled = status !== 'draft' && status !== 'active';

    deleteBtn.addEventListener('click', () => {
      if (status !== 'draft' && status !== 'active') {
        return;
      }

      confirmModal.getConfirm({
        text: 'Are you sure you want to delete?',
        callback: () => {
          const deleteLink = `orders/delete/${id}?id=${customerId}&shop=${shopOrders}`;
          deleteBtn.classList.add('is-loading');
          deleteBtn.toggleAttribute('disabled');

          fetch(deleteLink, {
            method: 'DELETE',
          }).then(res => res.json()).then(data => {
            if (!data.error) {
              li.remove();
            } else {
              deleteBtn.classList.remove('is-loading');
              deleteBtn.toggleAttribute('disabled');
            }
          });
        },
        actionText: 'Delete'
      })
    })

    deleteBtn.classList.add('button', 'button--delete');
    const deleteContent = document.createElement('span');
    deleteContent.textContent = localization.drafts.delete;

    deleteBtn.innerHTML = deleteIcon;
    deleteBtn.append(deleteContent);

    const btnGroup = document.createElement('div');
    btnGroup.classList.add('order__button-group');

    btnGroup.append(deleteBtn, editBtn);

    const line = document.createElement('div');
    line.classList.add('order__line');
    
    li.append(orderInfo, line, btnGroup);

    res(li);
  });
}

const setOrders = (orders) => {
  draftsList.querySelectorAll('li.order').forEach(order => order.remove());

  const ordersItems = orders
    .sort((projectA, projectB) => projectB.updatedAt - projectA.updatedAt)
    .map(order => orderItem(order));

  Promise.all(ordersItems).then(items => {
    draftsList.append(...items);

    draftsList.classList.remove('is-loading');
    setTimeout(() => {
      items.forEach(item => item.classList.remove('is-loading'));
    }, 10);
  });
}

const ordersLink = location.origin + `/apps/product-builder/orders/list/` + customerId;

const initOrders = () => {
  fetch(ordersLink)
    .then(res => res.json())
    .then(orders => {
      console.log(orders);

      if (Array.isArray(orders) && orders.every(order => !order.error)) {
        setOrders(orders);
      } else if (orders.error) {
        userEmptyState();
      }
    });
}

if (customerId) {
  initOrders();
} else {
  userEmptyState();
}
