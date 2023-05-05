// import EditablePicture from './Elements/EditablePicture';
// console.log(EditablePicture);

// class ImageCropper {
//   constructor(mockup) {
//     this.container = document.createElement('div');
//     this.container.id = mockup.getId();
//     this.container.className = 'image-cropper';

//     this.mockup = mockup;

//     this.transform = {};

//     this.cropButton = document.querySelector('[data-tool-crop]');
//     this.cropButton.addEventListener('click', this.openCropPopup.bind(this));

//     this.createPopupContainer.apply(this);
//     this.createCloseAreaButton.apply(this);

//     document.body.append(this.container);
//   }

//   createPopupContainer() {
//     const popupHTML = `
//       <div class="popup-wrapper">
//         <div class="popup__header">
//           <span class="popup__title">Adjust Crop</span>
//           <span class="popup__info">Scroll to zoom, drag to move</span>
//         </div>
//         <div class="popup__image-wrapper">
//           <img class="popup__image" src="${this.mockup.image.src}">
//         </div>
//         <button>Done</button>
//       </div>
//     `;
//     const popup = document.createElement('div');
//     popup.classList.add('popup-wrapper');

    
//     this.container.innerHTML = popupHTML;
//     this.initImage.apply(this);
//   }

//   initImage() {
//     this.image = this.container.querySelector('.popup__image');

//     let scale = 1;
//     this.image.style.transform = `scale(${scale})`;

//     const minScale = 1;
//     const maxScale = 4;

//     this.image.addEventListener('wheel', (event) => {
//       scale += event.deltaY * -0.01;
//       scale = Math.min(Math.max(minScale, scale), maxScale);

//       this.transform.scale = `scale(${scale})`;
//       this.changeImageTransform.apply(this);
//     });

//     let isDown = false;
//     this.x = window.offsetWidth;
//     this.y = window.offsetHeight;

//     this.image.ondragstart = (event) => {
//       event.preventDefault();
//     };

//     this.image.addEventListener('mousedown', (event) => {
//       event.preventDefault();
//       isDown = true;
//     });

//     this.image.addEventListener('mouseup', (event) => {
//       event.preventDefault();
//       isDown = false;
//     });

//     this.image.addEventListener('mouseleave', (event) => {
//       isDown = false;
//     });

//     this.image.addEventListener('mousemove', (event) => {
//       if (!isDown) return;

//       console.log(this.x, event.offsetX, this.y, event.offsetY);
//       // this.transform.translate = `translate(${event.x - x}px, ${event.y - y}px)`;
//       // this.changeImageTransform();
//     })
//   }

//   changeImageTransform() {
//     this.image.style.transform = Object.keys(this.transform)
//     .reduce((trs, option) => {
//       trs += this.transform[option] + ' ';

//       return trs;
//     }, '');;
//   }

//   createCloseAreaButton() {
//     const button = document.createElement('div');
//     button.classList.add('image-cropper__close-toggler');
//     button.onclick = this.closeCropPopup.bind(this);

//     this.container.append(button);
//   }

//   openCropPopup() {
//     document.body.style.overflow = 'hidden';
//     this.container.classList.add('is-open');
//   }

//   closeCropPopup() {
//     document.body.style.overflow = null;
//     this.container.classList.remove('is-open');
//   }
// }

// class ProductMockup {
//   constructor(container, imageUrl) {
//     this.container = container;

//     this.filters = Object.keys(Caman.prototype).slice(75, 93);

//     this.image = new Image();
//     this.fileName = 'https://picsum.photos/600';

//     this.image.src = this.fileName;
//     this.image.setAttribute('Crossorigin', '');

//     this.canvas = this.container.querySelector('canvas');
//     this.ctx = this.canvas.getContext('2d');

//     this.canvas.style.opacity = 0;

//     this.canvasId = `#${this.canvas.id}`;

//     this.options = {};

//     this.image.onload = this.imageOnload.bind(this);

//     this.imageCropper = new ImageCropper(this);
//   }

//   getId() {
//     return +this.canvas.dataset.id;
//   }

//   imageOnload() {
//     this.container.style.width = `${this.image.width / 2}px`;
//     this.container.style.height = `${this.image.height / 2}px`;

