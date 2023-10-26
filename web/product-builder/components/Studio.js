import adaptiveActions from "../utils/helpers/adaptiveActions";
import uniqueID from "../utils/helpers/uniqueID";
import { globalState } from "../utils/helpers/settings"; 

class ProductBuilder extends HTMLElement {
  static selectors = {
    panel: '[customization-panel]',
    studioView: '[studio-view]',
    errorToast: 'error-toast',
    relatedProducts: 'related-products'
  };

  static get observedAttributes() {
    return ['state']
  }
  
  constructor() {
    super();

    adaptiveActions.subscribe(this, (event) => {
      const { size } = event.detail;

      switch (size) {
        case 'desktop':
          this.classList.add('desktop');
          this.classList.remove('mobile');
          break;
        case 'mobile':
          this.classList.add('mobile')
          this.classList.remove('desktop');
      }
    });

    this.asyncExpectants = [];

    const instToRedirect = localStorage.getItem('instToRedirect');

    if (instToRedirect) {
      return this.redirectFromInst(instToRedirect);
    }

    this.panel = this.querySelector(ProductBuilder.selectors.panel);
    this.studioView = this.querySelector(ProductBuilder.selectors.studioView);

    this.draft = {};

    if (localStorage.getItem('product-builder-draft')) {
      this.draft = JSON.parse(localStorage.getItem('product-builder-draft'));
    } else {
      this.draft.id = uniqueID.draft();
    }

    this.errorToast = document.querySelector(ProductBuilder.selectors.errorToast);
    this.relatedProducts = document.querySelector(ProductBuilder.selectors.relatedProducts)

    this.init();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    this.draft.state = currState;

    this.state = { ...currState };

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (!productParams.get('id') && !productParams.get('project-id') && !currState.product) {
      this.panel.tools.focusOnTab('products');
    }

    if (prevState.productId !== currState.productId && !currState.product) {
      const currentUrl = new URL(location.href);

      if (currentUrl.searchParams.get('id') !== currState.productId) {
        currentUrl.searchParams.delete('id');

        currentUrl.searchParams.append('id', currState.productId);
  
        history.replaceState({}, '', currentUrl);
      }

      this.getProduct(currState.productId)
        .then(product => {
          this.product = product;

          Studio.utils.change({
            product: product
          })
        }, 'set product');
    }

    if (!compareObjects(prevState.product, currState.product) && currState.product) {
      this.product = currState.product;

      this.draft.product = currState.product;

      this.relatedProducts.init();

      this.panel.setState({ product: currState.product });
    }

    if (!compareObjects(prevState.panel, currState.panel)) {
      this.panel.setState(currState.panel);

      if (prevState.panel.blockCount !== currState.panel.blockCount
        && currState.panel.blockCount !== currState.view.blocks.length
        && currState.product.quantity.type === 'set-of'
        && currState.view.blocks.length > 0) {
        const { blocks } = currState.view;

        const count = currState.panel.blockCount;

        if (prevState.panel.blockCount < count) {
          const newBlocks = Array(count - prevState.panel.blockCount)
            .fill(null).map(_ => this.studioView.getBlockJSON());

          Studio.utils.change({
            view: {
              ...currState.view,
              blocks: [ ...blocks, ...newBlocks ]
            }
          }, 'block count set of - increase');
        } else if (prevState.panel.blockCount > count) {
          Studio.utils.change({
            view: {
              ...currState.view,
              blocks: blocks.slice(0, count)
            }
          }, 'block count set of - decrease');
        }
      }
    }

    if (!compareObjects(prevState.imagesToDownload, currState.imagesToDownload)) {
      if (!currState.imagesToDownload) {
        this.studioView.setState({ imagesToDownload: null })
      } else if (typeof currState.imagesToDownload === 'string') {
        const imagesFromUrl = currState.view.blocks
          .filter(block => block.activeChild)
          .map((block, idx) => {
            const selectedChildren = block.childBlocks
              .filter(child => child.selected)
              .map(child => child.id);

            const image = currState.imagesToDownload;

            if (typeof image === 'string') {
              return {
                pictureIds: selectedChildren,
                imageUrl: image
              }
            }

            return null;
          })
          .filter(item => item);

        if (!imagesFromUrl.length) {
          const firstFreeBlock = currState.view.blocks.find(block => {
            return block.childBlocks
              .filter(child => child.type === 'editable-picture')
              .every(child => !child.imageUrl);
          });

          if (firstFreeBlock) {
            const image = currState.imagesToDownload;

            const pictureIds = firstFreeBlock.childBlocks
              .filter(child => child.type === 'editable-picture')
              .map(child => child.id);

            imagesFromUrl.push({
              pictureIds,
              imageUrl: image
            });
          }         
        }

        this.studioView.setState({ imagesToDownload: imagesFromUrl });
      } else {
        const imageFromObj = currState.imagesToDownload
          .filter(item => typeof item !== 'string' && typeof item === 'object');

        this.studioView.setState({ imagesToDownload: imageFromObj });
      }
    }

    if (!compareObjects(prevState.view, currState.view)) {
      this.onViewChange(prevState, currState);

      const completedBlocks = currState.view.blocks
        .reduce((count, block) => {
          const completeImagesPerBlock = block.childBlocks
            .filter(child => child.type === 'editable-picture')
            .every(picture => picture.imageUrl);

          if (completeImagesPerBlock) {
            return count + block.count;
          }

          return count;
        }, 0);

      const allBlocksCount = currState.view.blocks
        .reduce((count, block) => {
          return count + block.count;
        }, 0);

      this.panel.productInfo.setCompleteCount(completedBlocks, allBlocksCount);
    }

    if (this.product && !compareObjects(prevState.panel.tools, currState.panel.tools)) {
      const { tools } = currState.panel;

      const { blocks } = currState.view;

      const isSelectedBlocks = blocks.some(block => block.selected);
      const isSelectedChildren = blocks.some(block => block.activeChild);

      // if (this.product && this.product.type.id === 'photobook') {
        if (!isSelectedBlocks && !isSelectedChildren) {

        } else if (!isSelectedBlocks && isSelectedChildren) {
          const { product } = currState;

          const newBlocks = blocks
            .map(block => {
              if (block.activeChild) {
                let newBlockSettings = { ...block.settings };

                if (product && product.type.id !== 'photobook') {
                  for (const tool in block.settings) {
                    if (tools[tool]) {
                      newBlockSettings[tool] = tools[tool].value;
                    }
                  }
                }

                const newChildren = block.childBlocks
                  .map(child => {
                    if (product && product.type.id !== 'photobook') {
                      const { settings } = child;
  
                      let newSettings = {};

                      if (child.type === 'text') {
                        newSettings = tools.text.value;
                      } else {
                        for (const tool in settings) {
                          if (tools[tool]) {
                            if (tool === 'backgroundColor' && newBlockSettings.backgroundColor) {
                              newSettings[tool] = {
                                value: newBlockSettings.backgroundColor.value
                              };
                            } else {
                              newSettings[tool] = tools[tool].value;
                            }
                          } else if (tool === 'move') {
                            newSettings[tool] = settings[tool];
                          }
                        }

                        if (settings.crop.value !== newSettings.crop.value
                            || settings.rotate.value !== newSettings.rotate.value) {
                          newSettings.move = {
                            x: 0,
                            y: 0
                          }
                        }
                      }
  
                      return {
                        ...child,
                        settings: newSettings
                      }
                    } else if (child.selected) {
                      const { settings } = child;
  
                      let newSettings = {};

                      if (child.type === 'text') {
                        newSettings = tools.text.value;
                      } else {
                        for (const tool in settings) {
                          if (tools[tool]) {
                            if (tool === 'backgroundColor' && block.settings.backgroundColor) {
                              newSettings[tool] = {
                                value: block.settings.backgroundColor.value
                              };
                            } else {
                              newSettings[tool] = tools[tool].value;
                            }
                          } else if (tool === 'move') {
                            newSettings[tool] = settings[tool];
                          }
                        }

                        if (settings.crop.value !== newSettings.crop.value
                            || settings.rotate.value !== newSettings.rotate.value) {
                          newSettings.move = {
                            x: 0,
                            y: 0
                          }
                        }
                      }
  
                      return {
                        ...child,
                        settings: newSettings
                      }
                    }
  
                    return child
                  });
  
                return {
                  ...block,
                  childBlocks: newChildren,
                  settings: newBlockSettings
                }
              }
  
              return block;
            });

          this.studioView.setState({ blocks: newBlocks });
        } else {
          const newSelectedBlocks = blocks
            .map(block => {
              if (block.selected) {
                const { settings } = block;
                const { product } = currState;
  
                const newSettings = {};
  
                let children = block.childBlocks;

                for (const tool in settings) {
                  newSettings[tool] = tools[tool].value;
                }
    
                if (product.type.id === 'photobook') {
                    if (newSettings.backgroundColor) {    
                      children = children.map(child => {
                        const newChildSettings = { ...child.settings };
    
                        if (newChildSettings.backgroundColor) {
                          newChildSettings.backgroundColor = {
                            value: newSettings.backgroundColor.value
                          };
                        }
    
                        return {
                          ...child,
                          settings: newChildSettings
                        }
                      })
                  }
                } else {
                  children = children.map(child => {
                    const { settings: childSettings } = child;

                    let newChildSettings = { ...childSettings };

                    if (child.type === 'text') {
                      newChildSettings = tools.text.value;
                    } else {
                      for (const tool in newChildSettings) {
                        if (tools[tool]) {
                          if (tool === 'backgroundColor' && block.settings.backgroundColor) {
                            newChildSettings[tool] = {
                              value: block.settings.backgroundColor.value
                            };
                          } else {
                            newChildSettings[tool] = tools[tool].value;
                          }
                        } else if (tool === 'move') {
                          newChildSettings[tool] = childSettings[tool];
                        }
                      }

                      if (settings.crop && settings.crop.value !== newChildSettings.crop.value
                          || settings.rotate && settings.rotate.value !== newChildSettings.rotate.value) {
                        newChildSettings.move = {
                          x: 0,
                          y: 0
                        }
                      }
                    }

                    return {
                      ...child,
                      settings: newChildSettings
                    }
                  });
                  }

                return {
                  ...block,
                  childBlocks: children,
                  settings: newSettings
                };
              }
  
              return block;            
            })

          this.studioView.setState({ blocks: newSelectedBlocks });
        }
    }

    this.asyncExpectants = this.asyncExpectants.filter(callback => {
      if (typeof callback === 'function') {
        callback();
      }

      return false;
    }) 
  }

