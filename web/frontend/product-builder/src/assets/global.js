const backButton = document.querySelector('[data-back-button]');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.go(-1);
  })
}

function ActiveActionsController() {
  let activeActions = [];

  window.addEventListener('click', (event) => {  
    activeActions.map(item => {
      const toClose = item.target !== event.target
        && !item.target.contains(event.target)
        && item.opener !== event.target
        && !item.opener.contains(event.target);
  
      if (toClose) {
        item.callback();
        item.closed = true;
      }
  
      return item;
    });
  
    activeActions = activeActions.filter(item => !item.closed)
  })

  const addToActiveAction = ({ target, opener, callback }) => {
    activeActions.push({
      target,
      opener,
      callback
    })
  }

  return addToActiveAction
}

const subsctibeToActionController = ActiveActionsController();

(function() {
  let counter = 0;

  const childBlock = () => {
    return 'childBlock-' + counter++;
  }

  const block = () => {
    return 'block-' + counter++;
  }

  window.uniqueID = {
    childBlock,
    block
  }
})();

const layouts = {
  whole: {
    id: 'whole',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20391)">
          <rect x="1" y="1" width="43" height="21" fill="#DDDDDD"/>
          <rect x="2.5" y="2.5" width="40" height="18" stroke="white" stroke-width="3"/>
        </g>
        <defs>
          <filter id="filter0_d_806_20391" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20391"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20391"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20391" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook']
  },
  wholeFrameless: {
    id: 'wholeFrameless',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20393)">
          <rect x="1" y="1" width="43" height="21" fill="#DDDDDD"/>
        </g>
        <defs>
          <filter id="filter0_d_806_20393" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20393"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20393"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20393" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook']
  },
  rightImageWithText: {
    id: 'rightImageWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20395)">
          <rect x="44" y="22" width="43" height="21" transform="rotate(-180 44 22)" fill="white"/>
        </g>
        <rect x="44" y="22" width="21" height="21" transform="rotate(-180 44 22)" fill="#D9D9D9"/>
        <rect x="17" y="14" width="9" height="1" rx="0.5" transform="rotate(-180 17 14)" fill="#FF8714"/>
        <rect x="15" y="12" width="5" height="1" rx="0.5" transform="rotate(-180 15 12)" fill="#FF8714"/>
        <rect x="17" y="10" width="9" height="1" rx="0.5" transform="rotate(-180 17 10)" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20395" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20395"/>
            <feOffset/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20395"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20395" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook']
  },
  leftImageWithText: {
    id: 'leftImageWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20403)">
          <rect x="1" y="1" width="43" height="21" fill="white"/>
        </g>
        <rect x="1" y="1" width="21" height="21" fill="#D9D9D9"/>
        <rect x="28" y="9" width="9" height="1" rx="0.5" fill="#FF8714"/>
        <rect x="30" y="11" width="5" height="1" rx="0.5" fill="#FF8714"/>
        <rect x="28" y="13" width="9" height="1" rx="0.5" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20403" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20403"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20403"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20403" result="shape"/>
          </filter>
        </defs>
      </svg>
      `,
    types: ['photobook']
  },
  bigWithThreeSquare: {
    id: 'bigWithThreeSquare',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20516)">
          <rect x="1" y="1" width="43" height="21" fill="white"/>
        </g>
        <rect x="3" y="3" width="33" height="17" fill="#D9D9D9"/>
        <rect x="37" y="3" width="5" height="5" fill="#D9D9D9"/>
        <rect x="37" y="9" width="5" height="5" fill="#D9D9D9"/>
        <rect x="37" y="15" width="5" height="5" fill="#D9D9D9"/>
        <defs>
          <filter id="filter0_d_806_20516" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20516"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20516"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20516" result="shape"/>
          </filter>
        </defs>
      </svg>
    `,
    types: ['photobook']
  },
  twoRectangleImagesWithText: {
    id: 'twoRectangleImagesWithText',
    icon: `
      <svg width="45" height="23" viewBox="0 0 45 23" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_806_20443)">
          <rect x="44" y="22" width="43" height="21" transform="rotate(-180 44 22)" fill="white"/>
        </g>
        <rect x="20" y="5" width="11" height="16" transform="rotate(90 20 5)" fill="#D9D9D9"/>
        <rect x="41" y="5" width="11" height="16" transform="rotate(90 41 5)" fill="#D9D9D9"/>
        <rect x="17" y="19" width="10" height="1" rx="0.5" transform="rotate(-180 17 19)" fill="#FF8714"/>
        <rect x="38" y="19" width="10" height="1" rx="0.5" transform="rotate(-180 38 19)" fill="#FF8714"/>
        <defs>
          <filter id="filter0_d_806_20443" x="0" y="0" width="45" height="23" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
          <feMorphology radius="1" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_806_20443"/>
          <feOffset/>
          <feComposite in2="hardAlpha" operator="out"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_806_20443"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_806_20443" result="shape"/>
          </filter>
        </defs>
      </svg>
    `,
    types: ['photobook']
  }
}

const ImageLimits = {
  size: 10 * 1048576,
  resolution: {
    width: 200,
    height: 200
  },
  types: ['image/jpeg', 'image/png', 'image/webp']
};

const sizes = {
  ...Array
    .from(Array(100), (_, idx) => idx + 1)
    .reduce((obj, item) => {
      obj['Set of ' + item] = item

      return obj;
    }, {}),
  '24 pages': 12,
  '36 pages': 18,
  '48 pages': 24
}

const globalState = {
  productId: null,
  product: null,
  view: {
    product: null,
    blocks: [],
    blockCount: 0
  },
  panel: {
    product: null,
    blockCount: 0,
    tools: {
      layout: {
        show: true,
      },
      text: {
        show: false
      }
    }
  },
}

const compareObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const productParams = new URLSearchParams(location.search);

class ProductBuilder extends HTMLElement {
  static selectors = {
    panel: '[customization-panel]',
    studioView: '[studio-view]'
  };

  static get observedAttributes() {
    return ['state']
  }
  
  constructor() {
    super();

    const instToRedirect = localStorage.getItem('instToRedirect');

    if (instToRedirect) {
      return this.redirectFromInst(instToRedirect);
    }

    this.panel = this.querySelector(ProductBuilder.selectors.panel);
    this.studioView = this.querySelector(ProductBuilder.selectors.studioView);

    this.init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (prevState.productId !== currState.productId) {
      this.getProduct(currState.productId)
        .then(data => Studio.utils.change({ product: data }));
      return;
    }

    if (!compareObjects(prevState.product, currState.product) && currState.product) {
      this.product = currState.product; 

      this.panel.setState({ product: currState.product });

      const { type, settings, shopify_id } = currState.product;
      this.studioView.setState({ product: { type, settings, shopify_id }});
    }

    if (!compareObjects(prevState.panel, currState.panel)) {
      this.panel.setState(currState.panel);
    }

    if (!compareObjects(prevState.view, currState.view)) {
      this.studioView.setState(currState.view);
    }

    if (prevState.panel.blockCount !== currState.panel.blockCount) {
      this.studioView.setState({ blockCount: currState.panel.blockCount });
    }
  }

  downloadFacebookAPI() {
    return new Promise((res, rej) => {
      const facebookScripts = document.createElement('script');

      facebookScripts.onload = () => {
        FB.init({
          appId: '535186395254481',
          autoLogAppEvent: true,
          version: 'v16.0'
        });
        res();
      };
      facebookScripts.onerror = () => rej();
  
      facebookScripts.src = "https://connect.facebook.net/en_US/sdk.js";
      this.appendChild(facebookScripts);
    })
  }

  redirectFromInst(instToRedirect) {
    const newQuery = JSON.parse(instToRedirect);

      localStorage.removeItem('instToRedirect');

      const redirectParams = new URLSearchParams(location.search);
      const access_token = redirectParams.get('access_token');
      const user_id = redirectParams.get('user_id');

      localStorage.setItem('oauthInstagram', JSON.stringify({
        access_token,
        user_id
      }));

      const url = new URL(location.pathname, location.origin);
      for (const key in newQuery) {
        url.searchParams.append(key, newQuery[key]);
      }

      location.href = url.href;
  }

  setState(state) {
    this.setAttribute('state', JSON.stringify(state));
  }

  onStateChange() {

  }

  async init() {
    this.setState(globalState);

    this.addEventListener('studio:change', (event) => {
      const { state } = event.detail;

      const currState = JSON.parse(this.getAttribute('state'));

      if (!state) {
        return;
      }

      // console.log(currState, state);
      
      this.setState({
        ...currState,
        ...state
      });
    })

    const customer = await this.getCustomer();

    this.setState({
      ...JSON.parse(this.getAttribute('state')),
      productId: productParams.get('id') || null,
    })

    Promise.all([this.downloadFacebookAPI()]).then(_ => {
      customElements.define('image-chooser', ImageChooser);
    });

    this.customer = customer;

    window.oauthInstagram = JSON.parse(localStorage.getItem('oauthInstagram'));

    // this.panel.init(product);

    this.addEventListener('image:check', this.checkImages.bind(this));

    this.dispatchEvent(new CustomEvent('studio:inited'));
  }

  getProduct(id) {
    let productId = productParams.get('id');

    if (id) {
      productId = id;
    }

    return fetch(`product-builder/product?id=${productId}`)
      .then(res => res.json());
  }

  getCustomer() {
    const customerId = window.customerId;

    return customerId
      ? fetch(`product-builder/customer?id=${customerId}`)
        .then(res => res.json())
      : null
  }

