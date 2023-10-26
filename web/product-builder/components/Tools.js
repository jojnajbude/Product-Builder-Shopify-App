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
        wrapper: '[data-product-container]',
        product: '[data-product]',
        switch: '[data-product-switch-grid]',
        openProduct: '[data-product-button]',
        searchBar: '[data-search-query]'
      },
      images: {
        imageHide: '[data-image-hide]',
        makeMagic: '[data-make-magic]',
        imagesWrapper: '[data-images]',
        image: '[data-image]',
        imageSource: '[data-image-source]',
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
        const { show, value } = currState[tool];
  
        if (show && this.edit.tools[tool]) {
          if (this.edit.tools[tool].isExists()) {
            this.edit.tools[tool].setValue(value);
          } else {
            this.edit.tools[tool].create(value);
          }
        } else {
          this.edit.tools[tool] && this.edit.tools[tool].remove();
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

    this.makeMagicBtn = this.querySelector(Tools.selectors.pages.images.makeMagic);
    this.makeMagicBtn.addEventListener('click', this.makeMagic.bind(this));

    this.inited = true;
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    };

    this.setAttribute('state', JSON.stringify(newState));
  }

  initEventListeners() {
  }

  moveRunner() {
    this.tabs.runner.style.transform = `translate(${this.tabs.list.indexOf(this.tabs.selected) * 100}%, -50%)`;
  }

  focusOnTab(tabId) {
    const tabToFocus = this.tabs.list.find(tab => tab.dataset.tab === tabId);

    if (tabToFocus) {
      tabToFocus.click();
    }

    const tabName = tabToFocus.getAttribute('data-tab');

    if (tabName === 'edit') {
      this.parentElement.openOnTab(20);
    } else {
      this.parentElement.openOnTab(40);
    }

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

    this.parentElement.openOnTab(20);

    setTimeout(() => {
      const toolToExpand = this.querySelector(Tools.selectors.pages.edit.tool);

      if (toolToExpand && Studio.classList.contains('mobile')) {
        if (this.edit.tools[toolToExpand.getAttribute('data-tool').toLowerCase()]) {
          this.edit.tools[toolToExpand.getAttribute('data-tool').toLowerCase()].open();
        }
      }
    }, 300);

    Studio.dispatchEvent(new CustomEvent('tab:change', {
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
  };

  initSearchBar() {
    const search = this.querySelector(Tools.selectors.pages.products.searchBar);

    search.addEventListener('input', (event) => {
      this.filterProducts(event.target.value);
    });

    return search;
  }

  async initProductPage() {
    const productsContainer = this.querySelector(Tools.selectors.pages.products.container)
    const productWrapper = this.querySelector(Tools.selectors.pages.products.wrapper);

    const productElements = [];

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
      .map(async item => {
        const productElement = await this.productTemplate.call(this, item);

        if (!productElement) {
          return;
        }

        productsContainer.appendChild(productElement);

        productElements.push(productElement);

        return item;
      });

    const openProductBtn = (() => {
      const btn = document.createElement('adaptive-content');
      btn.classList.add('button', 'button--primary', 'page__product-button');
      btn.toggleAttribute('data-product-button');
      btn.toggleAttribute('panel-related');

      btn.textContent = localization.tabs.products.openProduct;

      btn.setPoints({
        mobile: {
          position: 'inside',
          elem: document.body
        },
        desktop: {
          position: 'after',
          elem: productWrapper
        }
      });

      return btn;
    })();

    openProductBtn.addEventListener('click', () => {
      if (this.pages.products.selected && Studio.state.productId !== this.pages.products.selected.dataset.id) {
        Studio.defaultBuilderPath();

        productParams = new URLSearchParams(location.search);

        Studio.utils.change({
          productId: this.pages.products.selected.dataset.id,
          product: null,
          view: globalState.view
        }, 'product change');
      } else {
        Studio.errorToast.error({
          text: 'You already have this product in builder'
        })
      }
    })

    this.pages.products = {
      list: products,
      selected: null,
      grid: {
        switch: gridSwitch,
        value: gridSwitch.getValue
      },
      productElements,
      search: this.initSearchBar()
    }
  }

  filterProducts(query) {
    this.pages.products.productElements
      .forEach(elem => {
        if (!elem.title.toLowerCase().includes(query.toLowerCase())) {
          elem.style.display = 'none';
        } else {
          elem.style.display = null;
        }
      });
  }

  async productTemplate(builderProduct) {
    if (typeof builderProduct !== 'object') {
      return;
    }

    const { root, primary } = localization.language;

    const product = allProducts[builderProduct.shopify_id.split('/').pop()];

    if (!product) {
      return;
    }

    const { imageUrl, title, price, id } = product;

    const container = document.createElement('div');
    container.classList.add('page__product');
    container.dataset.id = id;

    const completePrice = price !== undefined
      ? moneyFormat(price.split(',').join('.'))
      : 'not priced';

    const productInner = `
      <img
        src="${imageUrl
          ? imageUrl + '&width=250&height=250'
          : 'https://cdn.shopify.com/shopifycloud/web/assets/v1/833d5270ee5c71c0.svg'}"
        width="140"
        height="140"
        alt="product image"
        class="page__product-image"
        draggable="false"
      >

      <div class="page__product-info">
        <div class="page__product-title">${title}</div>

        <div class="page__product-price">${completePrice}</div>
      </div>
    `;

    container.innerHTML = productInner;
    container.addEventListener('click', this.selectProduct.bind(this));

    container.title = title;

    return container;
  }

  changePage() {
    this.pages.selected.classList.remove('is-selected');

    this.pages.selected = this.pages.list.find(page => page.dataset.page === this.tabs.selected.dataset.tab);
    this.pages.selected.classList.add('is-selected');
  }

  setImageSelected(blocks) {
    if (!blocks) {
      return;
    }

    const editableImages = blocks.reduce((images, block) => {
      block.childBlocks.forEach(child => {
        if (child.type === 'editable-picture' && child.imageUrl) {
          images.push(child.imageUrl);
        }
      })

      return images;
    }, []);

    document.querySelectorAll(Tools.selectors.pages.images.image)
      .forEach(image => {
        const imageSource = image.querySelector(Tools.selectors.pages.images.imageSource);

        const url = imageSource.src.split('?').shift();

        if (editableImages.includes(url)) {
          image.classList.add('is-selected');
        } else {
          image.classList.remove('is-selected');
        }
      });
  }

  initImagePage() {
    this.errorToast.addEventListener('error:show', (event) => {
      if (event.detail.imageWrapper) {
        event.detail.imageWrapper.remove();
      }
    })

    const imagesWrapper = this.querySelector(Tools.selectors.pages.images.imagesWrapper);

    const uploadAdaptiveBtn = (() => {
      const adaptive = document.createElement('adaptive-content');
      adaptive.classList.add('page__upload', 'unshow');
      adaptive.toggleAttribute('panel-related');

      adaptive.setPoints({
        mobile: {
          position: 'inside',
          elem: document.body
        },
        desktop: {
          position: 'after',
          elem: imagesWrapper.parentElement
        }
      });

      const uploadButton = document.createElement('button');
      uploadButton.classList.add('button', 'button--primary');
      uploadButton.toggleAttribute('data-upload-image');

      uploadButton.innerHTML = `
        <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.0142 5.16797L9.30547 1.27213L5.59678 5.16797" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          <line x1="1" y1="-1" x2="8.75" y2="-1" transform="matrix(0 1 1 0 10.0237 1.19531)" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <path d="M3.03125 10V12.5C3.03125 15.2614 5.26983 17.5 8.03125 17.5H10.25C13.0114 17.5 15.25 15.2614 15.25 12.5V10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
          
        <span>${localization.tabs.images.uploadImages}</span>
      `;

      const uploadSelector = document.createElement('div');
      uploadSelector.classList.add('upload__wrapper');
      uploadSelector.toggleAttribute('data-upload-wrapper');

      uploadSelector.innerHTML = `
        <div class="upload__variant">
          <input
            accept=".webp,.jpg,.jpeg,.png"
            type="file"
            name="images"
            id="image-from-pc"
            multiple
            data-import-from-pc
          >
          <label for="image-from-pc">
            ${localization.tabs.images.fromDevice}
          </label>
        </div>
        <div class="upload__variant" data-from-instagram>
          <span>${localization.tabs.images.fromInstagram}</span>
        </div>
        <div class="upload__variant" data-from-facebook>
          <span>${localization.tabs.images.fromFacebook}</span>
        </div>
      `;

      adaptive.append(uploadButton, uploadSelector);

      return {
        adaptive,
        uploadButton,
        uploadSelector
      };
    })();

    const uploadButton = uploadAdaptiveBtn.uploadButton;
    const uploadSelector = uploadAdaptiveBtn.uploadSelector;

    const hideUsedImages = this.querySelector(Tools.selectors.pages.images.imageHide);
    hideUsedImages.addEventListener('change', () => {
      if (JSON.parse(hideUsedImages.getAttribute('value'))) {
        [...this.querySelectorAll(Tools.selectors.pages.images.image + '.is-selected')]
          .forEach(item => item.style.display = 'none');
      } else {
        [...this.querySelectorAll(Tools.selectors.pages.images.image)]
          .forEach(item => item.style.display = null);
      }
    });

    uploadButton.addEventListener('click', (event) => {
      uploadSelector.classList.toggle('is-open');

      if (uploadSelector.classList.contains('is-open')) {
        subscribeToActionController({
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
      imageList: [],
      imagesWrapper
    }

    const inputFromPC = document.querySelector(Tools.selectors.pages.images.importFromPC);
    this.inputFromPC = inputFromPC;

    inputFromPC.addEventListener('change', (async () => {
      uploadSelector.classList.remove('is-open');

      setTimeout(() => {
        uploadSelector.style.height = null;
      }, 300);

      Object.keys(inputFromPC.files)
        .forEach((file) => {
          const imageTemplate = this.createNewImage(inputFromPC.files[file]);

          if (imageTemplate) {
            imagesWrapper.appendChild(imageTemplate);
          }
        });
    }).bind(this));
  }

  uploadedImages(uploaded) {
    uploaded
      .forEach(fileSource => {
        const { thumbnail } = fileSource;

        const imageTemplate = this.createNewImage(thumbnail);

        if (imageTemplate) {
          this.pages.images.imagesWrapper.appendChild(imageTemplate);
        }
      })
  }

  createNewImage(imageFile) {
    const formData = new FormData();

    const image = new Image();
    image.toggleAttribute('data-image-source');
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('page__image-wrapper', 'is-loading');
    imageWrapper.toggleAttribute('data-image');

    image.addEventListener('drag', (event) => {
    });

    image.addEventListener('dragstart', (event) => {
      event.dataTransfer.clearData();

      event.dataTransfer.setData('text/plain', image.src.split('?').shift());
    })

    imageWrapper.addEventListener('click', (event) => {
      const toDeleteBtn = imageWrapper.querySelector('[data-delete]');

      if (event.target !== toDeleteBtn && !toDeleteBtn.contains(event.target)) {
        Studio.utils.change({
          imagesToDownload: image.src.split('?').shift()
        }, 'set images to downloads');
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
      fetch(baseURL + '/product-builder/uploads/remove', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          imageURL: image.src
        })
      });

      imageWrapper.remove();
    }

    deleteBtn.addEventListener('click', deleteImage, true);

    imageWrapper.append(deleteBtn);

    if (typeof imageFile === 'object') {
      const setImage = (imageName) => {
        image.src = cdnPublicURL + "/" + imageName;
  
        image.onload = () => {
          imageWrapper.classList.remove('is-loading');
        };

        const url = new URL(image.src);

        const original = cdnPublicURL + url.pathname.split('/shops').join('');

        const isExist = Studio.uploaded.some(upload => upload.thumbnail === imageName);

        if (!isExist) {
          Studio.uploaded.push({
            thumbnail: image.src,
            original
          });
        }
      }

      if (imageFile.size >= ImageLimits.size) {
        this.errorToast.dispatchEvent(new CustomEvent('error:show', {
          detail: {
            type: 'size',
            imageWrapper,
            text: `
              Some files have too big size.\n
              File: ${imageFile.name}.\n
              Max size: ${ImageLimits.size / 1024 / 1024} MB\n
              File size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`
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

            if (!Studio.anonimCustomerId) {
              Studio.anonimCustomerId = uniqueID.anonim();

              Cookies.set('product-builder-anonim-id', Studio.anonimCustomerId, {
                expires: cookiesTime.anonimUser
              });
            }

            const fetchURL = baseURL + `/product-builder/orders/uploads${Studio.customer ? `?customerId=${Studio.customer.shopify_id}` : `?anonimId=${Studio.anonimCustomerId}`}&shop=${shop}`;
  
            const response = await fetch(fetchURL, {
              method: 'POST',
              body: formData
            }).then(res => {
              if (res.error) {
                Studio.errorToast.error({
                  text: 'No uploads'
                })
              }

              return res;
            });
  
            const imageName = await response.text();

            const isExist = Studio.uploaded.some(upload => upload.thumbnail === imageName);
  
            if (response.ok) {
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
  
        image.style.opacity = null;
      }
  
      reader.readAsDataURL(imageFile);
  
      image.style.opacity = 0;
    } else if (typeof imageFile === 'string') {
      image.src = cdnPublicURL + "/" + imageFile;

      image.onload = () => {
        imageWrapper.classList.remove('is-loading');
      };
    }

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
        rotate: new RotateTool(),
        crop: new CropTool(),
        backgroundColor: new BackgroundColorTool(),
        // filter: new FilterTool(),
        frame: new FrameTool(),
      }
    }

    const editStateTools = Object.keys(this.edit.tools)
      .reduce((obj, tool) => {
        obj[tool] = {
          show: false,
          value: this.edit.tools[tool].getValue()
        }

        return obj
      }, {});

    Studio.utils.change({ panel: {
      ...JSON.parse(Studio.panel.getAttribute('state')),
      tools: editStateTools
    }}, 'init edit page')
  }

  setToolsState(tools) {
    const state = { ...JSON.parse(this.getAttribute('state')) };

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
          break;
        case 'frame':
          this.edit.tools.frame.create();
          break;
      }
    }
  }

  resetTools() {
    for (const tool in this.edit.tools) {
      this.edit.tools[tool].reset();
    }
  }

  makeMagic() {
    const { blocks } = Studio.state.view;

    const childs = blocks.reduce((arr, block) => {
      const editablePictures = block.childBlocks
        .filter(block => block.type === 'editable-picture' && !block.imageUrl);

      return [...arr, ...editablePictures ];
    }, []);

    const imagesToSet = [...Studio.uploaded.map(upload => upload.original)]
      .slice(0, childs.length)
      .map((image, idx) => {
        const child = childs[idx];

        return {
          pictureIds: [child.id],
          imageUrl: image
        }
      });

    Studio.utils.change({ imagesToDownload: imagesToSet }, 'make magic');
  }
}
customElements.define('customization-tools', Tools);

export default Tools;