  onViewChange(prevState, currState) {

    if (currState.product && currState.product.quantity.type === 'set-of') {
      Studio.panel.productInfo.elements.selector.select({
        text: `Set of ${currState.view.blocks.length}`,
        quantity: currState.view.blocks.length,
        noToggle: true
      })
    }

    if (this.product && !compareObjects(prevState.view.blocks, currState.view.blocks)) {
      const { blocks } =  currState.view;

      if (!this.projectId && !productParams.get('project-id') && !this.orderCreating) {
        const someImages = blocks.some(block => block.childBlocks.some(child => child.imageUrl));

        if (someImages) {
          this.orderCreating = true;
          this.createOrder().then(order => {
            this.projectId = order.projectId;

            this.setOrderPath();

            this.getOrderInfo(this.projectId).then(info => {
              this.orderInfo = info;

              this.orderCreating = false;
            });
          })
        }
      }

      const selectedBlock = blocks.find(block => block.selected);
      const blockWithActiveChild = blocks.find(block => block.activeChild);

      if (blocks.every(block => !block.selected && !block.activeChild)) {
        this.setTools({
          remove: true
        });
      } else if (Studio.state.product && Studio.state.product.type.id === 'photobook') {
        if (!selectedBlock) {
          if (blockWithActiveChild) {
            const selectedChild = blockWithActiveChild.childBlocks.find(child => child.selected);
  
            if (selectedChild) {
              const tools = selectedChild.tools.filter(tool => {
                switch(tool) {
                  case 'rotate':
                    return this.product.settings.hasRotate;
                  case 'crop':
                    return this.product.settings.hasCrop;
                  // case 'filter':
                  //   return this.product.settings.hasFilter;
                  case 'text':
                    return this.product.settings.hasText;
                  default:
                    return true;
                }
              });
  
              this.setTools({
                toolsList: tools,
                selected: selectedChild
              });
            }
          }
        } else if (selectedBlock || blockWithActiveChild) {
          this.setTools({
            selected: selectedBlock
          });
        }
      } else if (Studio.state.product && blocks.some(block => block.selected || block.activeChild)) {
        this.setTools({
          all: true,
          selected: selectedBlock || blockWithActiveChild
        })
      }
    }

    Studio.panel.tools.setImageSelected(currState.view.blocks);

    this.studioView.setState(currState.view);
  }