  checkImages() {
    this.panel.getImages()
      .forEach(image => {
        this.panel.tools.isSelectedImage(image, this.studioView.getImages().includes(image));
      })
  }
}
customElements.define('product-builder', ProductBuilder);

const StudioChange = () => {
  const change = (state) => {
    const changeEvent = new CustomEvent('studio:change', {
      detail: {
        state
      }
    });

    Studio.dispatchEvent(changeEvent);
  }

  return change;
}

window.Studio = document.querySelector('product-builder');
window.Studio.utils = {
  change: StudioChange()
};

class ErrorToast extends HTMLElement {
  static selectors = {
    text: '[data-text]',
    errorsContainer: '[data-errors]'
  }

  static timeOut = 10000;

  constructor() {
    super();

    this.errorContainer = this.querySelector(ErrorToast.selectors.errorsContainer);

    this.addEventListener('error:show', this.showErrors.bind(this));
  }

  showErrors({ detail: { text, type }}) {
    if (!this.hasAttribute('show')) {
      this.toggleAttribute('show');
    }

    this.createError(text
      ? text
      : `Error type: ${type}.`);

    clearTimeout(this.timeout);

    this.timeout = setTimeout(() => {
      this.toggleAttribute('show');

      this.errorContainer.innerHTML = '';
    }, ErrorToast.timeOut);
  }

  createError(text) {
    const errorWrapper = document.createElement('span');
    errorWrapper.toggleAttribute('data-text');

    errorWrapper.textContent = text;

    this.errorContainer.appendChild(errorWrapper);
  }
}
customElements.define('error-toast', ErrorToast);

class Radio extends HTMLElement {
  constructor() {
    super();

    this.toggler = this.querySelector('[data-toggler]');
    [this.option1, this.option2] = JSON.parse(this.getAttribute('values'));

    this.addEventListener('click', this.toggle.bind(this));

    this.init();
  }

  init() {
    const currValue = JSON.parse(this.getAttribute('value'))

    if (currValue === this.option1) {
      this.classList.add('option-1')
    } else {
      this.classList.add('option-2');
    }
  }

  toggle() {
    const currValue = JSON.parse(this.getAttribute('value'));

    if (currValue === this.option1) {
      this.setAttribute('value', this.option2);
      this.classList.replace('option-1', 'option-2')
    } else {
      this.setAttribute('value', this.option1);
      this.classList.replace('option-2', 'option-1');
    }

    this.dispatchEvent(new Event('change'));
  }
}
customElements.define('custom-radio', Radio);

class Switch extends HTMLElement {
  constructor() {
    super();

    this.items = [...this.querySelectorAll('[data-value]')]
      .map(item => {
        item.addEventListener('click', this.select.bind(this));

        return item;
      });

    this.selected = this.items.find(item => item.dataset.value === this.getAttribute('value'));
    this.runner = this.querySelector('[data-runner]');
  }

  select(event) {
    this.selected.classList.remove('is-selected');

    this.selected = event.currentTarget;
    this.selected.classList.add('is-selected');
    this.moveRunner();

    this.setAttribute('value', event.currentTarget.dataset.value);

    this.dispatchEvent(new CustomEvent('switch:changed', {
      detail: {
        value: this.getValue()
      }
    }));
  }

  moveRunner() {
    this.runner.style.transform = `translateX(${this.items.indexOf(this.selected) * 100}%)`;
  }

  getValue() {
    return this.selected.dataset.value;
  }
}
customElements.define('custom-switch', Switch);

class OptionSelector extends HTMLElement {
  static selectors = {
    selectedWrapper: '[data-selected]',
    optionsWrapper: '[data-options]',
    options: '[data-value]',
    selected: '[data-setted-value]'
  }

  constructor() {
    super();

    this.elements = {
      selectedWrapper: this.querySelector(OptionSelector.selectors.selectedWrapper),
      optionsWrapper: this.querySelector(OptionSelector.selectors.optionsWrapper),
      options: [...this.querySelectorAll(OptionSelector.selectors.options)]
        .map(option => {
          option.addEventListener('click', this.select.bind(this))

          return option;
        }),
      selected: this.querySelector(OptionSelector.selectors.selected)
    };

    this.elements.selectedWrapper.addEventListener('click', this.toggle.bind(this));
  }

  toggle() {
    const state = this.getAttribute('state') === 'open' ? 'open' : 'close';
    
    if (state === 'open') {
      this.close();
    } else {
      this.open();

      subsctibeToActionController({
        target: this,
        opener: this.elements.selectedWrapper,
        callback: this.close.bind(this)
      });
    }
  }

  close() {
    this.setAttribute('state', 'close');
    
    this.elements.optionsWrapper.classList.remove('is-open');
  }

  open() {
    this.setAttribute('state', 'open');

    this.elements.optionsWrapper.classList.add('is-open');
  }

  select(event) {
    this.elements.selected.textContent = event.currentTarget.textContent;
    this.elements.selected.dataset.settedValue = event.currentTarget.dataset.value;
    this.toggle();

    this.dispatchEvent(new CustomEvent('product-option:changed', {
      detail: {
        value: this.getValue()
      }
    }))
  }

  getValue() {
    return +this.elements.selected.dataset.settedValue;
  }

  optionTemplate = (variant) => {
    const option = document.createElement('div');
    option.classList.add('option-selector__item');
    option.dataset.value = sizes[variant];
    option.textContent = variant;

    option.addEventListener('click', this.select.bind(this));

    this.elements.optionsWrapper.appendChild(option);

    return option;
  }

  setData(option, selected) {
    if (!option) {
      this.style.display = 'none';
      return;
    }

    this.style.display = null;

    this.elements.selected.textContent = selected;
    this.elements.selected.dataset.settedValue = sizes[selected];

    this.elements.optionsWrapper.innerHTML = '';

    this.elements.options = option.values
      .map(variant => this.optionTemplate(variant));
  }
}
customElements.define('product-option-selector', OptionSelector);

class ProductInfo extends HTMLElement {
  static selectors = {
    image: '[data-product-image]',
    title: '[data-product-title]',
    selector: '[data-product-option-selector]',
    quantity: {
      wrapper: '[data-product-quantity]',
      current: '[data-product-curr-quantity]',
      request: '[data-product-req-quantity]',
    }  
  };

  static get observedAttributes() {
    return ['state']
  }

  constructor() {
    super();

    this.setAttribute('state', JSON.stringify({}));

    this.elements = {
      image: this.querySelector(ProductInfo.selectors.image),
      title: this.querySelector(ProductInfo.selectors.title),
      selector: this.querySelector(ProductInfo.selectors.selector),
      quantity: {
        wrapper: this.querySelector(ProductInfo.selectors.quantity.wrapper),
        current: this.querySelector(ProductInfo.selectors.quantity.current),
        request: this.querySelector(ProductInfo.selectors.quantity.request),
      }
    };

    this.elements.selector.addEventListener('product-option:changed', ((event) => {
      this.checkDoneProduct();
      this.setQuantity(event.detail.value);

      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute('state')),
          blockCount: event.detail.value
        }
      });
    }).bind(this));

    this.addEventListener('check-images', this.checkOnEvent.bind(this));
    this.parent = this.parentNode;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (compareObjects(prevState, currState)) {
      return;
    }

    const { product } = currState;

    this.setProduct(product);

    if (!this.elements.selector.style.display === 'none') {
      this.showSelector();
    }
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    };

    this.setAttribute('state', JSON.stringify(newState));
  }

  onStateChange(state) {
    const { image, title, options } = JSON.parse(state);
  }

  destroySelector() {
    this.elements.selector.style.display = 'none';
  }

  showSelector() {
    this.elements.selector.style.display = null;
  }

  setProduct(product) {
    this.elements.image.src = product.imageUrl + '&height=100';
    this.elements.title.textContent = product.title;

    const sizeOptions = product.options.find(option => option.name === 'Size');

    let selectedValue = productParams.get('size');

    if (sizeOptions && !sizeOptions.values.includes(productParams.get('size'))) {
      selectedValue = sizeOptions.values[0];
    }

    if (!sizeOptions) {
      this.destroySelector();
      return;
    }
    
    this.elements.selector.setData(sizeOptions, selectedValue);

    Studio.utils.change({
      panel: {
        ...JSON.parse(Studio.panel.getAttribute('state')),
        blockCount: sizes[selectedValue]
      }
    });

    this.setQuantity(sizes[selectedValue]);
  }

  checkOnEvent(event) {
    if (typeof event.detail.currentCount !== 'number') {
      return;
    }

    this.elements.quantity.current.textContent = event.detail.currentCount;

    this.checkDoneProduct();
  }

  checkDoneProduct() {
    const current = +this.elements.quantity.current.textContent;
    const required = +this.elements.quantity.request.textContent;

    if (current > required) {
      this.elements.quantity.current.textContent = required;
      this.checkDoneProduct();
      return;
    }

    if (current === required) {
      this.elements.quantity.wrapper.classList.remove('is-not-enough');
    } else {
      this.elements.quantity.wrapper.classList.add('is-not-enough');
    }
  }

  setQuantity(quantity) {
    this.elements.quantity.request.textContent = quantity;
  }
}
customElements.define('product-info', ProductInfo);

class Tool {
  static selectors = {
    editList: '[data-tools-list]'
  }

