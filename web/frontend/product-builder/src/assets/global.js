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

const activeActions = [];

// window.addEventListener('click', (event) => {
//   console.log(event.target);
  
//   activeActions.forEach(item => {
//     const toClose = item.target !== event.target
//       || !item.target.contains(event.target)
//       || item.opener !== event.target
//       || !item.opener.contains(event.target)

//     if (toClose) {
//       console.log(item,
//       item.opener.contains(event.target)
//       );
//       item.callback();
//     }
//   })
// })

const sizes = {
  ...Array
    .from(Array(100), (_, idx) => idx + 1)
    .reduce((obj, item) => {
      obj['Set of ' + item] = item

      return obj;
    }, {})
}

const productParams = new URLSearchParams(location.search);

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

    this.elements.selector.addEventListener('product-option:changed', this.setQuantity.bind(this));
  }

  setProduct(product) {
    this.elements.image.src = product.imageUrl + '&height=100';
    this.elements.title.textContent = product.title;

    const sizeOptions = product.options.find(option => option.name === 'Size');
    
    this.elements.selector.setData(sizeOptions, productParams.get('size'));

  }

  setQuantity() {
    this.elements.quantity.request.textContent = event.detail.value;
  }
}
customElements.define('product-info', ProductInfo);

class Tools extends HTMLElement {
  static selectors = {
    tabs: {
      wrapper: '[data-tabs]',
      tab: '[data-tab]',
      pagination: '[data-tabs-pagination]',
      runner: '[data-pagination-runner]'
    },
    pages: {
      wrapper: '[data-pages',
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
    }
  }

  constructor() {
    super();

    this.init();
  }

  init() {
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
    const imagesWrapper = this.querySelector(Tools.selectors.pages.images.imagesWrapper);

    const uploadButton = this.querySelector(Tools.selectors.pages.images.uploadImage);
    const uploadSelector = this.querySelector(Tools.selectors.pages.images.uploadSelector);

    uploadButton.addEventListener('click', () => {
      uploadSelector.classList.toggle('is-open');

      if (uploadSelector.classList.contains('is-open')) {
        activeActions.push({
          target: uploadSelector,
          opener: uploadButton,
          callback: () => {uploadSelector.classList.remove('is-open')}
        })
        uploadSelector.style.height = uploadSelector.scrollHeight + 'px';
      } else {
        uploadSelector.style.height = null;
      }
    });

    this.pages.images = {
      uploadButton,
      uploadSelector
    }

    const inputFromPC = this.querySelector(Tools.selectors.pages.images.importFromPC);
    inputFromPC.addEventListener('change', (() => {
      Object.keys(inputFromPC.files)
        .forEach((file) => {
          imagesWrapper.appendChild(this.imageTemplate(inputFromPC.files[file]))
        })
    }).bind(this))

  }

  imageTemplate(imageFile) {
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('page__image-wrapper');
    imageWrapper.dataset.image = '';

    const image = new Image();

    if (typeof imageFile === 'string') {
      image.src = imageFile;
    } else {
      const reader = new FileReader;
      reader.onload = () => {
        image.src = reader.result;
  
        this.pages.images.uploadButton.dispatchEvent(new Event('click'));

        imageWrapper.appendChild(image);
      };
  
      reader.readAsDataURL(imageFile);
    }    

    image.classList.add('page__image');
    image.width = "100";
    image.height = "100";
    image.alt = 'Image not uploaded';


    return imageWrapper;
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
}
customElements.define('customization-panel', Panel);

class EditablePicture extends HTMLElement {
  static emptyState = `
    <div class="editable-picture__empty-state">
      <svg class="icon__empty-state" width="18" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.75 4.25C1.75 3.14543 2.64543 2.25 3.75 2.25H16.25C17.3546 2.25 18.25 3.14543 18.25 4.25V13.75C18.25 14.8546 17.3546 15.75 16.25 15.75H3.75C2.64543 15.75 1.75 14.8546 1.75 13.75V4.25Z" stroke="#FF8714" stroke-width="2" stroke-linejoin="round"/>
        <path d="M5.125 15.75L12.8471 7.3844C13.5649 6.60681 14.7641 6.52294 15.5832 7.19305L18.25 9.375" stroke="#FF8714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.75 7.5L7.5625 13.3125" stroke="#FF8714" stroke-width="2"/>
        <path d="M10.375 9.75C10.375 9 9.03185 7.5 7.375 7.5C5.71815 7.5 4.375 9 4.375 9.75" stroke="#FF8714" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;

  constructor() {
    super();
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
      </button>
    </product-controls>
  `;

  static selectors = {
    remove: '[data-remove]',
    quantity: {
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
    const remove = this.querySelector(ProductControls.selectors.remove);
    const edit = this.querySelector(ProductControls.selectors.edit);

    this.elements = {
      remove,
      edit
    }

    console.log(this.elements);
  }
}
customElements.define('product-controls', ProductControls);

class ProductElement extends HTMLElement {
  constructor() {
    super();
  }
}
customElements.define('product-element', ProductElement);

class StudioView extends HTMLElement {
  static selectors = {
    sizeSelector: '[data-product-option-selector]',
    container: '[data-studio-view-container]',
    productElement: '[product-element]'
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
    
    this.controls = {
      sizeSelector: sizeSelector,
      container,
      count: container.children.length
    }

    this.setProductElements(+sizeSelector.querySelector('[data-setted-value]').dataset.settedValue);
  }

  createDefaultProductElement() {
    const productElement = document.createElement('product-element');
    productElement.classList.add('product-builder__element', 'product-element', 'is-default');
    productElement.toggleAttribute('product-element');

    const picture = document.createElement('editable-picture');
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );
    picture.innerHTML += EditablePicture.emptyState;

    productElement.style.opacity = 0;
    setTimeout(() => {
      productElement.style.opacity = null;
    });

    productElement.appendChild(picture);
    productElement.innerHTML += ProductControls.template;

    this.controls.container.appendChild(productElement);
  }

  clearView(size) {
    this.controls.container.querySelectorAll(StudioView.selectors.productElement)
      .forEach((item, idx) => {
        if (idx >= size) {
          item.style.opacity = 0;
          setTimeout(() => {
            this.controls.container.removeChild(item)
          }, 300);
        }
      });
  }

  setProductElements(size) {
    if (size > this.controls.container.children.length) {
      const nowLength = this.controls.container.children.length;

      for (let i = 0; i < size - nowLength; i++) {
        this.createDefaultProductElement();
      }
    } else if (size < this.controls.container.children.length) {
      this.clearView(size);
    }
  }
}
customElements.define('studio-view', StudioView);

class ProductBuilder extends HTMLElement {
  static selectors = {
    panel: '[customization-panel]',
    studioView: '[studio-view]'
  };
  
  constructor() {
    super();

    this.panel = this.querySelector(ProductBuilder.selectors.panel);
    this.studioView = this.querySelector(ProductBuilder.selectors.studioView);

    this.init();
  }

  async init() {
    const productId = productParams.get('id');

    const product = await fetch(`product-builder/product?id=${productId}`)
      .then(res => res.json());

    this.product = product;

    this.panel.init(product);
    this.studioView.init(product);
  }
}
customElements.define('product-builder', ProductBuilder);

document.addEventListener('page:product:grid:changed', (event) => {
  console.log('grid changed: ' + event.detail.value );
});