  setTools({ toolsList, selected, all = false, remove = false}) {
    const { tools } = JSON.parse(Studio.panel.getAttribute('state'));

    const updatedTools = { ...tools };

    if (remove) {
      for (const tool in updatedTools) {
        updatedTools[tool] = {
          ...updatedTools[tool],
          show: false,
        }
      }

      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute('state')),
          tools: updatedTools
        }
      }, 'product builder - set tools(remove all)');

      return;
    }

    if (all) {
      const { settings } = this.product;
      
      const picture = selected ? selected.childBlocks.find(child => child.type === 'editable-picture') : null;
      const text = selected ? selected.childBlocks.find(child => child.type === 'text') : null;

      for (const tool in updatedTools) {
        switch(tool) {
          case 'backgroundColor':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasBackground,
              value: selected.settings.backgroundColor ? selected.settings.backgroundColor : BackgroundColorTool.defaultValue
            }
            break;
          case 'layout':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasLayout,
              value: selected.settings.layout ? selected.settings.layout : LayoutTool.defaultValue
            }
            break;
          case 'rotate':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasRotate,
              value: picture && picture.settings.rotate ? picture.settings.rotate : RotateTool.defaultValue
            }
            break;
          case 'crop':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasCrop,
              value: picture && picture.settings.crop ? picture.settings.crop : CropTool.defaultValue
            }

            break;
          case 'frame':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasFrame,
              value: selected.settings.frame ? selected.settings.frame : FrameTool.defaultValue
            }
            break;
          case 'text':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasText,
              value: text ? text.settings : TextTool.defaultValue
            }
            break;
          // case 'filter':
          //   updatedTools[tool] = {
          //     ...updatedTools[tool],
          //     show: settings.hasFilter,
          //     value: picture && picture.settings.filter ? picture.settings.filter.value : {}
          //   }
          //   break;
        }
      }

      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute('state')),
          tools: updatedTools
        }
      }, 'product builder - set tools(all accepted)');

      return;
    }

    if (!selected) {
      return;
    }

    const { settings: selectedSettings } = selected;

    if (!toolsList) {
      const { settings } = this.product;

      const childTools = this.childTools = ['rotate', 'filter', 'crop', 'text'];

      const getValue = (tool) => {
        return selectedSettings[tool] ? selectedSettings[tool] : Studio.state.panel.tools[tool].value;
      }

      for (const tool in updatedTools) {
        if (childTools.includes(tool)) {
          updatedTools[tool] = {
            ...updatedTools[tool],
            show: false,
          }
          continue;
        }

        switch(tool) {
          case 'layout':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasLayout,
              value: selectedSettings[tool] ? selectedSettings[tool] : LayoutTool.defaultValue
            }
            break;
          case 'backgroundColor':
              updatedTools[tool] = {
                ...updatedTools[tool],
                show: settings.hasBackground,
                value: getValue(tool)
              }
              break;
          case 'frame':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasFrame,
              value: getValue(tool)
            }
        }
      }

      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute('state')),
          tools: updatedTools
        }
      }, 'product builder - set tools');

      return;
    }

    for (const tool in updatedTools) {
      updatedTools[tool] = {
        ...updatedTools[tool],
        show: toolsList.includes(tool),
        value: toolsList.includes(tool) ? selectedSettings[tool] : updatedTools[tool].value
      } 
    }

    Studio.utils.change({
      panel: {
        ...JSON.parse(Studio.panel.getAttribute('state')),
        tools: updatedTools
      }
    }, 'product builder - set tools for block');
  }

  downloadFacebookAPI() {
    return new Promise(async (res, rej) => {
      const facebookScripts = document.createElement('script');

      const credentials = await fetch(baseURL + '/api/social/credentials').then(res => res.json());

      this.credentials = credentials;

      if (!credentials || !credentials.facebook ) {
        res();
        return;
      }

      facebookScripts.onload = () => {
        FB.init({
          appId: credentials.facebook.id,
          autoLogAppEvent: true,
          version: 'v17.0'
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
      if (newQuery[key]) {
        url.searchParams.append(key, newQuery[key]);
      }
    }

    url.searchParams.append('from_redirect', 'instagram');

    location.replace(url.href);
  }

  setState(state) {
    const newState = {
      ...JSON.parse(this.getAttribute('state')),
      ...state
    };

    this.setAttribute('state', JSON.stringify(newState));
  }

  async init() {
    this.setState(globalState);

    this.addEventListener('studio:change', (event) => {
      const { state, callback } = event.detail;

      if (callback) {
        this.asyncExpectants.push(callback);
      }

      const currState = JSON.parse(this.getAttribute('state'));

      if (!state) {
        return;
      }
      
      this.setState({
        ...currState,
        ...state
      });
    })

    const customer = await this.getCustomer();

    if (!customer) {
      this.anonimCustomerId = Cookies.get('product-builder-anonim-id');
    }

    this.setState({
      ...JSON.parse(this.getAttribute('state')),
      productId: productParams.get('id') || null,
    })

    Promise.all([this.downloadFacebookAPI()]).then(_ => {
      customElements.define('image-chooser', ImageChooser);
    });

    this.customer = customer;

    this.uploaded = await this.getUploadedList();

    if (this.uploaded && this.uploaded.length > 0) {
      this.panel.tools.uploadedImages(this.uploaded);
    }

    if (productParams.get('project-id')) {
      if (!this.customer && !this.anonimCustomerId) {
        this.defaultBuilderPath();
      }

      this.projectId = productParams.get('project-id');

      const state = await this.getOrderState(this.projectId);

      if (!state) {
        return;
      }

      if (state && !state.error) {
        Studio.utils.change(state);
      } else {
        this.projectId = await this.createOrder();

        
        this.orderInfo = await this.getOrderInfo(this.projectId);

        this.setOrderPath();
      }
    }

    // this.addEventListener('image:check', this.checkImages.bind(this));

    await this.getCart();

    this.dispatchEvent(new CustomEvent('studio:inited'));
    this.inited = true;
  }

  async getProduct(id) {
    let productId = productParams.get('id');

    if (id) {
      productId = id;
      this.productId = productId;
    }

    return fetch(`product-builder/product?id=${productId}`)
      .then(res => res.json());
  }

  async createOrder() {
    const id = Studio.customer
      ? Studio.customer.shopify_id
      : Studio.anonimCustomerId;

    if (!id) {
      return;
    }

    return fetch(`product-builder/orders/create?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Studio.state)
    }).then(res => res.json()).then(data => {
      return data;
    });
  }

  async getCart() {
    const cart = await fetch(location.origin + '/cart.js').then(res => res.json());

    this.cart = cart;

    return cart;
  }

  setOrderPath() {
    const nextURL = location.origin + location.pathname + `?project-id=${this.projectId}`;
    const nextTitle = document.title;
    const nextState = { additionalInformation: 'Product builder with order history' };

    window.history.replaceState(nextState, nextTitle, nextURL);

    productParams = new URLSearchParams(location.search);
  }

  defaultBuilderPath() {
    const nextURL = location.origin + location.pathname;
    const nextTitle = document.title;
    const nextState = { additionalInformation: 'Product builder with order history' };

    this.projectId = null;

    window.history.pushState(nextState, nextTitle, nextURL);

    productParams = new URLSearchParams(location.search);
  }

  async getOrderInfo(id) {
    const customerId = Studio.customer
      ? Studio.customer.shopify_id
      : Studio.anonimCustomerId;

    return await fetch(`product-builder/orders/info/${id}?id=${customerId}`)
    .then(res => res.json())
    .then(data => {
      if (!data.error) {
        return data;
      }

      Studio.errorToast.error( {
        text: data.error,
        type: "User's access"
      });
      return;
    });
  }

  async getOrderState(id) {
    const customerId = Studio.customer
      ? Studio.customer.shopify_id
      : Studio.anonimCustomerId;
    
    if (!customerId && id) {
      return;
    } else if (!customerId || !id) {
      return;
    }

    this.orderInfo = await this.getOrderInfo(id);

    if (!this.orderInfo) {
      return;
    }

    return fetch(`product-builder/orders/state/${id}?id=${customerId}`).then(res => {
      return res.json();
    }).then(data => {
      if (data.error) {
        Studio.errorToast.error({
          text: data.error,
          type: "Directory mismatch"
        })
      }

      return data;
    });
  }

  async updateOrder(id) {
    const customerId = Studio.customer
      ? Studio.customer.shopify_id
      : Studio.anonimCustomerId;

    if (!id || !customerId) {
      return;
    }

    const stateToSave = {
      ...Studio.state,
      imagesToDownload: null,
      view: {
        ...Studio.state.view,
        imagesToDownload: null
      }
    };

    return fetch(`product-builder/orders/update/${id}?id=${customerId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(stateToSave)
    }).then(res => res.json());
  }

  getCustomer() {
    const customerId = window.customerId;

    return customerId
      ? fetch(`product-builder/customer?id=${customerId}`)
        .then(res => res.json()).then(data => {
          if (data.error) {
            return null;
          } 
        
          return data;
        })
      : null;
  }

  async getUploadedList() {
    if (!this.anonimCustomerId && !this.customer) {
      return [];
    }

    return fetch(`product-builder/uploads/list${this.customer ? `?customerId=${this.customer.shopify_id}` : `?anonimId=${this.anonimCustomerId}`}`)
      .then(res => res.json())
      .then(data => {
        return Array.isArray(data) ? data.map(imageURL => ({
          original: cdnPublicURL + '/' + imageURL,
          thumbnail: imageURL + `?width=${devicePixelRatio * 125}&thumbnail=true`
        })) : []
      });
  }

  checkImages() {
    this.panel.getImages()
      .forEach(image => {
        this.panel.tools.isSelectedImage(image, this.studioView.getImages().includes(image));
      })
  }
}
customElements.define('product-builder', ProductBuilder);

export default ProductBuilder;