  constructor(label) {
    this.editList = document.querySelector(Tool.selectors.editList);

    this.timer = {
      in: null,
      out: null
    };

    this.container = document.createElement('div');
    this.container.classList.add('tool', 'page__tool');


    this.icon = (() => {
      const icon = document.createElement('span');

      icon.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"><g fill="none" fill-rule="evenodd"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M6.798 2.884a7.002 7.002 0 0 1 9.294 8.565l4.394 3.718a3.76 3.76 0 1 1-5.3 5.3l-3.717-4.394a7.002 7.002 0 0 1-8.565-9.295c.358-.894 1.48-1.007 2.063-.373L8.17 9.883l1.446-.288l.29-1.449l-3.48-3.198c-.634-.583-.522-1.706.373-2.064ZM8.805 4.42l2.763 2.54c.322.296.466.738.38 1.165l-.47 2.354a1.25 1.25 0 0 1-.982.981l-2.35.467a1.25 1.25 0 0 1-1.164-.38L4.438 8.785a5.002 5.002 0 0 0 6.804 5.25a1.257 1.257 0 0 1 1.422.355l4.05 4.786a1.76 1.76 0 1 0 2.48-2.48l-4.785-4.05a1.257 1.257 0 0 1-.355-1.422a5.001 5.001 0 0 0-5.25-6.804Z"/></g></svg>
      `;

      return {
        container: icon,
        setIcon: (svg) => icon.innerHTML = svg
      }
    })();

    this.label = this.initLabel('Label');

    if (label) {
      this.label.setLabel(label);
    }

    this.dropdownIcon = (() => {
      const plus = `
        <svg class="tool__plus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.75C8 2.47386 7.77614 2.25 7.5 2.25C7.22386 2.25 7 2.47386 7 2.75V7H2.75C2.47386 7 2.25 7.22386 2.25 7.5C2.25 7.77614 2.47386 8 2.75 8H7V12.25C7 12.5261 7.22386 12.75 7.5 12.75C7.77614 12.75 8 12.5261 8 12.25V8H12.25C12.5261 8 12.75 7.77614 12.75 7.5C12.75 7.22386 12.5261 7 12.25 7H8V2.75Z" fill="black"/>
        </svg>
      `;

      const minus = `
        <svg class="tool__minus" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.25 7.5C2.25 7.22386 2.47386 7 2.75 7H12.25C12.5261 7 12.75 7.22386 12.75 7.5C12.75 7.77614 12.5261 8 12.25 8H2.75C2.47386 8 2.25 7.77614 2.25 7.5Z" fill="black"/>
        </svg>
      `;

      const dropDown = document.createElement('span');
      dropDown.classList.add('tool__dropdown');
      dropDown.innerHTML = plus + minus;

      return dropDown;
    })();

    this.trigger = (() => {
      const trigger = document.createElement('div');
      trigger.classList.add('tool__trigger');
     
      const triggerInfo = document.createElement('div');
      triggerInfo.classList.add('tool__info');

      triggerInfo.append(this.icon.container);
      triggerInfo.append(this.label.title);

      trigger.append(triggerInfo);

      trigger.append(this.dropdownIcon);

      trigger.addEventListener('click', this.toggle.bind(this));

      return trigger;
    })();

    this.container.append(this.trigger);

    this.collapsible = (() => {
      const collapsible = document.createElement('div');
      collapsible.classList.add('tool__collapsible');

      const collapsibleInner = document.createElement('div');
      collapsibleInner.classList.add('tool__collapsible-inner');

      collapsible.append(collapsibleInner);

      this.container.append(collapsible);

      return {
        container: collapsible,
        inner: collapsibleInner
      }
    })();

    this.setContent();
  }
  
  open() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + 'px';

    clearTimeout(this.timer.in);
    clearTimeout(this.timer.out);
    
    this.timer.in = setTimeout(() => {
      this.collapsible.container.style.height = 'auto';
    }, 500);

    this.container.toggleAttribute('data-open');
  }

  close() {
    this.collapsible.container.style.height = this.collapsible.container.scrollHeight + 'px';

    clearTimeout(this.timer.in);
    clearTimeout(this.timer.out);

    this.timer.out = setTimeout(() => {
      this.collapsible.container.style.height = null;
      this.container.removeAttribute('data-open');
    }, 10);
  }

  toggle() {
    if (this.container.hasAttribute('data-open')) {
      this.close();
    } else {
      this.open();
    }
  }

  setContent() {
    const content = document.createElement('div');

    content.textContent = 'Content';

    this.collapsible.inner.append(content);
  }

  initLabel(label) {
    const title = document.createElement('span');
    title.classList.add('tool__title');

    title.textContent = label;

    return {
      title,
      setLabel: (label) => { title.textContent = label }
    };
  }

  setOnCreate(state) {
    return;
  }

  getValue() {
    return {
      value: 'Content'
    }
  }

  create(state) {
    this.container.style.opacity = 0;
    this.setOnCreate(state);

    this.editList.append(this.container);

    setTimeout(() => {
      this.container.style.opacity = null;
    }, 10);
  }

  remove() {
    this.container.style.opacity = 0;

    setTimeout(() => {
      this.container.style.opacity = null;
      this.container.remove();
    }, 300);
  }

  exists() {
    return document.contains(this.container);
  }
}

class LayoutTool extends Tool {
  constructor() {
    super();

    this.collapsible.inner.classList.add('tool__layout-grid');

    this.label.setLabel('Layout');

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M12.5 2H8V7H13V2.5C13 2.22386 12.7761 2 12.5 2ZM13 8H8V13H12.5C12.7761 13 13 12.7761 13 12.5V8ZM7 7V2H2.5C2.22386 2 2 2.22386 2 2.5V7H7ZM2 8V12.5C2 12.7761 2.22386 13 2.5 13H7V8H2ZM2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5Z" fill="black"/>
      </svg>
    `;
    this.icon.setIcon(icon);
  }

  setContent() {
    this.layouts = Object.keys(layouts)
      .map(layout => this.layoutIconTemplate(layout));

      for (const layout of this.layouts) {
        layout.append();
      }

    this.layouts[0].select();
  }

  setOnCreate(state) {
    if (!state) {
      return;
    }

    const { selected } = state;

    const newSelected = this.layouts
      .find(layout => layout.layoutId === selected);

    if (newSelected) {
      this.selected.unselect();

      newSelected.select();

      this.selected = newSelected;
    }
  }

  getValue() {
    return {
      layout: this.selected.layoutId
    }
  }

  layoutIconTemplate(layout) {
    const { icon: iconSVG } = layouts[layout];

    const icon = document.createElement('div');
    icon.classList.add('layout-icon');
    icon.setAttribute('data-layout', layout);

    const border = document.createElement('span');
    border.classList.add('layout__border');

    let layoutIcon = {};

    const select = () => {
      const selected = this.collapsible.inner.querySelector('.layout-icon.is-selected')

      if (selected) {
        selected.classList.remove('is-selected');
      }

      icon.classList.toggle('is-selected');

      this.selected = layoutIcon;

      Studio.studioView.dispatchEvent(new CustomEvent('change:layout', {
        detail: {
          layout: icon.dataset.layout
        }
      }))
    }

    const unselect = () => {
      icon.classList.toggle('is-selected');
    }

    icon.addEventListener('click', select);

    icon.innerHTML = iconSVG;

    icon.append(border);

    layoutIcon = Object.assign(layoutIcon, {
      append: () => { this.collapsible.inner.append(icon) },
      icon,
      select,
      unselect,
      layoutId: layout
    })

    return layoutIcon
  }
}

class TextTool extends Tool {
  constructor() {
    super();

    this.label.setLabel('Text');

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.95078 2.9498L3.95078 4.49977C3.95078 4.74829 3.74931 4.94977 3.50078 4.94977C3.25225 4.94977 3.05078 4.74829 3.05078 4.49977V2.49982C3.05078 2.45225 3.05816 2.4064 3.07185 2.36336C3.12963 2.18154 3.29983 2.0498 3.50079 2.0498H11.5008C11.6561 2.0498 11.7931 2.1285 11.8739 2.24821C11.9225 2.32003 11.9508 2.40661 11.9508 2.4998L11.9508 2.49982V4.49977C11.9508 4.74829 11.7493 4.94977 11.5008 4.94977C11.2523 4.94977 11.0508 4.74829 11.0508 4.49977V2.9498H8.05079V12.0498H9.25513C9.50366 12.0498 9.70513 12.2513 9.70513 12.4998C9.70513 12.7483 9.50366 12.9498 9.25513 12.9498H5.75513C5.50661 12.9498 5.30513 12.7483 5.30513 12.4998C5.30513 12.2513 5.50661 12.0498 5.75513 12.0498H6.95079V2.9498H3.95078Z" fill="black"/>
      </svg>
    `;

    this.icon.setIcon(icon);
  }

  selectorTemplate(data) {
    if (!data && !data.options) {
      return;
    }

    const wrapper = document.createElement('div');
    wrapper.classList.add('text-tool__selector-wrapper');

    const selector = document.createElement('select');
    selector.classList.add('text-tool__selector');

    data.options
      .map(option => {
        const container = document.createElement('option');

        container.value = option;
        container.textContent = option;

        selector.append(container);

        return container;
      });

    wrapper.append(selector);

    const icon = `
      <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.01493 3.57255L0.359375 0.916992H5.67049L3.01493 3.57255Z" fill="#888888"/>
      </svg>
    `;

    wrapper.innerHTML += icon;

    return wrapper;
  }

  setContent() {
    const container = document.createElement('div');
    container.classList.add('text-tool')

    const header = document.createElement('div');
    header.classList.add('text-tool__header');

    const selectType = this.selectorTemplate({ options: [
      'Paragraph',
      'Line'
    ]});

    const selectFont = this.selectorTemplate({ options: [
      'Times New Roman',
      'Arial',
      'Calibri'
    ]});

    header.append(selectType, selectFont);

    const tools = document.createElement('div');
    tools.classList.add('text-tool__tools');

    const text = document.createElement('span');
    text.classList.add('text-tool__text');
    text.toggleAttribute('contenteditable');

    container.append(header, tools, text);

    this.collapsible.inner.append(container);
  }
}

class Tools extends HTMLElement {
  static selectors = {
    playground: '[studio-view]',
    tabs: {
      wrapper: '[data-tabs]',
      tab: '[data-tab]',
      pagination: '[data-tabs-pagination]',
      runner: '[data-pagination-runner]'
    },
    pages: {
      wrapper: '[data-pages]',
      page: '[data-page]',
      products: {
        container: '[data-products-list]',
        product: '[data-product]',
        switch: '[data-product-switch-grid]',
        openProduct: '[data-product-button]'
      },
      images: {
        imageHide: '[data-image-hide]',
        makeMagic: '[data-make-magic]',
        imagesWrapper: '[data-images]',
        image: '[data-image]',
        uploadImage: '[data-upload-image]',
        uploadSelector: '[data-upload-wrapper]',
        importFromPC: '[data-import-from-pc]'
      },
      edit: {
        container: '[data-tools-list]',
        tool: '[data-tool]'
      }
    },
    errorToast: 'error-toast'
  }

  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();

    this.setAttribute('state', JSON.stringify(globalState.panel.tools));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (!compareObjects(prevState, currState)) {
      for (const tool in currState) {
        const { show } = currState[tool];
  
        if (show && this.edit.tools[tool]) {
          this.edit.tools[tool].create();
        } else {
          this.edit.tools[tool].remove();
        }
      }
    }
  }

  init() {
    this.setAttribute('state', JSON.stringify(globalState.panel.tools));

    this.errorToast = document.querySelector(Tools.selectors.errorToast);
    this.playground = document.querySelector(Tools.selectors.playground);

    this.initTabs();
    this.initPages();
    this.initEditPage();

    this.initEventListeners();

    this.inited = true;
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    };

    this.setAttribute('state', JSON.stringify(newState));
  }

  onStateChange() {
    const { tabs, products, images, edit } = this.state;


    console.log(tabs, products, images, edit);
  }

  initEventListeners() {
  }

  moveRunner() {
    this.tabs.runner.style.transform = `translate(${this.tabs.list.indexOf(this.tabs.selected) * 100}%, -50%)`;
  }

  initTabs() {
    const tabs = [...this
      .querySelector(Tools.selectors.tabs.wrapper)
      .querySelectorAll(Tools.selectors.tabs.tab)
    ].map(tab => {
        tab.addEventListener('click', this.handleSelectTab.bind(this))

        return tab;
      });

    const selectedTab = tabs.find(tab => tab.classList.contains('is-selected'));
    const runner = this.querySelector(Tools.selectors.tabs.runner);

    this.tabs = {
      list: tabs,
      selected: selectedTab,
      runner
    }

    this.moveRunner();
  }

  handleSelectTab(event) {
    if (event.currentTarget.classList.contains('is-disable')) {
      return;
    }

    this.tabs.selected.classList.remove('is-selected');
    
    event.currentTarget.classList.add('is-selected');

    this.tabs.selected = event.currentTarget;
  
    this.moveRunner();
    this.changePage();

    Studio.dispatchEvent(new CustomEvent('change', {
      detail: {
        tabs: {
          selected: this.tabs.selected
        }
      }
    }));
  }

  initPages() {
    const pages = [ ...this.querySelectorAll(Tools.selectors.pages.page) ];

    const selectedPage = pages.find(page => page.dataset.page === this.tabs.selected.dataset.tab);
    selectedPage.classList.add('is-selected');

    this.pages = {
      list: pages,
      selected: selectedPage
    };

    this.initProductPage();
    this.initImagePage();
  }

  selectProduct = (event) => {
    if (this.pages.products.selected) {
      this.pages.products.selected.classList.remove('is-selected');
    }

    this.pages.products.selected = event.currentTarget;
    this.pages.products.selected.classList.add('is-selected');

    document.dispatchEvent(new CustomEvent('page:products:changed', {
      detail: {
        page: this.pages.products.selected
      }
    }))
  };

  async initProductPage() {
    const productsContainer = this.querySelector(Tools.selectors.pages.products.container)

    const gridSwitch = this.querySelector(Tools.selectors.pages.products.switch);
    this.classList.add('product-grid--' + gridSwitch.getValue());
    gridSwitch.addEventListener('switch:changed', (event) => {
      this.pages.products.grid.value = event.detail.value;

      if (event.detail.value === 'line') {
        this.classList.replace('product-grid--grid', 'product-grid--line');
      } else if (event.detail.value === 'grid') {
        this.classList.replace('product-grid--line', 'product-grid--grid');
      }
    });

    const productsData = await fetch('product-builder/products')
      .then(res => res.json());

    const products = productsData
      .map(item => {
        productsContainer.appendChild(this.productTemplate.call(this, item));

        return item;
      });

    const openProductBtn = this.querySelector(Tools.selectors.pages.products.openProduct);
    openProductBtn.addEventListener('click', () => {
      if (this.pages.products.selected) {
        Studio.utils.change({
          productId: this.pages.products.selected.dataset.id
        })
      }
    })

    this.pages.products = {
      list: products,
      selected: null,
      grid: {
        switch: gridSwitch,
        value: gridSwitch.getValue
      }
    }
  }

  productTemplate(product) {
    const container = document.createElement('div');
    container.classList.add('page__product');
    container.dataset.id = product.shopify_id.split('/').pop();
    
    const productInner = `
      <img
        src="${product.imageUrl
          ? product.imageUrl + '&width=250&height=250'
          : 'https://cdn.shopify.com/shopifycloud/web/assets/v1/833d5270ee5c71c0.svg'}"
        width="140"
        height="140"
        alt="product image"
        class="page__product-image"
        draggable="false"
      >

      <div class="page__product-info">
        <div class="page__product-title">${product.title}</div>

        <div class="page__product-price">$10,90</div>
      </div>
    `;

    container.innerHTML = productInner;
    container.addEventListener('click', this.selectProduct.bind(this));

    return container;
  }

  changePage() {
    this.pages.selected.classList.remove('is-selected');

    this.pages.selected = this.pages.list.find(page => page.dataset.page === this.tabs.selected.dataset.tab);
    this.pages.selected.classList.add('is-selected');
  }

  initImagePage() {
    this.errorToast.addEventListener('error:show', (event) => {
      event.detail.imageWrapper.remove();
    })

    const imagesWrapper = this.querySelector(Tools.selectors.pages.images.imagesWrapper);

    const uploadButton = this.querySelector(Tools.selectors.pages.images.uploadImage);
    const uploadSelector = this.querySelector(Tools.selectors.pages.images.uploadSelector);

    const hideUsedImages = this.querySelector(Tools.selectors.pages.images.imageHide);
    hideUsedImages.addEventListener('change', () => {
      if (JSON.parse(hideUsedImages.getAttribute('value'))) {
        [...this.querySelectorAll(Tools.selectors.pages.images.image + '.is-selected')]
          .forEach(item => item.style.display = 'none');
      } else {
        [...this.querySelectorAll(Tools.selectors.pages.images.image + '.is-selected')]
          .forEach(item => item.style.display = null);
      }
    });

    uploadButton.addEventListener('click', () => {
      uploadSelector.classList.toggle('is-open');

      if (uploadSelector.classList.contains('is-open')) {
        subsctibeToActionController({
          target: uploadSelector,
          opener: uploadButton,
          callback: () => {
            uploadSelector.classList.remove('is-open');
            uploadSelector.style.height = null;
          }
        });

        uploadSelector.style.height = uploadSelector.scrollHeight + 'px';
      } else {
        uploadSelector.style.height = null;
      }
    });

    this.pages.images = {
      uploadButton,
      uploadSelector,
      imageList: []
    }

    const inputFromPC = this.querySelector(Tools.selectors.pages.images.importFromPC);
    this.inputFromPC = inputFromPC;

    inputFromPC.addEventListener('change', (async () => {
      Object.keys(inputFromPC.files)
        .forEach((file) => {
          const imageTemplate = this.createNewImage(inputFromPC.files[file]);

          if (imageTemplate) {
            imagesWrapper.appendChild(imageTemplate);
          }
        });
    }).bind(this))
  }

  createNewImage(imageFile) {
    const formData = new FormData();

    const image = new Image();
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('page__image-wrapper', 'is-loading');
    imageWrapper.toggleAttribute('data-image');

    imageWrapper.addEventListener('click', (event) => {
      const toDeleteBtn = imageWrapper.querySelector('[data-delete]');

      if (event.target !== toDeleteBtn && !toDeleteBtn.contains(event.target)) {
        this.playground.dispatchEvent(new CustomEvent('image:selected', {
          detail: {
            imageSrc: image.src
          }
        }));
      }
    });

    const deleteBtn = document.createElement('span');
    deleteBtn.toggleAttribute('data-delete');
    deleteBtn.classList.add('page__image-deleter');

    const deleteIcon = document.createElement('span');
    deleteIcon.classList.add('page__image-deleter-icon');
    deleteIcon.innerHTML = `
        <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.44531 7.01562L16.1551 15.7254" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M7.44531 15.7266L16.1551 7.01681" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    deleteBtn.append(deleteIcon);

    const deleteImage = () => {
      imageWrapper.remove();
    }

    deleteBtn.addEventListener('click', deleteImage, true);

    imageWrapper.append(deleteBtn);

    const setImage = (imageName) => {
      image.src = 'product-builder/uploads/' + imageName;

      image.onload = () => {
        imageWrapper.classList.remove('is-loading');
      };

      this.pages.images.imageList.push(image.src);
    }

    if (imageFile.size >= ImageLimits.size) {
      this.errorToast.dispatchEvent(new CustomEvent('error:show', {
        detail: {
          type: 'size',
          imageWrapper,
          text: `Some files have too big size. File: ${imageFile.name}`
        }
      }));
      return;
    }

    if (!ImageLimits.types.includes(imageFile.type)) {
      this.errorToast.dispatchEvent(new CustomEvent('error:show', {
        detail: {
          type: 'type',
          imageWrapper,
          text: `Some files have an incompatible type. File: ${imageFile.name}`
        }
      }))
      return;
    }

    const reader = new FileReader;

    reader.onload = async () => {
      image.src = reader.result;

      image.onload = async () => {
        if (image.naturalWidth <= ImageLimits.resolution.width && image.naturalHeight <= ImageLimits.resolution.height) {
          this.errorToast.dispatchEvent(new CustomEvent('error:show', {
            detail: {
              type: 'resolution',
              imageWrapper,
              text: `Some files are too low resolution. File: ${imageFile.name}`
            }
          }))
        } else {
          formData.append(this.inputFromPC.name, imageFile);

          console.log('to download');

          const response = await fetch('product-builder/uploads', {
            method: 'POST',
            body: formData
          });

          const imageName = await response.text();

          if (!this.pages.images.imageList.includes(imageName) && response.ok) {
            setImage(imageName);
          } else {
            this.errorToast.dispatchEvent(new CustomEvent('error:show', {
              detail: {
                type: "loadErr",
                imageWrapper,
                text: 'This image already uploaded'
              }
            }))
          }
        }
      }

      this.pages.images.uploadButton.dispatchEvent(new Event('click'));
      image.style.opacity = null;
    }

    reader.readAsDataURL(imageFile);

    image.style.opacity = 0;

    imageWrapper.appendChild(image);

    image.classList.add('page__image');
    image.width = "100";
    image.height = "100";
    image.alt = 'Image not uploaded';

    return imageWrapper;
  }

  getImages() {
    return this.pages.images.imageList;
  }

  isSelectedImage(imageLink, isSelected) {
    const imagesList = [...this.querySelectorAll(`.page__image`)];
    const image = imagesList.find(item => item.src === imageLink); 

    if (!image) {
      return;
    }

    if (isSelected) {
      image.parentElement.classList.add('is-selected');
    } else {
      image.parentElement.classList.remove('is-selected');
    }
  }

  initEditPage() {
    this.edit = {
      container: this.querySelector(Tools.selectors.pages.edit.container),
      tools: {
        layout: new LayoutTool(),
        text: new TextTool(),
        tool1: new Tool('Tool 1'),
        tool2: new Tool('Tool 2'),
        tool3: new Tool('Tool 3'),
      }
    }

    Studio.utils.change({ panel: {
      ...JSON.parse(Studio.panel.getAttribute('state')),
      tools: {
        layout: {
          show: false,
          value: this.edit.tools.layout.getValue()
        },
        text: {
          show: false,
          value: this.edit.tools.text.getValue()
        }
      }
    }})
  }

  setToolsState(tools) {
    const state = JSON.parse(this.getAttribute('state'));

    for (const tool in tools) {
      state[tool] = {
        ...state[tool],
        ...tools[tool]
      };
    }
    this.setAttribute('state', JSON.stringify(state));
  }

  setTools(tools) {
    for (const tool in tools) {
      switch (tool) {
        case 'layout':
          const { selected } = tools[tool];

          this.edit.tools.layout.create({ selected });
          break;

        case 'text':
          this.edit.tools.text.create();
      }
    }
  }
}
customElements.define('customization-tools', Tools);

class Panel extends HTMLElement {
  static selectors = {
    productInfo: '[data-product]',
    tools: '[data-customization-tools]'
  };