//     this.canvas.setAttribute('width', this.image.width);
//     this.canvas.setAttribute('height', this.image.height);

//     this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

//     this.width = this.canvas.width;
//     this.height = this.canvas.height;
//     this.widthPadding = 0;
//     this.heightPadding = 0;

//     this.canvas.style.opacity = 1;
//   }

//   changeMat(option) {
//     this.ctx.reset();
//     this.options.mat = option;

//     const scale = {
//       'none': 1,
//       'shallow': 0.8,
//       'medium': 0.6,
//       'deep': 0.4
//     };

//     this.width = this.canvas.width * scale[option.toLowerCase()];
//     this.height = this.canvas.height * scale[option.toLowerCase()];
//     this.widthPadding = (this.canvas.width - this.width) / 2;
//     this.heightPadding = (this.canvas.height - this.height) / 2;

//     this.ctx.drawImage(this.image, this.widthPadding, this.heightPadding, this.width, this.height);

//     this.changeEffect(this.options.effect);
//   }

//   changeFrame(option) {
//     this.options.frame = option;

//     switch (option) {
//       case 'black':
//         this.container.style.border = '10px solid #000';
//         break;
//       case 'white':
//         this.container.style.border = '10px solid #fff';
//         break;
//       case 'frameless':
//         this.container.style.border = '0px solid transparent';
//         break;
//     }
//   }

//   changeEffect(option) {
//     if (!option) {
//       return;
//     }

//     this.options.effect = option;

//     switch (option) {
//       case 'original':
//         Caman(this.canvasId, function() {
//           this.revert(false);

//           this.render();
//         })
//         break;
//       case 'silver':
//         Caman(this.canvasId, function() {
//           this.revert(false);
//           this.sinCity().render();
//         });
//         break;
//       case 'noir':
//         Caman(this.canvasId, function() {
//           this.revert(false);
//           this.hemingway().render();
//         });
//         break;
//       case 'vivid':
//         Caman(this.canvasId, function() {
//           this.revert(false);
//           this.nostalgia().render();
//         });
//         break;
//       case 'dramatic':
//         Caman(this.canvasId, function() {
//           this.revert(false);
//           this.love().render();
//         });
//         break;
//     }
//   }
// }

// class BuilderTool {
//   constructor(container) {
//     this.container = container;

//     this.isOpen = this.container.dataset.isOpen === 'true' ? true : false;

//     this.closeButton = this.container.querySelector(`[data-toggler]`);

//     this.options = [...this.container.querySelectorAll('[data-tool-option]')];

//     this.options.forEach(option => {
//       option.addEventListener('click', this.selectOption.bind(this, option));
//     })

//     this.selectedOption = this.options
//       .find(option => option.classList.contains('is-selected'))
//       ?? this.options[0];

//     if (this.selectedOption && !this.selectedOption.classList.contains('is-selected')) {
//       this.selectedOption.classList.add('is-selected');
//     }

//     if (this.closeButton) {
//       this.closeButton.addEventListener('click', this.close.bind(this));
//     }

//     if (this.isOpen) {
//       this.open();
//     }
//   }

//   open() {
//     this.isOpen = true;
//     this.container.classList.add('is-open');
//   }

//   close() {
//     this.isOpen = false;
//     this.container.classList.remove('is-open');
//   }

//   tool() {
//     return this.container.dataset.tool;
//   }

//   optionsValue() {
//     return this.options.map(option => option.dataset.toolOption);
//   }

//   selectOption(option) {
//     option.classList.add('is-selected');

//     this.options.filter(unselected => unselected !== option)
//       .forEach(unselected => unselected.classList.remove('is-selected'));

//     this.selectedOption = option;

//     document.dispatchEvent(new CustomEvent('product-builder:option-changed', {
//       detail: {
//         tool: this.tool.apply(this),
//         option: this.selectedOption.dataset.toolOption
//       }
//     }))
//   }

//   selected() {
//     return this.selectedOption.dataset.toolOption;
//   }
// }