  static get observedAttributes() {
    return ['state'];
  }

  constructor() {
    super();

    this.productInfo = this.querySelector(Panel.selectors.productInfo);
    this.tools = this.querySelector(Panel.selectors.tools);

    this.setAttribute('state', JSON.stringify(globalState.panel));

    this.tools.addEventListener('tab:changed', (event) => {
      console.log('current tab: ' + event.detail.tab.dataset.tab);
    });

    this.tools.init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (!compareObjects(prevState.product, currState.product)) {
      this.productInfo.setState({
        product: currState.product
      });

      const { hasLayout, hasText } = currState.product.settings;

      this.tools.setToolsState({
        layout: {
          show: hasLayout
        },
        text: {
          show: hasText
        }
      })
    }

    const { layout, text } = currState.tools;

    this.tools.setToolsState({
      layout: {
        ...layout
      },
      text: {
        ...text
      }
    })
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    }

    this.setAttribute('state', JSON.stringify(newState));
  }

  onStateChange() {
    const { productInfo, tools } = this.state;

    this.tools.setState(tools);
    this.productInfo.setState(productInfo);
  }

  getImages() {
    return this.tools.getImages();
  }
}
customElements.define('customization-panel', Panel);

class EditablePicture extends HTMLElement {
  static emptyState = `
    <div class="editable-picture__empty-state">
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.10156 3.98131C1.10156 3.00356 1.89418 2.21094 2.87193 2.21094H13.9367C14.9145 2.21094 15.7071 3.00356 15.7071 3.98131V12.3906C15.7071 13.3683 14.9145 14.1609 13.9367 14.1609H2.87193C1.89418 14.1609 1.10156 13.3683 1.10156 12.3906V3.98131Z" stroke="#FF0079" stroke-width="1.77037" stroke-linejoin="round"/>
        <path d="M4.08594 14.1618L10.9214 6.7567C11.5568 6.06839 12.6184 5.99415 13.3434 6.58732L15.704 8.51875" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.10156 6.85938L6.2467 12.0045" stroke="#FF0079" stroke-width="1.77037"/>
        <path d="M8.73299 8.85104C8.73299 8.18715 7.54405 6.85938 6.07743 6.85938C4.61081 6.85938 3.42188 8.18715 3.42188 8.85104" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;

  constructor() {
    super();

    this.initImage();

    this.addEventListener('click', () => {
      Studio.studioView.setSelectedChild(this);
    })
  }

  connectedCallback() {
    this.toggleAttribute('editable-picture');
    this.setAttribute('child-block', window.uniqueID.childBlock());
  }

  initImage() {
  }

  select() {
    this.classList.add('is-selected');
  }

  unselect() {
    this.classList.remove('is-selected');
  }
  
  setImage(imageUrl) {
    if (this.image) {
      this.oldImage = this.image;
      this.oldImage.remove();
    }
    
    this.image = new Image();
    this.image.classList.add('editable-picture__image');
    this.image.style.opacity = 0;
    this.image.draggable = false;
    
    this.image.onload = () => {
      this.image.style.opacity = null;
        
    }
    
    this.image.src = imageUrl;
    
    this.classList.remove('is-empty');
    this.appendChild(this.image);
  }

  removeImage() {
    this.image.remove();

    this.classList.add('is-empty');
  }

  destroy() {
    this.remove();
  }
}
customElements.define('editable-picture', EditablePicture);

class ProductControls extends HTMLElement {
  static template = `
    <product-controls
      class="product-element__controls product-controls"
    >
      <button data-remove class="product-controls__button">
        <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.17499 4.75H16.225L15.8025 13.4914C15.6737 16.1559 13.4759 18.25 10.8083 18.25H8.59166C5.92407 18.25 3.72627 16.1559 3.59749 13.4914L3.17499 4.75Z" stroke="currentColor" stroke-width="2"/>
          <path d="M6.07501 4.75V4.75C6.07501 3.09315 7.41816 1.75 9.07501 1.75H10.325C11.9819 1.75 13.325 3.09315 13.325 4.75V4.75" stroke="currentColor" stroke-width="2"/>
          <path d="M11.875 9.25V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M7.52499 9.25V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M1.72501 4.75H17.675" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>                
      </button>

      <div class="product-controls__quantity" data-quantity>
        <button class="product-controls__button" data-quantity-add>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.52499 9.00977C6.52499 9.28591 6.30114 9.50977 6.02499 9.50977H4.75742C4.48127 9.50977 4.25742 9.28591 4.25742 9.00977V6.66113C4.25742 6.38499 4.03356 6.16113 3.75742 6.16113H1.3912C1.11506 6.16113 0.891205 5.93728 0.891205 5.66113V4.3584C0.891205 4.08226 1.11506 3.8584 1.3912 3.8584H3.75742C4.03356 3.8584 4.25742 3.63454 4.25742 3.3584V0.992188C4.25742 0.716045 4.48127 0.492188 4.75742 0.492188H6.02499C6.30114 0.492188 6.52499 0.716045 6.52499 0.992188V3.3584C6.52499 3.63454 6.74885 3.8584 7.02499 3.8584H9.40878C9.68493 3.8584 9.90878 4.08226 9.90878 4.3584V5.66113C9.90878 5.93728 9.68493 6.16113 9.40878 6.16113H7.02499C6.74885 6.16113 6.52499 6.38499 6.52499 6.66113V9.00977Z" fill="black"/>
          </svg>
        </button>

        <span data-quantity-count>
          1
        </span>

        <button class="product-controls__button" data-quantity-remove>
          <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.78867 3.05957H2.01132C1.58945 3.05957 1.26718 2.96289 1.04453 2.76953C0.827728 2.57031 0.71933 2.31543 0.71933 2.00488C0.71933 1.68848 0.824799 1.43359 1.03574 1.24023C1.25253 1.04102 1.57773 0.941406 2.01132 0.941406H4.78867C5.22226 0.941406 5.54453 1.04102 5.75546 1.24023C5.97226 1.43359 6.08066 1.68848 6.08066 2.00488C6.08066 2.31543 5.97519 2.57031 5.76425 2.76953C5.55331 2.96289 5.22812 3.05957 4.78867 3.05957Z" fill="black"/>
          </svg>
        </button>
      </div>