// class ProductBuilder extends HTMLElement {
//   static MockupHTML = (id) => {
//     const newMockup = document.createElement('div');
//     newMockup.className = 'product-builder__item product-mockup';
//     newMockup.dataset.builderMockup = '';

//     const newCanvas = document.createElement('canvas');
//     newCanvas.id = `mockup-${id}`;
//     newCanvas.dataset.id = id;

//     newMockup.append(newCanvas);

//     return newMockup
//   };

//   constructor() {
//     super();

//     this.builderToolsContainer = document.querySelector('[data-builder-tools');

//     this.viewport = this.querySelector('[data-builder-viewport]');

//     this.mockups = [...this.querySelectorAll('[data-builder-mockup]')]
//       .map(mockup => {
//         return new ProductMockup(mockup);
//       });

//     this.mockups.forEach(mockup => {
//       mockup.container.addEventListener('click', this.selectFocusedMockups.bind(this, mockup));
//     });

//     this.focusedMockups = this.mockups;

//     this.tools = [...document.querySelectorAll('[data-tool]')]
//       .map(mockup => {
//         const tool = new BuilderTool(mockup);

//         const openButton = document.querySelector(`[data-toggler="${tool.tool()}"]`);
//         openButton.addEventListener('click', () => {
//           tool.open();

//           this.tools.filter(toClose => toClose != tool)
//             .forEach(toClose => toClose.close());
//         })

//         return tool;
//       });

//     this.currentOptions = this.tools.reduce((obj, curr) => {
//       obj[curr.tool()] = curr.selected();

//       return obj;
//     }, {});

//     this.addMockupButton = this.querySelector('[data-product-builder-add-button]');
//     this.addMockupButton.addEventListener('click', this.addMockup.bind(this));

//     document.addEventListener('product-builder:option-changed', (event) => {
//       const { tool, option } = event.detail;
//       this.currentOptions[tool] = option;

//       switch (tool) {
//         case 'mat':
//           this.focusedMockups.forEach(mockup => mockup.changeMat(this.currentOptions[tool]));
//           break;
//         case 'frame':
//           this.focusedMockups.forEach(mockup => mockup.changeFrame(this.currentOptions[tool]));
//           break;
//         case 'effect':
//           this.focusedMockups.forEach(mockup => mockup.changeEffect(this.currentOptions[tool]));
//           break;
//       }
//     });

//     this.unfocusButton = this.querySelector('[data-unfocus-button]');
//     this.unfocusButton.addEventListener('click', this.unfocus.bind(this));
//   }

//   unfocus() {
//     if (this.tools.some(tool => tool.isOpen)) {
//       this.tools.forEach(tool => {
//         tool.close();
//       })
//     } else {
//       this.classList.remove('is-focused');
//       this.builderToolsContainer.classList.remove('is-fixed');
  
//       this.focusedMockups.forEach(mockup => {
//         mockup.container.classList.remove('is-focused');
//       })
  
//       this.focusedMockups = this.mockups;
//       this.closeCropButton.apply(this);
//     }
//   }

//   addMockup() {
//     const newId = Math.max(...this.mockups.map(mockup => mockup.getId())) + 1;
//     const newMockupHTML = ProductBuilder.MockupHTML(newId);

//     this.viewport.append(newMockupHTML);

//     const newMockup = new ProductMockup(newMockupHTML);

//     this.mockups.push(newMockup);
//     newMockup.container.addEventListener('click', this.selectFocusedMockups.bind(this, newMockup));
//   }

//   openCropButton() {
//     const cropButton = this.builderToolsContainer.querySelector('[data-tool-crop]');
//     cropButton.classList.remove('hidden');
//   }

//   closeCropButton() {
//     const cropButton = this.builderToolsContainer.querySelector('[data-tool-crop]');
//     cropButton.classList.add('hidden');
//   }

//   selectFocusedMockups(targetMockup) {
//     this.focusedMockups = this.mockups.filter(mockup => {
//       return mockup === targetMockup;
//     });

//     this.focusedMockups.forEach(mockup => {
//       mockup.container.classList.add('is-focused');
      
//       this.tools.forEach(tool => {
//         const option = tool.options
//           .find(finded => finded.dataset.toolOption === mockup.options[tool.tool()])
//             ?? tool.options[0];