      <button data-edit class="product-controls__button">
        <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.30143 11.8619L13.6969 1.46643C13.7062 1.46378 13.7158 1.4611 13.7258 1.45839C13.8626 1.42133 14.0605 1.38264 14.2925 1.37944C14.7367 1.37331 15.3279 1.49293 15.9134 2.07843C16.4989 2.66392 16.6185 3.25504 16.6123 3.69925C16.6091 3.93131 16.5705 4.1292 16.5334 4.266C16.5307 4.27601 16.528 4.28563 16.5254 4.29486L6.12986 14.6904L2.91574 15.076L3.30143 11.8619Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M3.30143 11.8619L13.6969 1.46643C13.7062 1.46378 13.7158 1.4611 13.7258 1.45839C13.8626 1.42133 14.0605 1.38264 14.2925 1.37944C14.7367 1.37331 15.3279 1.49293 15.9134 2.07843C16.4989 2.66392 16.6185 3.25504 16.6123 3.69925C16.6091 3.93131 16.5705 4.1292 16.5334 4.266C16.5307 4.27601 16.528 4.28563 16.5254 4.29486L6.12986 14.6904L2.91574 15.076L3.30143 11.8619Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M11.1003 2.64844L15.141 6.68905" stroke="white" stroke-width="2"/>
          <path d="M11.1003 2.64844L15.141 6.68905" stroke="currentColor" stroke-width="2"/>
          <path d="M3.90781 1V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M6.39999 3.5L1.39999 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>  
        
        <span class="button__tooltip">
          Edit
        </span>
      </button>
    </product-controls>
  `;

  static selectors = {
    remove: '[data-remove]',
    quantity: {
      wrapper: '[data-quantity]',
      plus: '[data-quantity-add]',
      minus: '[data-quantity-remove]',
      count: '[data-quantity-count]',
    },
    edit: '[data-edit]'
  }

  constructor() {
    super();

    this.init();
  }

  init() {
    const parent = this.parentElement;

    const remove = this.querySelector(ProductControls.selectors.remove);
    const edit = this.querySelector(ProductControls.selectors.edit);

    const increaseQuantity = this.querySelector(ProductControls.selectors.quantity.plus);
    const decreaseQuantity = this.querySelector(ProductControls.selectors.quantity.minus);

    increaseQuantity.addEventListener('click', () => {
      parent.setQuantity(parent.getQuantity() + 1);

      this.setValue();
    });

    decreaseQuantity.addEventListener('click', () => {
      if (parent.getQuantity() > 1) {
        parent.setQuantity(parent.getQuantity() - 1);
      }

      this.setValue();
    });

    const quantity = this.querySelector(ProductControls.selectors.quantity.count);

    this.elements = {
      product: parent,
      remove,
      edit,
      increaseQuantity,
      decreaseQuantity,
      quantity
    }

    remove.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('clear:product', {
        detail: {}
      }))
    });

    edit.addEventListener('click', () => {
      console.log('should to edit');
    });
  }

  setValue() {
    this.elements.quantity.textContent = this.elements.product.getQuantity();

    this.elements.product
      .dispatchEvent(new CustomEvent('product-controls:quantity:changed', {
        detail: {
          value: this.elements.product.getQuantity()
        }
      }
    ));
  }
}
customElements.define('product-controls', ProductControls);

class ProductElement extends HTMLElement {
  static selectors = {
    picture: 'editable-picture',
    controls: 'product-controls'
  }

  static get observedAttributes() {
    return ['count-of-images'];
  }

  constructor() {
    super();

    this.addEventListener('click', this.select.bind(this));

    this.state = {
      selectedPicture: this.querySelector('editable-picture'),
    };
    this.studioView = document.querySelector('studio-view');

    this.state = {
      images: []
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'count-of-images' && +newValue === 0 ) {
      this.studioView.dispatchEvent(new CustomEvent('image:removed'));
    }
  }

  connectedCallback() {
    this.setAttribute('required-count-of-images', 1);
    this.setAttribute('count-of-images', 0);

    this.setAttribute('block', uniqueID.block());

    this.initControls();
  }

  initControls() {
    this.controls = this.querySelector(ProductElement.selectors.controls);
  
    this.controls.addEventListener('clear:product', (() => {
      this.clear()
    }).bind(this));
  }

  toggle(event) {
    if (this.classList.contains('is-selected')) {
      this.unselect(event.target);
      return;
    }

    this.select();
  }

  clear() {
    [...this.querySelectorAll(ProductElement.selectors.picture)]
      .forEach(picture => picture.removeImage());

    const currImages = this.querySelectorAll(ProductElement.selectors.picture + ':not(.is-empty)').length

    this.setAttribute('count-of-images', currImages);
  }

  setImage(imageUrl) {
    if (!this.state.selectedPicture) {
      this.state.selectedPicture = this.querySelector(ProductElement.selectors.picture);
    }

    this.state.selectedPicture.setImage(imageUrl);

    const currImages = this.querySelectorAll(ProductElement.selectors.picture + ':not(.is-empty)').length

    this.setAttribute('count-of-images', currImages);
  }
  

  select() {
    this.classList.add('is-selected');

    this.dispatchEvent(new CustomEvent('select', {
      detail: {
        element: this,
        id: this.getAttribute('block')
      }
    }))
  }

  unselect() {
    this.classList.remove('is-selected');

    this.dispatchEvent(new CustomEvent('unselect', {
      detail: {
        element: this,
        id: this.getId()
      }
    }))
  }

  getId() {
    return this.getAttribute('product-element');
  }

  setQuantity(newQuantity) {
    this.setAttribute('quantity', newQuantity);
  }

  getQuantity() {
    return +this.getAttribute('quantity');
  }
}
customElements.define('product-element', ProductElement);

class PhotobookPage extends HTMLElement {
  static selectors = {
    picture: 'editable-picture',
    text: '[data-textarea]',
    child: 'photobook-page > [data-child]'
  }

  static get observedAttributes() {
    return ['photobook-page'];
  }
  
  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('block', uniqueID.block());
    this.init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch(name) {
      case 'photobook-page':
        this.layout = layouts[newValue];
        this.selectLayout();
    }
  }

  init() {
    this.layout = layouts[this.getAttribute('photobook-page')];

    this.midGradiend = this.initMiddleGradient();
    this.midGradiend.create();

    this.selectLayout();
  }

  selectLayout() {
    if (!this.layout) {
      return;
    }

    const callback = this[this.layout.id + 'Layout'];

    if (callback) {
      callback.apply(this);
    }
  }

  initMiddleGradient() {
    const gradient = document.createElement('div');
    gradient.classList.add('photobook-page__gradient');

    const remove = () => {
      gradient.style.opacity = 0;

      setTimeout(() => {
        gradient.style.opacity = null;
        gradient.remove()
      }, 100); 
    }

    const create = () => {
      gradient.style.opacity = 0;
      this.append(gradient)

      setTimeout(() => {
        gradient.style.opacity = null;
      }, 10);
    }

    return {
      create,
      remove,
      container: gradient
    }
  }

  getEditable() {
    const picture = document.createElement('editable-picture')
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );

    picture.innerHTML += EditablePicture.emptyState;

    return picture;
  }

  getText(options = {
    line: false
  }) {
    const { line } = options;

    const container = document.createElement('div');
    container.classList.add('product-element__text', 'textarea-container');
      container.toggleAttribute('data-textarea', 'is-empty');

    const text = document.createElement('span');
    text.toggleAttribute('contenteditable');
    text.classList.add(
      'textarea',
    );

    if (line) {
      text.classList.add('line');
    }

    text.textContent = 'Add your description here';

    container.append(text);

    return container;
  }

  select() {
    this.classList.add('is-selected');
  }

  unselect() {
    this.classList.remove('is-selected');
  }

  clearLayout() {
    this.querySelectorAll(PhotobookPage.selectors.picture)
      .forEach(picture => picture.destroy());

    this.querySelectorAll(PhotobookPage.selectors.text)
      .forEach(text => text.remove());

    this.querySelectorAll(PhotobookPage.selectors.child)
      .forEach(item => item.remove());
  }

  wholeLayout() {
    this.clearLayout();

    const bigImage = this.getEditable();

    this.append(bigImage);

  }

  bigWithThreeSquareLayout() {
    this.clearLayout();

    const bigImage = this.getEditable();

    const small = [this.getEditable(), this.getEditable(), this.getEditable()];

    this.append(bigImage, ...small);

  }

  wholeFramelessLayout() {
    this.clearLayout();

    this.append(this.getEditable());

  }

  rightImageWithTextLayout() {
    this.clearLayout();

    const text = this.getText();

    const image = this.getEditable();

    this.append(text, image);

  }

  leftImageWithTextLayout() {
    this.clearLayout();

    const text = this.getText();

    const image = this.getEditable();

    this.append(image, text);

  }

  twoRectangleImagesWithTextLayout() {
    this.clearLayout();

    const [leftWrap, rightWrap] = [document.createElement('div'), document.createElement('div')];

    leftWrap.toggleAttribute('data-child');
    rightWrap.toggleAttribute('data-child');

    leftWrap.append(this.getEditable(), this.getText({ line: true }));
    rightWrap.append(this.getEditable(), this.getText({ line: true }));

    this.append(leftWrap, rightWrap);
  }
}
customElements.define('photobook-page', PhotobookPage);

class Tiles extends ProductElement {
  constructor() {
    super();
  }
}
customElements.define('product-tiles', Tiles);

class StudioView extends HTMLElement {
  static selectors = {
    sizeSelector: '[data-product-option-selector]',
    container: '[data-studio-view-container]',
    productElement: '[product-element]',
    productInfo: 'product-info',
    tools: 'customization-tools',
    block: '[block]',
    blockId: (id) => `[block="${id}"]`,
    editableById: (id) => `[editable-picture="${id}"]`,
    childBlock: '[child-block]',
    childBlockById: (id) => `[child-block="${id}"]`
  };

  static get observedAttributes() {
    return ['state']
  }

  constructor() {
    super();
    this.setAttribute('state', JSON.stringify(globalState.view));
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (!prevState || !currState) {
      return;
    }

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (!compareObjects(prevState.product, currState.product)) {
      const { type } = currState.product;

      this.init(currState.product);
      this.setProductElements(currState.blockCount, { clearAll: true });
    }

    if (!compareObjects(prevState.blocks, currState.blocks)) {
      const selectedBlock = prevState.blocks.find(block => block.selected || block.activeChild);
      const toSelectBlock = currState.blocks.find(block => block.selected || block.activeChild);

      if (compareObjects(selectedBlock, toSelectBlock)) {
        return;
      }

      const selected = this.querySelector(
        StudioView.selectors.blockId(selectedBlock?.id)
      );

      if (selected) {
        selected.unselect();
      }
      
      const toSelect = this.querySelector(
        StudioView.selectors.blockId(toSelectBlock?.id)
      );

      if (toSelect) {
        toSelect.select();
      }
    }

    if (currState.product && prevState.blockCount !== currState.blockCount) {
      this.setProductElements(currState.blockCount);
    }
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    };

    this.setAttribute('state', JSON.stringify(newState));
  }

  init(product) {
    if (!product) {
      return;
    }

    this.tools = document.querySelector(StudioView.selectors.tools);

    const container = this.querySelector(StudioView.selectors.container);

    const sizeSelector = document.querySelector(StudioView.selectors.sizeSelector);
    
    this.elements = {
      sizeSelector: sizeSelector,
      container,
      productInfo: document.querySelector(StudioView.selectors.productInfo)
    }

    this.state = {
      selected: [],
      selectedEditable: null,
      images: []
    };

    this.initEventListeners();

    this.inited = true;
  }

  initEventListeners() {
    this.addEventListener('image:removed', () => {
      this.checkProductsReady();
      this.parentElement.dispatchEvent(new CustomEvent('image:check'));
    });


    this.addEventListener('image:selected', (event) => {
      if (this.state.selected.length === 0) {
        console.log('error to image set');
      }
      this.state.selected.forEach(item => {
        const toSelect = this.querySelector(`[product-element="${item}"]`);

        if (toSelect) {
          toSelect.setImage(event.detail.imageSrc);
        }
      });

      this.checkProductsReady();

      this.parentElement.dispatchEvent(new CustomEvent('image:check'));
    });

    this.addEventListener('change:layout', (event) => {
      const selected = this.querySelector(StudioView.selectors.productElement + '.is-selected');

      if (selected) {
        selected.setAttribute('photobook-page', event.detail.layout);
      }
    })
  }

  checkProductsReady() {
    const imagesInfo = [...this.querySelectorAll('[product-element]')]
      .reduce((obj, item) => {
        if (+item.getAttribute('count-of-images') === +item.getAttribute('required-count-of-images')) {
          obj.currentCount++;
        }

        return obj;
      }, {
        currentCount: 0,
      });

    this.elements.productInfo.dispatchEvent(new CustomEvent('check-images', {
      detail: imagesInfo
    }));
  }

  createDefaultProductElement() {
    const productElement = document.createElement('product-element');
    productElement.classList.add('product-builder__element', 'product-element', 'is-default');
    productElement.setAttribute('quantity', 1);

    const picture = document.createElement('editable-picture');
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );

    picture.innerHTML += EditablePicture.emptyState;
    productElement.appendChild(picture);

    productElement.style.opacity = 0;
    setTimeout(() => {
      productElement.style.opacity = null;
    });

    productElement.addEventListener('product-controls:quantity:changed', (event) => {
      console.log(event.detail.value);
    });

    productElement.addEventListener('click', (event) => {
      this.setSelectedBlock(productElement);
    });

    productElement.innerHTML += ProductControls.template;

    this.elements.container.appendChild(productElement);
  }

  createPhotobookPage(layout) {
    const page = document.createElement('photobook-page');
    page.classList.add('photobook-page', 'product-builder__element');
    page.setAttribute('photobook-page', layout);

    page.addEventListener('click', () => {
      this.setSelectedBlock(page);
    })

    this.elements.container.append(page);
  }

  setSelectedBlock(block) {
    const selectedBlock = this.getBlockJSON(block);
    const { blocks } = JSON.parse(this.getAttribute('state'));

    const newBlocks = blocks
      .map(sBlock => {
        if (sBlock.id !== selectedBlock.id) {
          return {
            ...sBlock,
            selected: false
          }
        }

        return {
          ...sBlock,
          selected: true
        }
      })

    Studio.utils.change({
      view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocks
      }
    });
  }

  setSelectedChild(child) {
    const childID = child.getAttribute('child-block');

    const { blocks } = JSON.parse(this.getAttribute('state'));

    let childJSON;

    const blockJSON = blocks.find(block => {
      childJSON = block.childBlocks.find(item => item.id === childID);

      if (childJSON) {
        return true;
      }

      return false;
    });

    childJSON = {
      ...childJSON,
      selected: true
    }

    console.log(childJSON, blockJSON);
  }

  clearView(size) {
    const blocks =  this.elements.container.querySelectorAll(StudioView.selectors.block);

    if (!size) {
      return new Promise((res, rej) => {
        if (blocks.length === 0) {
          res();
        }

        blocks
          .forEach((item, idx) => {
            item.style.opacity = 0;
            item.setAttribute('quantity', 0);

            setTimeout(() => {
              item.remove();

              if (idx === blocks.length - 1) {
                res();
              }
            }, 300);
          })
      });
    }

    this.checkProductsReady();

    return new Promise((res, rej) => {
      if (blocks.length === 0) {
        res();
      }

      blocks
        .forEach((item, idx) => {
          if (idx >= size) {
            item.style.opacity = 0;
            item.setAttribute('quantity', 0);
            setTimeout(() => {
              item.remove();

              if (idx === blocks.length - 1) {
                res();
              }
            }, 300);
          }
        });
    })
  }

  getQuantity() {
    return [...this.elements.container
      .querySelectorAll(StudioView.selectors.productElement)]
      .reduce((sum, elem) => {
        return sum + +elem.getAttribute('quantity');
      }, 0) || 0;
  }

  setProductElements(size, options = {
    clearAll: false
  }) {
    const { product } = JSON.parse(this.getAttribute('state'));

    const waitToClear = [];

    if (!product) {
      return;
    }

    if (!options.clearAll) {
      if (size > this.elements.container.children.length) {
        const nowLength = this.elements.container.children.length;
  
        for (let i = 0; i < size - nowLength; i++) {
          switch(product.type.id) {
            case 'photobook':
              this.createPhotobookPage('whole');
              break;
            default:
              this.createDefaultProductElement();
              break;
          }
        }
      } else if (size < this.elements.container.children.length) {
        waitToClear.push(this.clearView(size));
      }
    } else {
      waitToClear.push(this.clearView());

      for (let i = 0; i < size; i++) {
        switch(product.type.id) {
          case 'photobook':
            this.createPhotobookPage('whole');
            break;
          default:
            this.createDefaultProductElement();
            break;
        }
      }
    }

    Promise.all(waitToClear).then(_ => {
        const blocksJSON = [...this.querySelectorAll(StudioView.selectors.block)]
          .map(block => this.getBlockJSON(block));

        Studio.utils.change({ view: {
          ...JSON.parse(this.getAttribute('state')),
          blocks: blocksJSON
        }});
      });
  }

  getBlockJSON(block) {
    const id = block.getAttribute('block');

    const childBlocks = [...block.querySelectorAll(StudioView.selectors.childBlock)];

    const blockJSON = {
      id,
      selected: block.classList.contains('is-selected'),
      activeChild: childBlocks.some(child => child.classList.contains('is-selected')),
      childBlocks: [
        ...childBlocks
          .map(child => this.getChildJSON(child))
      ]
    }

    return blockJSON
  }

  getChildJSON(child) {
    const key = child.getAttribute('child-block');

    return {
      type: child.hasAttribute('editable-picture') ? 'editable-picture' : 'text',
      id: key,
      selected: false
    }
  }

  getImages() {
    return [...this.querySelectorAll('.editable-picture__image')]
      .map(img => img.src);
  }
}
customElements.define('studio-view', StudioView);

class ImageChooser extends HTMLElement {
  static selectors = {
    imageList: '[data-images-list]',
    validateButton: '[data-validate]',
    cancel: '[data-cancel]',
    openButtons: {
      instagram: '[data-from-instagram]',
      facebook: '[data-from-facebook]',
    },
    image: '[data-image]',
    selectedImage: '[data-image].is-selected .image',
    tools: 'customization-tools',
    buttonsGroup: '[data-button-group]'
  };

  static ImageCheckedSVG = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12.0156" r="11" fill="#FF8714"/>
      <circle cx="12.0193" cy="12.035" r="10.1014" stroke="white" stroke-width="2.44882"/>
      <path d="M9.26562 11.9902L11.2136 13.9383L15.1097 10.0422" stroke="white" stroke-width="2.44882" stroke-linecap="round"/>
    </svg>
  `;
  