//         tool.selectOption(option);
//       })
//     });

//     this.classList.add('is-focused');
//     this.builderToolsContainer.classList.add('is-fixed');
//     this.openCropButton.apply(this);
//   }
// }

// customElements.define('product-builder', ProductBuilder);

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

  window.uniqueId = () => {
    return 'id-' + counter++;
  }
})();

const ImageLimits = {
  size: 3 * 1048576,
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
    }, {})
}

const productParams = new URLSearchParams(location.search);

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

    this.dispatchEvent(new CustomEvent('page:product:grid:changed', {
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
    return this.elements.selected.dataset.settedValue;
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

  constructor() {
    super();

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
    }).bind(this));

    this.addEventListener('check-images', this.checkOnEvent.bind(this));
  }

  setProduct(product) {
    this.elements.image.src = product.imageUrl + '&height=100';
    this.elements.title.textContent = product.title;

    const sizeOptions = product.options.find(option => option.name === 'Size');
    
    this.elements.selector.setData(sizeOptions, productParams.get('size'));

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
        switch: '[data-product-switch-grid]'
      },
      images: {
        imageHide: '[data-image-hide]',
        makeMagic: '[data-make-magic]',
        imagesWrapper: '[data-images]',
        image: '[data-image]',
        uploadImage: '[data-upload-image]',
        uploadSelector: '[data-upload-wrapper]',
        importFromPC: '[data-import-from-pc]'
      }
    },
    errorToast: 'error-toast'
  }

  constructor() {
    super();

    this.init();
  }

  init() {
    this.errorToast = document.querySelector(Tools.selectors.errorToast);
    this.playground = document.querySelector(Tools.selectors.playground);

    this.initTabs();
    this.initPages();
  }

  initTabs() {
    const tabs = [...this
      .querySelector(Tools.selectors.tabs.wrapper)
      .querySelectorAll(Tools.selectors.tabs.tab)
    ].map(tab => {
        tab.addEventListener('click', this.selectTab.bind(this))

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
    gridSwitch.addEventListener('page:product:grid:changed', (event) => {
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
      .filter(product => !product.shopify_id.includes(productParams.get('id')))
      .map(item => {
        productsContainer.appendChild(this.productTemplate.call(this, item));

        return item;
      });

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
    container.dataset.id = product._id;
    
    const productInner = `
      <img
        src="${product.imageUrl
          ? product.imageUrl + '&width=250&height=250'
          : 'https://cdn.shopify.com/shopifycloud/web/assets/v1/833d5270ee5c71c0.svg'}"
        width="140"
        height="140"
        alt="product image"
        class="page__product-image"
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

  selectTab(event) {
    this.tabs.selected.classList.remove('is-selected');
    
    event.currentTarget.classList.add('is-selected');

    this.tabs.selected = event.currentTarget;
  
    this.moveRunner();
    this.changePage();

    this.dispatchEvent(new CustomEvent('tab:changed', {
      detail: {
        tab: this.tabs.selected 
      }
    }));
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

  moveRunner() {
    this.tabs.runner.style.transform = `translate(${this.tabs.list.indexOf(this.tabs.selected) * 100}%, -50%)`;
  }
}
customElements.define('customization-tools', Tools);

class Panel extends HTMLElement {
  static selectors = {
    productInfo: '[data-product]',
    tools: '[data-customization-tools]'
  };

  constructor() {
    super();

    this.productInfo = this.querySelector(Panel.selectors.productInfo);
    this.tools = this.querySelector(Panel.selectors.tools);

    this.tools.addEventListener('tab:changed', (event) => {
      console.log('current tab: ' + event.detail.tab.dataset.tab);
    });
  }

  init(product) {
    this.productInfo.setProduct(product);
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
  }

  connectedCallback() {
  }

  initImage() {
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
        id: this.getId()
      }
    }))
  }

  unselect(target) {
    if (target !== this) {
      return;
    }

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
    productInfo: 'product-info'
  };

  constructor() {
    super();
  }

  init(product) {
    if (!product) {
      return;
    }

    const container = this.querySelector(StudioView.selectors.container);

    const sizeSelector = document.querySelector(StudioView.selectors.sizeSelector);
    sizeSelector.addEventListener('product-option:changed', ((event) => {
      this.setProductElements(event.detail.value);
    }).bind(this));
    
    this.elements = {
      sizeSelector: sizeSelector,
      container,
      productInfo: document.querySelector(StudioView.selectors.productInfo)
    }

    this.state = {
      selected: [],
      images: []
    };

    this.addEventListener('image:removed', () => {
      this.checkProductsReady();
      this.parentElement.dispatchEvent(new CustomEvent('image:check'));
    })


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
    })

    this.setProductElements(+sizeSelector.querySelector('[data-setted-value]').dataset.settedValue);
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

  createDefaultProductElement(id) {
    const productElement = document.createElement('product-element');
    productElement.classList.add('product-builder__element', 'product-element', 'is-default');
    productElement.setAttribute('product-element', id || '');
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

    productElement.addEventListener('select', (event) => {
      this.state.selected.forEach(item => {
        if (event.currentTarget.getAttribute('product-element') === item) {
          return;
        }

        const toRemove = this.querySelector(`[product-element="${item}"]`)
        if (toRemove) {
          toRemove.classList.remove('is-selected');
        }
      })

      this.state.selected = [event.detail.id];
    });

    productElement.addEventListener('unselect', (event) => {
      this.state.selected = this.state.selected.filter(item => item !== event.detail.id);
    })

    productElement.innerHTML += ProductControls.template;

    this.elements.container.appendChild(productElement);
  }

  clearView(size) {
    this.elements.container.querySelectorAll(StudioView.selectors.productElement)
      .forEach((item, idx) => {
        if (idx >= size) {
          item.style.opacity = 0;
          item.setAttribute('quantity', 0);
          setTimeout(() => {
            this.elements.container.removeChild(item)
          }, 300);
        }
      });

      this.checkProductsReady();
  }

  getQuantity() {
    return [...this.elements.container
      .querySelectorAll(StudioView.selectors.productElement)]
      .reduce((sum, elem) => {
        return sum + +elem.getAttribute('quantity');
      }, 0) || 0;
  }

  setProductElements(size) {
    if (size > this.elements.container.children.length) {
      const nowLength = this.elements.container.children.length;

      for (let i = 0; i < size - nowLength; i++) {
        this.createDefaultProductElement(uniqueId());
      }
    } else if (size < this.elements.container.children.length) {
      this.clearView(size);
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

    const photos = await fetch(`https://graph.instagram.com/${user_id}/media?fields=media_url,id,name,craeted_time&access_token=${access_token}`)
      .then(res => res.json())
      .then(res => {
        if (res.data) {
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

      photos
        .map(photo => photo.image)
        .forEach(photo => {
          this.imageList.append(this.imageTemplate(photo))
        });
  }
}

class ProductBuilder extends HTMLElement {
  static selectors = {
    panel: '[customization-panel]',
    studioView: '[studio-view]'
  };
  
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

  async init() {
    const productId = productParams.get('id');
    const customerId = window.customerId;

    if (!productId) {
      return;
    }

    const product = await fetch(`product-builder/product?id=${productId}`)
      .then(res => res.json());

    const customer = customerId
      ? await fetch(`product-builder/customer?id=${customerId}`)
        .then(res => res.json())
      : null;

    Promise.all([this.downloadFacebookAPI()]).then(_ => {
      customElements.define('image-chooser', ImageChooser);
    });

    this.product = product;
    this.customer = customer;

    window.oauthInstagram = JSON.parse(localStorage.getItem('oauthInstagram'));

    console.log(this.customer);

    this.panel.init(product);
    this.studioView.init(product);

    this.addEventListener('image:check', this.checkImages.bind(this));
  }

  checkImages() {
    this.panel.getImages()
      .forEach(image => {
        this.panel.tools.isSelectedImage(image, this.studioView.getImages().includes(image));
      })
  }
}
customElements.define('product-builder', ProductBuilder);

window.Studio = document.querySelector('product-builder');

document.addEventListener('page:product:grid:changed', (event) => {
  console.log('grid changed: ' + event.detail.value );
});