  constructor() {
    super();

    const cancelButton = this.querySelector(ImageChooser.selectors.cancel)
    cancelButton.addEventListener('click', this.close.bind(this));

    const validateButton = this.querySelector(ImageChooser.selectors.validateButton);
    validateButton.addEventListener('click', this.validateImages.bind(this));

    const instButton = document.querySelector(ImageChooser.selectors.openButtons.instagram);
    const facebookButton = document.querySelector(ImageChooser.selectors.openButtons.facebook);

    this.imageList = this.querySelector(ImageChooser.selectors.imageList);
    
    instButton.addEventListener('click', this.open.bind(this, 'instagram'));
    facebookButton.addEventListener('click', this.open.bind(this, 'facebook'));

    this.tools = document.querySelector(ImageChooser.selectors.tools);

    this.instLogin = this.initInstLogin();
    this.metaLogin = this.initMetaButton();
    this.logoutBtn = this.initLogoutButton();
  }

  close() {
    this.style.opacity = 1;

    setTimeout(() => {
      this.style.opacity = 0; 
    }, 0);

    setTimeout(() => {
      this.style.opacity = null; 
      this.classList.remove('is-open');
    }, 300);

    this.imageList.innerHTML = '';

    this.instLogin.remove();
    this.metaLogin.remove();
    this.logoutBtn.remove();
  }

  open(from) {
    this.style.opacity = 0;
    this.classList.add('is-open');

    setTimeout(() => {
      this.style.opacity = 1;
    }, 0);
  
    setTimeout(() => {
      this.style.opacity = null; 
    }, 300);

    const { customer } = Studio;

    this.logoutBtn.create(from);

    switch(from) {
      case 'facebook':
        if (this.instLogin.isExists()) {
          this.instLogin.remove();
        }

        let connectedFB, customerLinkedFB;

        FB.getLoginStatus(res => {
          if (res.status === 'connected') {
            connectedFB  = true;
          }
        })

        if (customer) {
          customerLinkedFB = customer.socials.find(social => social.name === 'facebook');
        }

        if (connectedFB) {
          this.getFacebookPhotos();
          break;
        }

        if (!customer || customer && !customerLinkedFB || !connectedFB) {
          this.metaLogin.create();
        } else if (customer && customerLinkedFB) {
          this.getFacebookPhotos();
        }
        break;

      case 'instagram':
        if (this.metaLogin.isExists()) {
          this.metaLogin.remove();
        }

        if (!window.oauthInstagram) {
          this.instLogin.create();
        } else {
          this.getInstagramPhotos();
        }
        break;
    }
  }

  async validateImages() {
    const imagesWrapper = document.querySelector(Tools.selectors.pages.images.imagesWrapper)

    const selectedImages = [...this.querySelectorAll(ImageChooser.selectors.selectedImage)];

    const FilesFromImages = await Promise.all(selectedImages
      .map((image) => new Promise(async (res, rej) => {
        const url = new URL(image.src);
  
        const blob = await fetch(image.src)
          .then(res => res.blob())
          .catch(res => rej(res));

        const file = new File([blob], url.pathname, blob);
  
        res(file);
    })))

    console.log(FilesFromImages);

    FilesFromImages
      .forEach(file => {
        const imageContainer = this.tools.createNewImage(file);

        if (imageContainer) {
          imagesWrapper.append(imageContainer);
        }
      });
    this.close();
  }

  imageTemplate(source) {
    const container = document.createElement('div');
    container.classList.add('image-container', 'load-container','is-loading');
    container.toggleAttribute('data-image');

    const selectTag = document.createElement('span');
    selectTag.classList.add('select-tag');
    selectTag.innerHTML = ImageChooser.ImageCheckedSVG;

    container.append(selectTag);

    const image = new Image;
    image.style.opacity = 0;
    image.classList.add('image');
    image.draggable = false;

    image.onload = () => {
      image.style.opacity = null;
      container.classList.remove('is-loading');
    };

    container.addEventListener('click', () => {
      container.classList.toggle('is-selected');
    });

    image.src = source;

    container.append(image);

    return container;
  }

  initInstLogin() {
    const container = document.createElement('div');
    container.classList.add('instagram-login', 'image-chooser__login');

    const button = document.createElement('button');
    button.classList.add('instagram-login__button', 'button', 'button--primary-action');
    button.addEventListener('click', this.loginInst.bind(this));
    button.textContent = 'Sign up with Instagram';

    container.append(button);

    return {
      remove: () => { container.remove() },
      create: () => { this.imageList.append(container) },
      isExists: () => this.imageList.contains(container)
    }
  }

  initMetaButton() {
    const container = document.createElement('div');
    container.classList.add('login', 'image-chooser__login');

    const button = document.createElement('button');
    button.classList.add('button', 'button--facebook');

    const icon = `
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_805_16765)">
        <path d="M18.7333 9.55722C18.7333 4.35253 14.5397 0.133301 9.36667 0.133301C4.1936 0.133301 0 4.35253 0 9.55722C0 14.2609 3.42524 18.1597 7.90313 18.8666V12.2813H5.52487V9.55722H7.90313V7.48101C7.90313 5.11914 9.30155 3.81452 11.4411 3.81452C12.4655 3.81452 13.5378 3.99858 13.5378 3.99858V6.31775H12.3567C11.1932 6.31775 10.8302 7.04423 10.8302 7.79023V9.55722H13.428L13.0127 12.2813H10.8302V18.8666C15.3081 18.1597 18.7333 14.2609 18.7333 9.55722Z" fill="white"/>
        </g>
        <defs>
        <clipPath id="clip0_805_16765">
        <rect width="18.7333" height="18.7333" fill="white" transform="translate(0 0.133301)"/>
        </clipPath>
        </defs>
      </svg>
    `;
    button.innerHTML += icon;

    const text = document.createElement('span');
    text.textContent = 'Log in with Facebook';
    button.appendChild(text);

    button.addEventListener('click', () => {
      FB.login(this.faceBookLoginFunc.bind(this), {
        scope: 'public_profile email user_photos'
      });
    })

    container.append(button);

    return {
      create: () => { this.imageList.appendChild(container)},
      remove: () => { container.remove() },
      isExists: () => this.imageList.contains(container)
    }
  }

  faceBookLoginFunc(response) {
    if (response.status === 'connected') {
      this.metaLogin.remove();

      this.getFacebookPhotos();
    }
  }

  async loginInst() {
    const instToRedirect = {
      id: productParams.get('id'),
      size: productParams.get('size')
    }

    localStorage.setItem('instToRedirect', JSON.stringify(instToRedirect));

    const state = JSON.stringify({
      shop: location.origin,
      customerId: window.customerId
    });

    const url = `https://api.instagram.com/oauth/authorize?client_id=${223768276958680}&redirect_uri=https://product-builder.dev-test.pro/api/instagram/oauth&scope=user_profile,user_media&response_type=code&state=${state}`;

    window.location = url;
  }

  clearImages() {
    this.imageList.querySelectorAll(ImageChooser.selectors.image)
      .forEach(image => image.remove());
  }

  initLogoutButton() {
    const buttonGroup = this.querySelector(ImageChooser.selectors.buttonsGroup);

    const button = document.createElement('button');
    button.classList.add('button', 'button--primary-action', 'image-chooser__logout');

    const faceBookLogout = () => {
      FB.logout(_ => {
        this.clearImages();
        this.metaLogin.create();
      })
    }

    const instagramLogout = () => {
      this.clearImages();

      window.oauthInstagram = null;
      localStorage.removeItem('oauthInstagram');

      this.instLogin.create();
    }

    const create = (from) => {    
      button.textContent = 'Logout from ' + from;

      if (from === 'facebook') {
        button.removeEventListener('click', instagramLogout);

        button.addEventListener('click', faceBookLogout)
      } else if (from === 'instagram') {
        button.removeEventListener('click', faceBookLogout);

        button.addEventListener('click', instagramLogout)
      }

      buttonGroup.append(button);
    }

    return {
      create,
      remove: () => { button.remove() }
    }
  }

  getFacebookPhotos() {
    FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        const { userID, accessToken: token } = response.authResponse;

        this.classList.add('is-loading');

        fetch(`https://graph.facebook.com/v16.0/${userID}/photos/uploaded?fields=id,name,images,created_time&access_token=${token}`)
          .then(res => res.json())
          .then(data => {
            const photos = data.data.map(photo => {
              return {
                id: photo.id,
                image: photo.images[0],
                name: photo.name ? photo.name : photo.created_time
              }
            });

            this.classList.remove('is-loading');

            photos
              .map(photo => photo.image.source)
              .forEach(photo => this.imageList.append(this.imageTemplate(photo)));
          });
      }
    });
  }

  async getInstagramPhotos() {
    this.classList.add('is-loading');

    const { access_token, user_id } = window.oauthInstagram;

    if (!access_token || !user_id) {
      return;
    }

    const photos = await fetch(`https://graph.instagram.com/${user_id}/media?fields=media_url,id,name,craeted_time&access_token=${access_token}`)
      .then(res => {
        console.log(res);
        if (!res.ok) {
          this.instLogin.create();
          
          return;
        }

        return res.json()
      })
      .then(res => {
        if (res && res.data) {
          return res.data.map(photo => {
            return {
              id: photo.id,
              image: photo.media_url,
              name: photo.name ? photo.name : photo.create_time
            }
          })
        }
      });

      this.classList.remove('is-loading');

      if (photos) {
        photos
          .map(photo => photo.image)
          .forEach(photo => {
            this.imageList.append(this.imageTemplate(photo))
          });
      }
  }
}