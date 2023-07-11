'use strict';

const cookiesTime = {
  anonimUser: 10
}

function moneyFormat(price, currency) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currency || 'USD',
  });

  return formatter.format(Number(price));
};

const backButton = document.querySelector('[data-back-button]');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.go(-1);
  })
}

const checkoutButton = document.querySelector('[data-checkout-button]');
if (checkoutButton) {
  checkoutButton.addEventListener('click', async () => {
    const projectId = productParams.get('project-id');

    const relatedProduct = await Studio.relatedProducts.getRelatedProducts();

    if (relatedProduct.rejected) {
      return;
    }

    if (projectId) {
      const shopifyProduct = await fetch(location.origin + `/products/${Studio.product.handle}.js`)
        .then(res => res.json());

      const { product } = Studio.state;

      let currVariant = shopifyProduct.variants[0]

      if (shopifyProduct.variants.length > 1) {
        currVariant = shopifyProduct.variants.find(variant => variant.options.includes('Set of 3')) || currVariant;
      }

      let quantityToAdd;

      if (product.quantity.type)

      switch (product.quantity.type) {
        case 'multiply':
        case 'set-of':
          quantityToAdd = Studio.studioView.getBlocksCount(Studio.state.view.blocks);
          break;
        case 'single':
          quantityToAdd = 1
          break;
        default: 
          quantityToAdd = 1
      }

      let addedToCart = {}

      if (Studio.orderInfo && Studio.orderInfo.status === 'draft') {
        const { projectId: project_id, quantity, product } = Studio.orderInfo;

        const props = {
          'project_id': project_id,
        }

        if (Studio.anonimCustomerId && !Studio.customer) {
          props['anonim_id'] = Studio.anonimCustomerId
        }

        addedToCart = await fetch(location.origin + '/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: [
              {
                id: currVariant.id,
                quantity: quantityToAdd,
                properties: props
              },
              ...relatedProduct
            ]
          })
        }).then(res => res.json());
      }

      if (!addedToCart.status) {
        fetch(`product-builder/orders/checkout/${projectId}?id=${Studio.customer ? Studio.customer.shopify_id : Studio.anonimCustomerId}`)
          .then(res => {
            if (res.ok) {
              const link = document.createElement('a');

              link.href = location.origin + '/cart';
              link.click();
            }
          })
      } else {
        Studio.errorToast.error({
          text: addedToCart.description,
          type: addedToCart.message
        })
      }
    }
  })
}

const domReader = new DOMParser();

function ActiveActionsController() {
  let activeActions = [];

  window.addEventListener('click', (event) => {  
    activeActions.map(item => {
      const toClose = item.target !== event.target
        && !item.target.contains(event.target)
        && item.opener !== event.target
        && (item.opener ? !item.opener.contains(event.target) : true);

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
const subscribeToActionController = ActiveActionsController();

const defaultDPI = 300;

function getPixels(cm, dpi) {
  return Math.floor(cm / 2.54 * dpi);
}

function getResolution(width, height) {
  return {
    width: getPixels(width, defaultDPI),
    height: getPixels(height, defaultDPI)
  }
}


(function() {
  window.blockCounter = 0;

  const getCode = (l) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < l) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const draft = () => {
    let string = '';

    for (let i = 0; i < 20; i++) {
      string += Math.round((Math.random() * 10));
    }

    return string;
  }

  const anonim = () => {
    return Date.now() + '-' + getCode(5);
  }

  const childBlock = () => {
    let childID;

    do {
      childID = 'childBlock-' + window.blockCounter++;
    } while (document.querySelector(StudioView.selectors.childBlockById(childID)));

    return childID;
  }

  const block = () => {
    let blockID;

    do {
      blockID = 'block-' + window.blockCounter++;
    } while (document.querySelector(StudioView.selectors.childBlockById(blockID)));

    return blockID;
  }

  window.uniqueID = {
    childBlock,
    block,
    draft,
    anonim
  }
})();

const baseURL = 'https://product-builder.dev-test.pro';

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
    types: ['photobook'],
    blocks: ['editable-picture']
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
    types: ['photobook'],
    blocks: ['editable-picture']
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
    types: ['photobook'],
    blocks: ['text', 'editable-picture']
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
    types: ['photobook'],
    blocks: ['editable-picture', 'text']
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
    types: ['photobook'],
    blocks: ['editable-picture','editable-picture','editable-picture','editable-picture']
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
    types: ['photobook'],
    blocks: ['editable-picture', 'text', 'editable-picture', 'text']
  }
}

window.ImageLimits = {
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
    blockCount: 0,
    imagesToDownload: null
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

let productParams = new URLSearchParams(location.search); 

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
        && currState.product.quantity.type === 'set-of') {
        const { blocks } = currState.view;

        const count = currState.panel.blockCount;

        if (prevState.panel.blockCount < count) {
          const newBlocks = Array(count - prevState.panel.blockCount)
            .fill(null).map(_ => this.studioView.getBlocksJSON());

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

      this.panel.productInfo.setCompleteCount(completedBlocks, allBlocksCount)
    }

    if (this.product && !compareObjects(prevState.panel.tools, currState.panel.tools)) {
      const { tools } = currState.panel;

      const { blocks } = currState.view;

      const isSelectedBlocks = blocks.some(block => block.selected);
      const isSelectedChildren = blocks.some(block => block.activeChild);

      if (!isSelectedBlocks && !isSelectedChildren) {

      } else if (!isSelectedBlocks && isSelectedChildren) {
        const newBlocks = blocks
          .map(block => {
            if (block.activeChild) {
              const newChildren = block.childBlocks
                .map(child => {
                  if (child.selected) {
                    const { settings } = child;

                    const newSettings = {};

                    for (const tool in settings) {
                      if (tools[tool]) {
                        if (tool === 'backgroundColor' && block.settings.backgroundColor) {
                          newSettings[tool] = {
                            value: block.settings.backgroundColor.value
                          };
                        } else {
                          newSettings[tool] = tools[tool].value;
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
                childBlocks: newChildren
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

              const newSettings = {};

              let children = block.childBlocks;
  
              for (const tool in settings) {
                if (tool === 'backgroundColor') {
                  newSettings[tool] = tools[tool].value;

                  children = children.map(child => {
                    const newChildSettings = { ...child.settings };

                    if (newChildSettings.backgroundColor) {
                      newChildSettings.backgroundColor = {
                        value: tools[tool].value.value
                      };
                    }

                    return {
                      ...child,
                      settings: newChildSettings
                    }
                  })
                } else {
                  newSettings[tool] = tools[tool].value;
                }
              }
  
              return {
                ...block,
                childBlocks: children,
                settings: newSettings
              };
            }

            return block;            
          });

        this.studioView.setState({ blocks: newSelectedBlocks });
      }
    }
  }

  onViewChange(prevState, currState) {
    if (this.product && !compareObjects(prevState.view.blocks, currState.view.blocks)) {
      const { blocks } =  currState.view;

      if (!this.projectId && !productParams.get('project-id') && !this.orderCreating) {
        const someImages = blocks.some(block => block.childBlocks.some(child => child.imageUrl));

        if (someImages) {
          this.orderCreating = true;
          this.createOrder().then(order => {
            this.projectId = order.projectId;

            this.setOrderPath();
            this.orderCreating = false;
          })
        }
      }

      const selectedBlock = blocks.find(block => block.selected);
      const blockWithActiveChild = blocks.find(block => block.activeChild);

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
                case 'filter':
                  return this.product.settings.hasFilter;
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

    }

    this.studioView.setState(currState.view);
  }

  setTools({ toolsList, selected }) {
    const { tools } = JSON.parse(Studio.panel.getAttribute('state'));

    if (!selected) {
      return;
    }

    const { settings: selectedSettings } = selected;
    const updatedTools = { ...tools };

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
    }, 'produt builder - set tools for block');
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
        if (newQuery[key]) {
          url.searchParams.append(key, newQuery[key]);
        }
      }

      const link = document.createElement('a');

      link.href = url.href;

      link.click();
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
      const { state } = event.detail;

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

        this.setOrderPath();
      }
    }

    window.oauthInstagram = JSON.parse(localStorage.getItem('oauthInstagram'));

    this.addEventListener('image:check', this.checkImages.bind(this));

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
      console.log(data);

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

  async getOrderState(id) {
    const customerId = Studio.customer
      ? Studio.customer.shopify_id
      : Studio.anonimCustomerId;
    
    if (!customerId && id) {
      console.log('no user')
      return;
    } else if (!customerId || !id) {
      return;
    }

    this.orderInfo = await fetch(`product-builder/orders/info/${id}?id=${customerId}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          return data;
        }

        console.log(data.error);

        Studio.errorToast.error( {
          text: data.error,
          type: "User's access"
        });
        return;
      });

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
    });
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
        console.log(data);

        return Array.isArray(data) ? data.map(imageURL => ({
          original: baseURL + '/' + imageURL,
          thumbnail: imageURL + `?resize=[${devicePixelRatio * 125},${devicePixelRatio * 125}]&thumbnail=true`
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

const utils = {
  change: (state, initiator) => {
    // console.log(initiator);

    const changeEvent = new CustomEvent('studio:change', {
      detail: {
        state
      }
    });

    Studio.dispatchEvent(changeEvent);
  },
  setState: (state) => {
    if (state) {
      Studio.setAttribute('state', JSON.stringify(state));
    }
  },
  getState: () => {
    return Studio.state;
  },
  history: {
    undoButton: document.querySelector('[data-undo]'),
    redoButton: document.querySelector('[data-redo]'),
    save: () => {
      if (!utils.history.allowSave) {
        return;
      }

      if (Studio.anonimCustomerId) {
        Cookies.set('product-builder-anonim-id', Studio.anonimCustomerId, {
          expires: cookiesTime.anonimUser
        });
      }
  
      const historyString = localStorage.getItem('product-builder-history');
    
      if (!historyString) {
        localStorage.setItem('product-builder-history', JSON.stringify([Studio.state]));
        return Studio.utils.history.save();
      }
    
      let history = JSON.parse(historyString);
      let prevHistory = [ ...history ];
  
      if (utils.history.position === history.length && !compareObjects(history.at(-1), Studio.state)) {
        history.push(Studio.state);
        utils.history.position++;
      } else if (!compareObjects(Studio.state, history[utils.history.position - 1])){
        history = [...history.slice(0, utils.history.position), Studio.state]
        utils.history.position = history.length;
      }
  
      if (history.length > 20) {
        history = history.slice(history.length - 20);
        utils.history.position = history.length;
      }

      utils.history.setEnabledButtons();
  
      localStorage.setItem('product-builder-history', JSON.stringify(history));

      if (((Studio.customer && !Studio.anonimCustomerId) || (!Studio.customer && Studio.anonimCustomerId)) && Studio.projectId && Studio.inited && history.length > 1) {
        Studio.updateOrder(Studio.projectId);
      }
    },
    allowSave: true,
    position: 1,
    undoState: () => {
      const historyString = localStorage.getItem('product-builder-history');
    
      if (!historyString) {
        return;
      }  
      const history = JSON.parse(historyString);
  
      if (history.length <= 1) {
        return;
      }
  
      localStorage.setItem('product-builder-history', JSON.stringify(history));
  
      if (utils.history.position > 1) {
        utils.history.position--;
      }

      utils.setState(history[utils.history.position - 1]);
      utils.inUndoHistory = true;

      utils.history.setEnabledButtons();
    },
    redoState: () => {
      const historyString = localStorage.getItem('product-builder-history');
    
      if (!historyString) {
        return;
      }  
      const history = JSON.parse(historyString);
  
      if (history.length <= 1) {
        return;
      }
  
      localStorage.setItem('product-builder-history', JSON.stringify(history));
  
      if (utils.history.position < history.length) {
        utils.history.position++;
      }

      utils.setState(history[utils.history.position - 1]);

      utils.history.setEnabledButtons();
    },
    historyList: () => JSON.parse(localStorage.getItem('product-builder-history')),
    clear: () => {
      const historyString = localStorage.getItem('product-builder-history');
  
      if (historyString) {
        localStorage.removeItem('product-builder-history');
      }
    },
    setEnabledButtons: () => {
      if (utils.history.historyList().length <= utils.history.position) {
        utils.history.redoButton.classList.add('is-disabled');
        utils.history.redoButton.setAttribute('disabled', true);
      } else {
        utils.history.redoButton.classList.remove('is-disabled');
        utils.history.redoButton.removeAttribute('disabled');
      }

      if (utils.history.position === 1) {
        utils.history.undoButton.classList.add('is-disabled');
        utils.history.undoButton.setAttribute('disabled', true);
      } else {
        utils.history.undoButton.classList.remove('is-disabled');
        utils.history.undoButton.removeAttribute('disabled');
      }
    }
  }
}

window.Studio = document.querySelector('product-builder');
window.Studio.utils = utils;
utils.history.clear();

document.addEventListener('keyup', (event) => {
  if (event.ctrlKey && event.which === 90 && !event.shiftKey) {
    Studio.utils.history.undoState();
  } else if (event.ctrlKey && event.shiftKey && event.which === 90) {
    Studio.utils.history.redoState();
  }
});

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

  error(detail) {
    this.dispatchEvent(new CustomEvent('error:show', {
      detail
    }));
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

class RangeSlider {
  constructor({ min, max, defValue } = { min: 0, max: 100, defValue: 0}) {
    const slider = this.container = document.createElement('div');
    slider.classList.add('slider');

    const rangeSlider = document.createElement('div');
    rangeSlider.classList.add('slider__range');

    const bullet = this.bullet = document.createElement('div');
    bullet.classList.add('slider__holder');

    const bulletStrip = document.createElement('span');
    bulletStrip.classList.add('slider__holder-strip');
    bullet.append(bulletStrip);

    const fullBar = document.createElement('div');
    fullBar.classList.add('slider__full-bar');

    const valueBar = this.valueBar = document.createElement('div');
    valueBar.classList.add('slider__value-bar');

    fullBar.append(valueBar);

    const input = this.input = document.createElement('input');
    input.classList.add('slider__input');
    input.type = 'range';
    input.min = min;
    input.max = max;
    input.value = defValue;

    this.min = min;
    this.max = max;
    this.default = defValue;

    rangeSlider.append(bullet, fullBar, input);

    slider.append(rangeSlider);

    const showSliderValue = () => {
      const inputValue = ((+input.value) * 100) / this.max;

      const bulletPosition = (inputValue / 100);
      const space = input.offsetWidth - bullet.offsetWidth;

      bullet.style.left = (bulletPosition * space) + 'px';
      bullet.style.transform = `translateY(-50%)`;
      valueBar.style.width = (inputValue) + '%';
    }

    input.addEventListener('input', showSliderValue, false);

    this.classList = {
      add: this.container.classList.add.bind(this.container.classList),
      remove: this.container.classList.remove.bind(this.container.classList),
      contains: this.container.classList.contains.bind(this.container.classList)
    }

    this.container.addEventListener('mousedown', () => {
      utils.history.allowSave = false;
      Studio.utils.rangeActivated = true;
    })

    this.container.addEventListener('mouseup', () => {
      utils.history.allowSave = true;
      Studio.utils.history.save();

      Studio.utils.rangeActivated = false;
      window.dispatchEvent(new CustomEvent('range:mouseup'));
    })
  }

  setValue(value) {
    if (typeof value === 'number' && value >= this.min && value <= this.max) {
      this.input.value = value;
      this.input.dispatchEvent(new Event('input'));
    }
  };

  onChange(callback) {
    this.input.addEventListener('input', callback);
  }

  getValue() {
    return +this.input.value;
  };

  increase(step) {
    if (typeof step === 'number') {
      this.setValue(this.getValue() + step);
    }
  }

  decrease(step) {
    if (typeof step === 'number') {
      this.setValue(this.getValue() - step);
    }
  }
}

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

      subscribeToActionController({
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
      }, 'set blockCount by event');
    }).bind(this));

    this.parent = this.parentNode;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (compareObjects(prevState, currState)) {
      return;
    }

    const { product } = currState;

    if (!compareObjects(prevState.product, currState.product)) {
      this.setProduct(product);

      if (!this.elements.selector.style.display === 'none') {
        this.showSelector();
      }
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
    if (!product) {
      return;
    }

    if (product.imageUrl) {
      this.elements.image.src = product.imageUrl + '&height=100';
    }

    this.elements.title.textContent = product.title;

    const sizeOptions = product.options.find(option => option.name === 'Size');

    let selectedValue = productParams.get('size');

    if ((product.quantity.type === 'set-of' || product.quantity.type === 'single') && sizeOptions && (!sizeOptions.values.includes(productParams.get('size')) || !productParams.get('size'))) {
      selectedValue = sizeOptions.values[0];
    }

    if (!sizeOptions) {
      this.destroySelector();
    }
    
    this.elements.selector.setData(sizeOptions, selectedValue);

    let blockCount = 0;

    if (product.quantity.type === 'multiply') {
      blockCount = product.quantity.minimum;
    } else if (product.quantity.type === 'single') {
      blockCount = 1;
      if (sizeOptions) {
        blockCount = sizes[selectedValue];
      }
    } else if (product.quantity.type === 'set-of') {
      blockCount = sizes[selectedValue];
    }

    const { type, settings, shopify_id, handle, quantity } = product;

    const newBlocks = Studio.state.view.blocks.map(block => {
        const newChildren = block.childBlocks.map(child => {
          if (child.type === 'text') {
            return child;
          }

          if (child.type === 'editable-picture') {
            return {
              ...child,
              imageUrl: null
            }
          }
        });

        return {
          ...block,
          childBlocks: newChildren
        }
    });

    Studio.utils.change({
      panel: {
        ...JSON.parse(Studio.panel.getAttribute('state')),
        blockCount
      },
      view: {
        ...JSON.parse(Studio.studioView.getAttribute('state')),
        product: { type, settings, shopify_id, handle, quantity },
        blocks: newBlocks,
        blockCount
      }
    }, 'product-info');

    this.setQuantity(blockCount);
  }

  setCompleteCount(count, allCount) {
    if (typeof count !== 'number') {
      return;
    }

    this.elements.quantity.current.textContent = count;

    if (allCount !== this.elements.quantity.request.textContent && allCount !== 0) {
      this.elements.quantity.request.textContent = allCount;
    }

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
    if (!state) {
      return;
    }

    this.setValue(state);
  }

  setValue(value) {
    return value;
  }

  getValue() {
    return {
      value: 'Content'
    }
  }

  isExists() {
    return document.contains(this.container);
  }

  create(state) {
    this._defaultCreate(state);
  }

  _defaultCreate(state) {
    this.container.style.opacity = 0;
    this.setOnCreate(state);

    setTimeout(() => {
      this.editList.append(this.container);     

      setTimeout(() => {
        this.container.style.opacity = null;
      }, 10);
    }, 300);
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

  reset() {
    this.close();
    this.setValue('Content');
  }
}

class LayoutTool extends Tool {
  static defaultValue = {
    layout: 'whole'
  }

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

  getValue() {
    return {
      layout: this.selected.layoutId
    }
  }

  setValue(state) {
    this.selected.unselect();

    if (!state || !state.layout) {
      return;
    }

    const { layout } = state;

    const toSelect = this.layouts.find(variant => variant.layoutId === layout);

    if (toSelect) {
      toSelect.select();
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

      if (!Studio.state) {
        return;
      }

      const panelState = Studio.state.panel;

      Studio.utils.change({
        panel: {
          ...panelState,
          tools: {
            ...panelState.tools,
            layout: {
              ...panelState.tools.layout,
              value: this.getValue()
            }
          }
        }
      }, 'layout tool');
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

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: LayoutTool.defaultValue
          }
        }
      }
    }, 'layout tool - reset')
  }
}

class TextTool extends Tool {
  static icons = {
    bold: `
      <svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.183181 10.8809V0.347155H4.41171C5.50521 0.347155 6.33787 0.602973 6.9097 1.11461C7.49156 1.61622 7.7825 2.26329 7.7825 3.05582C7.7825 3.71794 7.60192 4.24964 7.24076 4.65093C6.88964 5.04218 6.45826 5.30803 5.94662 5.44848C6.54855 5.56886 7.04514 5.86983 7.43639 6.35137C7.82764 6.82288 8.02327 7.37464 8.02327 8.00666C8.02327 8.83933 7.7223 9.52653 7.12038 10.0683C6.51845 10.61 5.66572 10.8809 4.56219 10.8809H0.183181ZM2.10934 4.77131H4.1258C4.66753 4.77131 5.08386 4.64591 5.37479 4.39511C5.66572 4.1443 5.81119 3.78817 5.81119 3.32669C5.81119 2.88528 5.66572 2.53917 5.37479 2.28837C5.09389 2.02753 4.66753 1.89711 4.0957 1.89711H2.10934V4.77131ZM2.10934 9.31585H4.26123C4.83306 9.31585 5.27447 9.18543 5.58547 8.9246C5.90649 8.65373 6.06701 8.27753 6.06701 7.79599C6.06701 7.30442 5.90148 6.91818 5.57042 6.63728C5.23936 6.35638 4.79293 6.21593 4.23113 6.21593H2.10934V9.31585Z" fill="currentColor"/>
      </svg>
    `,
    italic: `
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="7.21094" y="4.57031" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="4.25781" y="12.6836" width="7.37654" height="1.47531" fill="currentColor"/>
        <rect x="6.47656" y="13.6055" width="9.24965" height="1.47531" transform="rotate(-65 6.47656 13.6055)" fill="currentColor"/>
      </svg>
    `,
    underline: `    
      <svg width="18" height="18" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 4.57031V10.1027C6 10.1027 6.36883 12.6845 8.95062 12.6845C11.5324 12.6845 11.9012 10.1027 11.9012 10.1027V4.57031" stroke="currentColor" stroke-width="1.77037"/>
        <rect x="3.05469" y="15.6367" width="11.8025" height="1.47531" fill="currentColor"/>
      </svg>
    `,
    left: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.664062 3.01172H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 6.16016H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 9.30859H14.827" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.664062 12.457H10.9644" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    center: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.07031 3.01172H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 6.16016H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.07031 9.30859H15.2333" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 12.457H13.3003" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    right: `
      <svg width="16" height="16" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.476562 3.01172H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 6.16016H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M0.476562 9.30859H14.6395" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M4.33594 12.457H14.6363" stroke="currentColor" stroke-width="0.885185" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `
  }

  static defaultValue = {
    align: 'center',
    font: 'Times New Roman',
    fontStyle: {
      bold: false,
      italic: false,
      underline: false
    },
    text: ''
  }

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

    const iconHTML = `
      <svg width="6" height="4" viewBox="0 0 6 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.01493 3.57255L0.359375 0.916992H5.67049L3.01493 3.57255Z" fill="#888888"/>
      </svg>
    `;

    const icon = domReader.parseFromString(iconHTML, 'image/svg+xml').querySelector('svg');

    wrapper.append(icon);

    return {
      wrapper,
      disable: () => selector.toggleAttribute('disabled'),
      setValue: (value) => {
        const toSet = selector.querySelector(`option[value="${value}"]`);

        if (toSet) {
          selector.value = value;
        }
      },
      getValue: () => selector.value,
      selector,
      onChange: (callback) => {
        selector.addEventListener('change', callback.bind(this));
      }
    };
  }

  setContent() {
    const container = document.createElement('div');
    this.contentWrapper = container;
    container.classList.add('text-tool')


    const text = document.createElement('textarea');
    text.classList.add('text-tool__text');

    text.addEventListener('input', this.onTextInput.bind(this));

    const header = this.header = this.headerContent();
    const tools = this.tools = this.toolsContent();

    container.append(
      header.wrapper,
      tools.container,
      text
    );

    this.text = text;

    this.values = {
      font: this.selectFont.getValue(),
      text: text.value,
      align: tools.getAlign(),
      fontStyle: tools.getFontStyle()
    }

    this.collapsible.inner.append(container);
  }

  headerContent() {
    const header = document.createElement('div');
    header.classList.add('text-tool__header');

    const selectType = this.selectorTemplate({ options: [
      'Paragraph',
      'Line'
    ]});

    selectType.disable();

    this.selectType = selectType;

    const selectFont = this.selectorTemplate({ options: [
      'Times New Roman',
      'Arial',
      'Calibri'
    ]});

    this.selectFont = selectFont;

    header.append(selectType.wrapper, selectFont.wrapper);

    selectFont.onChange(this.onFontChange);

    return {
      wrapper: header,
      selectFont: {
        selector: selectFont.selector,
        value: selectFont.value
      }
    };
  }

  toolsContent() {
    this.groupButtons = {
      align: ['left', 'center', 'right']
    }

    const tools = document.createElement('div');
    tools.classList.add('text-tool__tools');

    const textStyle = document.createElement('div');
    textStyle.classList.add('text-tool__text-style', 'text-tool__item')

    const getToolButton = (value, icon, group, isdefault) => {
      const button = document.createElement('button');
      button.classList.add('text-tool__button');
      button.setAttribute('data-button-value', value);
      button.innerHTML = icon;

      if (isdefault) {
        button.classList.add('is-active');
      }

      if (group) {
        button.setAttribute('data-button-group', group);
      }

      button.addEventListener('click', () => {
        if (button.hasAttribute('data-button-group')) {
          const toUnselect = this.contentWrapper.querySelector(`button[data-button-group="${group}"].is-active`);

          if (toUnselect) {
            toUnselect.classList.remove('is-active');
          }
        }

        button.classList.toggle('is-active');

        this.onToolsChange(button);
      })

      return button
    }

    const boldStyle = getToolButton('bold', TextTool.icons.bold);
    const italicStyle = getToolButton('italic', TextTool.icons.italic);
    const underlineStyle = getToolButton('underline', TextTool.icons.underline);

    textStyle.append(boldStyle, italicStyle, underlineStyle);

    const textAlign = document.createElement('div');
    textAlign.classList.add('text-tool__text-align', 'text-tool__item');

    const leftAlign = getToolButton('left', TextTool.icons.left, 'align');
    const centerAlign = getToolButton('center', TextTool.icons.center, 'align', true);
    const rightAlign = getToolButton('right', TextTool.icons.right, 'align');

    textAlign.append(leftAlign, centerAlign, rightAlign);

    tools.append(textStyle, textAlign);

    return {
      container: tools,
      getAlign: () => {
        const activeAlign = textAlign.querySelector('button.is-active[data-button-group="align"');
        if (activeAlign) {
          return activeAlign.dataset.buttonValue;
        }

        return null;
      },
      setAlign: (align) => {
        const alignToUnset = tools.querySelector('button[data-button-group="align"].is-active');

        if (alignToUnset) {
          alignToUnset.classList.remove('is-active');
        }

        const alignToSet = tools.querySelector(`button[data-button-value="${align}"`);

        if (alignToSet) {
          alignToSet.classList.add('is-active');
        }
      },
      getFontStyle: () => {
        const isBold = textStyle.querySelector('button.is-active[data-button-value="bold"');
        const isItalic = textStyle.querySelector('button.is-active[data-button-value="italic"');
        const isUnderline = textStyle.querySelector('button.is-active[data-button-value="underline"');

        return {
          bold: isBold ? true : false,
          italic: isItalic ? true : false,
          underline: isUnderline ? true : false
        }
      },
      setFontStyle: ({ bold, italic, underline }) => {
        if (bold) {
          boldStyle.classList.add('is-active');
        } else {
          boldStyle.classList.remove('is-active');
        }

        if (italic) {
          italicStyle.classList.add('is-active');
        } else {
          italicStyle.classList.remove('is-active');
        }

        if (underline) {
          underlineStyle.classList.add('is-active');
        } else {
          underlineStyle.classList.remove('is-active');
        }
      }
    }
  }

  onToolsChange(button) {
    if (button.hasAttribute('data-button-group')) {
      switch (button.dataset.buttonGroup) {
        case 'align':
          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                text: {
                  ...Studio.state.panel.tools.text,
                  value: this.getStateValue({ align: button.dataset.buttonValue })
                }
              }
            }
          }, 'text tool')
        break;
      }

      return;
    }

    const fontStyle = this.tools.getFontStyle();

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ fontStyle })
          }
        }
      }
    }, 'font style changed')    
  }

  onFontChange() {
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ font: this.selectFont.getValue() })
          }
        }
      }
    }, 'font change')
  }

  onTextInput() {
    this.text.style.height = (this.text.scrollHeight) + 'px';

    const isLine = Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .some(block => block.childBlocks.some(child => child.isLine));

    const { value } = this.text;
    const maxSize = this.maxSize !== Infinity
      ? this.maxSize
      : isLine ? 20 : 300;

    if (value.length > maxSize && isLine) {
      this.text.value = value.substring(0, maxSize);

      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    } else if (!isLine && value.length > maxSize) {
      this.text.value = value.substring(0, maxSize);
      
      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    }

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          text: {
            ...Studio.state.panel.tools.text,
            value: this.getStateValue({ text: this.text.value })
          }
        }
      }
    }, 'text tool - on text input')
  }

  getStateValue(state) {
    return {
      ...Studio.state.panel.tools.text.value,
      ...state
    }
  }

  setValue(value) {
    const isLine = Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .some(block => block.childBlocks.some(child => child.isLine));

    this.maxSize = Math.min(...Studio.state.view.blocks
      .filter(block => block.activeChild)
      .map(block => block.childBlocks
          .filter(child => child.selected
            && child.type === 'text' 
            && child.settings.text.maxSize
            && typeof child.settings.text.maxSize === 'number'
          )
      ).map(children => children.map(child => child.settings.text.maxSize))
      .reduce((arr, children) => [...arr, ...children], []));

    if (isLine) {
      this.selectType.setValue('Line');
    } else {
      this.selectType.setValue('Paragraph');
    }

    const { text, fontStyle, align, font } = value;

    if (text) {
      this.text.value = text;
    }

    if (align) {
      this.tools.setAlign(align);
    }

    if (fontStyle) {
      this.tools.setFontStyle(fontStyle);
    }

    if (font) {
      this.selectFont.setValue(font);
    }
  }

  getValue() {
    return {
      text: this.values.text,
      align: this.values.align,
      fontStyle: this.values.fontStyle,
      font: this.values.font,
      maxSize: this.maxSize
    }
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: TextTool.defaultValue
          }
        }
      }
    }, 'text tool - reset')
  }
}

class RotateTool extends Tool {
  static icons = {
    against: `
      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.53034 4.02642C7.72202 4.10729 7.92285 3.93233 7.869 3.73138L7.71656 3.16246C9.98422 2.55486 11.359 2.63675 12.284 3.17081C13.209 3.70488 13.9674 4.85456 14.575 7.1223C14.7179 7.65576 15.2663 7.97235 15.7997 7.8294C16.3332 7.68646 16.6498 7.13813 16.5068 6.60466C15.8605 4.19241 14.9171 2.38164 13.284 1.43876C11.6509 0.495888 9.61111 0.584285 7.19892 1.23061L7.04656 0.661976C6.99271 0.461028 6.73131 0.40992 6.60575 0.575792L5.04378 2.63921C4.94538 2.76919 4.99572 2.95706 5.14593 3.02044L7.53034 4.02642Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.56918 6.88022C0.768976 7.09463 0.294102 7.91714 0.508515 8.71734L2.83789 17.4107C3.0523 18.2109 3.8748 18.6857 4.675 18.4713L13.3683 16.142C14.1685 15.9275 14.6434 15.105 14.429 14.3048L12.0996 5.61151C11.8852 4.81131 11.0627 4.33644 10.2625 4.55085L1.56918 6.88022ZM2.56978 8.68266L4.64033 16.4101L12.3677 14.3395L10.2972 6.61211L2.56978 8.68266Z" fill="currentColor"/>
      </svg>
    `,
    by: `
      <svg width="17" height="19" viewBox="0 0 17 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.46786 4.02642C9.27618 4.10729 9.07535 3.93233 9.1292 3.73138L9.28164 3.16246C7.01398 2.55486 5.63921 2.63675 4.71419 3.17081C3.78916 3.70488 3.03084 4.85456 2.42321 7.1223C2.28026 7.65576 1.73193 7.97234 1.19846 7.8294C0.664995 7.68646 0.348412 7.13812 0.491354 6.60466C1.13771 4.19241 2.08106 2.38164 3.71419 1.43876C5.34729 0.495888 7.38709 0.584285 9.79927 1.23061L9.95164 0.661976C10.0055 0.461028 10.2669 0.40992 10.3925 0.575792L11.9544 2.63921C12.0528 2.76919 12.0025 2.95706 11.8523 3.02044L9.46786 4.02642Z" fill="currentColor"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M15.429 6.88022C16.2292 7.09463 16.7041 7.91714 16.4897 8.71734L14.1603 17.4107C13.9459 18.2109 13.1234 18.6857 12.3232 18.4713L3.62986 16.142C2.82966 15.9275 2.35479 15.105 2.5692 14.3048L4.89857 5.61151C5.11299 4.81131 5.93549 4.33644 6.73569 4.55085L15.429 6.88022ZM14.4284 8.68266L12.3579 16.4101L4.63046 14.3395L6.70101 6.61211L14.4284 8.68266Z" fill="currentColor"/>
      </svg>
    `, 
  }

  static defaultValue = {
    value: 0
  }

  constructor() {
    super();

    this.label.setLabel('Rotate');

    const icon = `
      <svg width="15" height="13" viewBox="0 0 15 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.90175 6.29659C1.90175 9.34078 4.10895 11.4145 6.58746 11.8437C6.87109 11.8928 7.0612 12.1626 7.01209 12.4462C6.96298 12.7298 6.69324 12.9199 6.40962 12.8708C3.49796 12.3666 0.859375 9.91247 0.859375 6.29659C0.859375 4.75991 1.55849 3.55227 2.37493 2.63358C2.95978 1.97549 3.62888 1.44117 4.16699 1.03184L2.53059 1.03184C2.25444 1.03184 2.03059 0.80798 2.03059 0.531837C2.03059 0.255695 2.25444 0.0318374 2.53059 0.0318374L5.53059 0.0318373C5.80673 0.0318372 6.03059 0.255695 6.03059 0.531837L6.03059 3.53184C6.03059 3.80798 5.80673 4.03184 5.53059 4.03184C5.25444 4.03184 5.03059 3.80798 5.03059 3.53184L5.03059 1.68627L5.02907 1.68741L5.02899 1.68747L5.02898 1.68748L5.02896 1.68749C4.45749 2.11849 3.75912 2.6452 3.15408 3.32602C2.43955 4.13003 1.90175 5.10135 1.90175 6.29659ZM13.0094 6.70302C13.0094 3.69097 10.849 1.62942 8.40237 1.1701C8.11947 1.11699 7.93319 0.844602 7.9863 0.561701C8.03941 0.2788 8.3118 0.0925166 8.5947 0.145627C11.469 0.685223 14.0518 3.12587 14.0518 6.70302C14.0518 8.2397 13.3526 9.44735 12.5362 10.366C11.9514 11.0241 11.2823 11.5584 10.7442 11.9678L12.3806 11.9678C12.6567 11.9678 12.8806 12.1916 12.8806 12.4678C12.8806 12.7439 12.6567 12.9678 12.3806 12.9678L9.38059 12.9678C9.10444 12.9678 8.88059 12.7439 8.88059 12.4678L8.88059 9.46777C8.88059 9.19163 9.10444 8.96777 9.38059 8.96777C9.65673 8.96777 9.88059 9.19163 9.88059 9.46777L9.88059 11.3133L9.88215 11.3121C10.4536 10.8811 11.152 10.3544 11.7571 9.67359C12.4716 8.86958 13.0094 7.89826 13.0094 6.70302Z" fill="black"/>
      </svg>
    `

    this.icon.setIcon(icon);
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: RotateTool.defaultValue
          }
        }
      }
    }, 'rotate tool - reset')
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('rotate-tool');

    const againstClock = document.createElement('button');
    againstClock.innerHTML = RotateTool.icons.against;
    againstClock.classList.add('rotate-tool__button');

    const byClock = document.createElement('button');
    byClock.classList.add('rotate-tool__button');
    byClock.innerHTML = RotateTool.icons.by;

    const slider = this.slider = new RangeSlider({ min: 0, max: 360, defValue: 0 });
    slider.classList.add('rotate-tool__slider');

    againstClock.addEventListener('click', () => {
      const value = slider.getValue();

      switch (true) {
        case value <= 90:
          slider.setValue(0);
          break;
        case value <= 180:
          slider.setValue(90);
          break;
        case value <= 270:
          slider.setValue(180);
          break;
        case value <= 360:
          slider.setValue(270);
          break;   
      }
    })

    byClock.addEventListener('click', () => {
      const value = slider.getValue();

      switch (true) {
        case value >= 270:
          slider.setValue(360);
          break;  
        case value >= 180:
          slider.setValue(270);
          break;
        case value >= 90:
          slider.setValue(180);
          break;
        case value >= 0:
          slider.setValue(90);
          break; 
      }
    })

    slider.onChange(() => {
      Studio.utils.change({
        panel: {
          ...Studio.state.panel,
          tools: {
            ...Studio.state.panel.tools,
            rotate: {
              ...Studio.state.panel.tools.rotate,
              value: this.getValue()
            }
          }
        }
      }, 'rotate tool - set value')
    })

    wrapper.append(againstClock, slider.container, byClock);

    this.collapsible.inner.append(wrapper);
  }

  setValue(state) {
    const { value } = state;

    this.slider.setValue(value);
  }

  getValue() {
    return {
      value: this.slider.getValue()
    }
  }
}

class CropTool extends Tool {
  static defaultValue = {
    value: 0
  }

  constructor() {
    super();

    this.label.setLabel('Crop');

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.5 1.75436e-06C3.77614 1.74229e-06 4 0.223859 4 0.500002L4 3.00006L11.5 3.00006C11.7761 3.00006 12 3.22392 12 3.50006L12 11.0001L14.5 11C14.7761 11 15 11.2238 15 11.5C15 11.7761 14.7762 12 14.5 12L12 12.0001L12 14.5C12 14.7761 11.7761 15 11.5 15C11.2239 15 11 14.7761 11 14.5L11 12.0001L3.5 12.0001C3.22386 12.0001 3 11.7762 3 11.5001L3 4.00005L0.499989 4C0.223847 4 -6.10541e-06 3.77613 -5.02576e-07 3.49999C5.13006e-06 3.22385 0.223867 3 0.50001 3L3 3.00005L3 0.500002C3 0.223859 3.22386 1.76643e-06 3.5 1.75436e-06ZM4 4.00006L4 11.0001L11 11.0001L11 4.00006L4 4.00006Z" fill="black"/>
      </svg>
    `

    this.icon.setIcon(icon);
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: CropTool.defaultValue
          }
        }
      }
    }, 'crop tool - reset')
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('crop-tool');

    const slider = this.slider = new RangeSlider();
    slider.classList.add('crop-tool__slider');

    const cropValue = (() => {
      const container = document.createElement('div');
      container.classList.add('crop-tool__value');

      const input = document.createElement('input');
      input.type = 'number';
      input.min = 0;
      input.max = 100;
      input.classList.add('crop-tool__value-input');

      container.append(input);

      return {
        container,
        setValue: (value) => {
          if (typeof value === 'number' && value >= 0 && value <= 100) {
            input.value = value;
          }
        },
        onChange: (callback) => {
          input.addEventListener('input', callback);
        },
        getValue: () => {
          return +input.value;
        }
      }
    })();

    slider.setValue(0);
    cropValue.setValue(slider.getValue());

    slider.onChange(() => {
      cropValue.setValue(slider.getValue());
    });

    cropValue.onChange(() => {
      slider.setValue(cropValue.getValue());
    });

    slider.onChange(() => {
      Studio.utils.change({
        panel: {
          ...Studio.state.panel,
          tools: {
            ...Studio.state.panel.tools,
            crop: {
              ...Studio.state.panel.tools.crop,
              value: this.getValue()
            }
          }
        }
      }, 'crop tool - set value')
    })

    wrapper.append(slider.container, cropValue.container);

    this.collapsible.inner.append(wrapper);
  }

  create(state) {
    this._defaultCreate(state);
  }

  getValue() {
    return {
      value: this.slider.getValue()
    }
  }

  setValue(state) {
    const { value } = state;

    this.slider.setValue(value);
  }
}

class BackgroundColorTool extends Tool {
  static colors = {
    black: {
      label: 'Black',
      value: 'rgb(0,0,0)',
      whiteFont: true,
    },
    white: {
      label: 'White',
      value: 'rgb(255,255,255)',
      default: true
    },
    red: {
      label: 'Red',
      value: 'rgb(255,40,40)',
      whiteFont: true,
    },
    orange: {
      label: 'Orange',
      value: 'rgb(255,164,28)',
      whiteFont: true,
    },
    yellow: {
      label: 'Yellow',
      value: 'rgb(255,232,28)'
    },
    green: {
      label: 'Green',
      value: 'rgb(0,255,133)'
    },
    blue: {
      label: 'Blue',
      value: 'rgb(40,165,255)',
      whiteFont: true,
    },
    indigo: {
      label: 'Indigo',
      value: 'rgb(0, 41, 255)',
      whiteFont: true,
    },
    purple: {
      label: 'Purple',
      value: 'rgb(255,40,195)',
      whiteFont: true,
    }
  }

  static defaultValue = {
    label: 'White',
    value: 'rgb(255,255,255)',
    whiteFont: false
  }

  constructor() {
    super();

    this.label.setLabel('Background color')

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.85416 1.48922C7.6589 1.29396 7.34231 1.29396 7.14705 1.48922L1.4902 7.14607C1.29493 7.34134 1.29493 7.65792 1.4902 7.85318L7.14705 13.51C7.34231 13.7053 7.6589 13.7053 7.85416 13.51L13.511 7.85318C13.7063 7.65792 13.7063 7.34134 13.511 7.14607L7.85416 1.48922ZM7.50049 2.55L2.55086 7.49963L7.50049 12.4493V2.55Z" fill="black"/>
      </svg>
    `;

    this.icon.setIcon(icon);
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('background-tool');

    const colorButtons = this.buttons = Object.keys(BackgroundColorTool.colors)
      .map((color) => this.colorOptionTemplate(BackgroundColorTool.colors[color]))
      .map(button => {
        button.addEventListener('click', () => {
          const toUnselect = wrapper.querySelector('button.is-selected');

          if (toUnselect) {
            toUnselect.classList.remove('is-selected');
          }

          button.classList.add('is-selected');

          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                backgroundColor: {
                  ...Studio.state.panel.tools.backgroundColor,
                  value: this.getValue()
                }
              }
            }
          }, 'background tool - set value');
        })

        return button;
      });

    wrapper.append(...colorButtons);

    this.collapsible.inner.append(wrapper);
  }

  colorOptionTemplate(color) {
    const { label, value } = color;

    const button = document.createElement('button');
    button.classList.add('background-tool__button');
    button.setAttribute('data-color', JSON.stringify(color));
    button.setAttribute('data-color-value', value);

    const icon = document.createElement('div');
    icon.classList.add('background-tool__icon');
    icon.style.backgroundColor = value;

    if (color.default) {
      button.classList.add('is-selected');
    }

    const title = document.createElement('div');
    title.classList.add('background-tool__title');
    title.textContent = label;

    button.append(icon, title);

    return button;
  }

  setValue(state) {
    const { value } = state;

    const toUnselect = this.collapsible.inner.querySelector(`button.is-selected`);

    if (toUnselect) {
      toUnselect.classList.remove('is-selected');
    }

    const btnToSelect = this.collapsible.inner.querySelector(`button[data-color-value="${value}"`);

    if (btnToSelect) {
      btnToSelect.classList.add('is-selected');
    }

  }

  getValue() {
    const selectedColor = this.collapsible.container.querySelector('button.is-selected');

    if (selectedColor) {
      const color = JSON.parse(selectedColor.getAttribute('data-color'));

      return {
        ...color
      }
    }
  }

  reset() {
    this.close();
    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          backgroundColor: {
            ...Studio.state.panel.tools.backgroundColor,
            value: BackgroundColorTool.defaultValue
          }
        }
      }
    }, 'background tool - reset')
  }
}

class FilterTool extends Tool {
  constructor() {
    super();

    this.label.setLabel('Filter');
  }
}

class FrameTool extends Tool {
  static frames = {
    black: {
      label: 'Black',
      value: 'black',
      default: true
    },
    white: {
      label: 'White',
      value: 'white',
    }
  }

  static defaultValue = {
    value: 'black'
  }

  constructor() {
    super();

    const icon = `
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M11 1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V4H5V1.5C5 1.22386 4.77614 1 4.5 1C4.22386 1 4 1.22386 4 1.5V4H1.5C1.22386 4 1 4.22386 1 4.5C1 4.77614 1.22386 5 1.5 5H4V10H1.5C1.22386 10 1 10.2239 1 10.5C1 10.7761 1.22386 11 1.5 11H4V13.5C4 13.7761 4.22386 14 4.5 14C4.77614 14 5 13.7761 5 13.5V11H10V13.5C10 13.7761 10.2239 14 10.5 14C10.7761 14 11 13.7761 11 13.5V11H13.5C13.7761 11 14 10.7761 14 10.5C14 10.2239 13.7761 10 13.5 10H11V5H13.5C13.7761 5 14 4.77614 14 4.5C14 4.22386 13.7761 4 13.5 4H11V1.5ZM10 10V5H5V10H10Z" fill="black"/>
      </svg>
    `;

    this.label.setLabel('Frame');

    this.icon.setIcon(icon);
  }

  setContent() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('background-tool');

    const frameButtons = this.buttons = Object.keys(FrameTool.frames)
      .map((color) => this.frameOptionTemplate(FrameTool.frames[color]))
      .map(button => {
        button.addEventListener('click', () => {
          const toUnselect = wrapper.querySelector('button.is-selected');

          if (toUnselect) {
            toUnselect.classList.remove('is-selected');
          }

          button.classList.add('is-selected');

          Studio.utils.change({
            panel: {
              ...Studio.state.panel,
              tools: {
                ...Studio.state.panel.tools,
                frame: {
                  ...Studio.state.panel.tools.frame,
                  value: this.getValue()
                }
              }
            }
          }, 'frame tool - set value');
        })

        return button;
      });

    wrapper.append(...frameButtons);

    this.collapsible.inner.append(wrapper);
  }

  frameOptionTemplate(color) {
    const { label, value } = color;

    const button = document.createElement('button');
    button.classList.add('background-tool__button');
    button.setAttribute('data-frame', JSON.stringify(color));
    button.setAttribute('data-frame-value', value);

    const icon = document.createElement('div');
    icon.classList.add('background-tool__icon');
    icon.style.backgroundColor = value;

    if (color.default) {
      button.classList.add('is-selected');
    }

    const title = document.createElement('div');
    title.classList.add('background-tool__title');
    title.textContent = label;

    button.append(icon, title);

    return button;
  }

  setValue(state) {
    const { value } = state;

    const toUnselect = this.collapsible.inner.querySelector(`button.is-selected`);

    if (toUnselect) {
      toUnselect.classList.remove('is-selected');
    }

    const btnToSelect = this.collapsible.inner.querySelector(`button[data-frame-value="${value}"`);

    if (btnToSelect) {
      btnToSelect.classList.add('is-selected');
    }
  }

  getValue() {
    const selectedFrame = this.collapsible.container.querySelector('button.is-selected');

    if (selectedFrame) {
      const frame = JSON.parse(selectedFrame.getAttribute('data-frame'));

      return {
        ...frame
      }
    }
  }

  reset() {
    this.close();

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        tools: {
          ...Studio.state.panel.tools,
          frame: {
            ...Studio.state.panel.tools.backgroundColor,
            value: FrameTool.defaultValue
          }
        }
      }
    }, 'frame tool - reset')
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
        const { show, value } = currState[tool];
  
        if (show && this.edit.tools[tool]) {
          if (this.edit.tools[tool].isExists()) {
            this.edit.tools[tool].setValue(value);
          } else {
            this.edit.tools[tool].create(value);
          }
        } else {
          if (this.edit.tools[tool].isExists()) {
            this.edit.tools[tool].remove();
          }
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
        Studio.defaultBuilderPath();

        productParams = new URLSearchParams(location.search);

        Studio.utils.change({
          productId: this.pages.products.selected.dataset.id,
          product: null,
          view: globalState.view
        }, 'product change');
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

        <div class="page__product-price">${product.price !== undefined ? `$${product.price}` : '$10,90'}</div>
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
      if (event.detail.imageWrapper) {
        event.detail.imageWrapper.remove();
      }
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
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('page__image-wrapper', 'is-loading');
    imageWrapper.toggleAttribute('data-image');

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
        image.src = baseURL + '/product-builder/' + imageName;
  
        image.onload = () => {
          imageWrapper.classList.remove('is-loading');
        };

        const url = new URL(image.src);

        const original = baseURL + url.pathname;

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
                console.log(error);
              }

              return res;
            });
  
            const imageName = await response.text();

            const isExist = Studio.uploaded.some(upload => upload.thumbnail === imageName);
  
            if (!isExist && response.ok) {
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
    } else if (typeof imageFile === 'string') {
      image.src = baseURL + "/" + imageFile;

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
        filter: new FilterTool(),
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

      this.tools.resetTools();
    }

    if (!compareObjects(prevState.tools, currState.tools)) {
      const toSet = Object.keys(currState.tools)
        .reduce((obj, tool) => {
          obj[tool] = {
            ...currState.tools[tool]
          }

          return obj;
        }, {});

      this.tools.setToolsState(toSet);
    }

      
    if (prevState.blockCount !== currState.blockCount) {
      this.productInfo.setQuantity(currState.blockCount);

      Studio.utils.change({
        view: {
          ...Studio.state.view,
          blockCount: currState.blockCount
        }
      }, 'panel - blockCount: ' + currState.blockCount)
    }
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
    <div class="editable-picture__empty-state" data-empty-state>
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.10156 3.98131C1.10156 3.00356 1.89418 2.21094 2.87193 2.21094H13.9367C14.9145 2.21094 15.7071 3.00356 15.7071 3.98131V12.3906C15.7071 13.3683 14.9145 14.1609 13.9367 14.1609H2.87193C1.89418 14.1609 1.10156 13.3683 1.10156 12.3906V3.98131Z" stroke="#FF0079" stroke-width="1.77037" stroke-linejoin="round"/>
        <path d="M4.08594 14.1618L10.9214 6.7567C11.5568 6.06839 12.6184 5.99415 13.3434 6.58732L15.704 8.51875" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M1.10156 6.85938L6.2467 12.0045" stroke="#FF0079" stroke-width="1.77037"/>
        <path d="M8.73299 8.85104C8.73299 8.18715 7.54405 6.85938 6.07743 6.85938C4.61081 6.85938 3.42188 8.18715 3.42188 8.85104" stroke="#FF0079" stroke-width="1.77037" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  `;

  static defaultValue = {
    crop: CropTool.defaultValue,
    rotate: RotateTool.defaultValue,
    backgroundColor: {
      value: BackgroundColorTool.defaultValue.value
    }
  }

  static ToolsList = ['rotate', 'crop', 'filter'];

  static selectors = {
    emptyState: '[data-empty-state]'
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.toggleAttribute('editable-picture');

    if (!this.getAttribute('child-block')) {
      this.setAttribute('child-block', window.uniqueID.childBlock());
    }

    this.controls = ProductControls.createPictureControls(this.getAttribute('child-block'));
    
    this.parentBlock = Array.from(document.querySelectorAll('[block]')).find(block => {
      const child = Array.from(block.querySelectorAll('[child-block]')).find(cBlock => cBlock.getAttribute('child-block') === this.getAttribute('child-block'));

      return child;
    });

    const { width: resolutionWidth, height: resolutionHeight } = Studio.product.resolution; 

    this.pageConfig = getResolution(resolutionWidth, resolutionHeight);

    this.emptyState = this.querySelector(EditablePicture.selectors.emptyState);
    if (this.emptyState) {
      this.emptyState.addEventListener('click', () => {
        Studio.panel.tools.focusOnTab('images');
      })
    }

    if (!this.hasAttribute('crop')) {
      this.setAttribute('crop', 0);
    }

    if (!this.hasAttribute('rotate')) {
      this.setAttribute('rotate', 0);
    }

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', BackgroundColorTool.defaultValue.value);
    }

    if (this.hasAttribute('picture-url')) {
      this.setImage(this.getAttribute('picture-url'));
      this.toggleAttribute('picture-url');
    }

    this.addEventListener('click', (event) => {
      const isControlsTarget = event.target === this.controls || this.controls.contains(event.target)

      Studio.studioView.setSelectedChild(this, event.shiftKey);

      if (!this.classList.contains('is-empty') && event.target !== this.emptyState && !this.emptyState.contains(event.target) && !isControlsTarget) {
        Studio.panel.tools.focusOnTab('edit');
      }

      if (this.classList.contains('is-empty')) {
        Studio.panel.tools.focusOnTab('images');
      }
    })
  }

  select() {
    this.classList.add('is-selected');

    if (!this.classList.contains('is-empty')) {
      this.appendControls();
    }
  }

  appendControls() {
    this.controls.style.opacity = 0;

    this.append(this.controls);
    setTimeout(() => {
      this.controls.style.opacity = null;
    }, 10);
  }

  unselect() {
    this.classList.remove('is-selected');

    this.controls.remove();
  }

  getToolsList() {
    return ['rotate', 'crop', 'filter'];
  }
  
  
  setImage(imageUrl) {
    if (this.image) {
      this.oldImage = this.image;
      this.oldImage.remove();
    }

    const pictureJSON = Studio.state.view.blocks
      .reduce((childs, block) => [...childs, ...block.childBlocks], [])
      .find(child => child.id === this.getAttribute('child-block'));

    if (this.previewImage) {
      this.oldPreviewImage = this.previewImage;
      this.oldPreviewImage.remove();
    }

    this.defaultImageUrl = imageUrl;

    this.previewImage = new Image();
    this.previewImage.toggleAttribute('crossOrigin');
    this.previewImage.classList.add('editable-picture__image', 'editable-picture__preview-image');
    this.previewImage.style.opacity = 0;
    this.previewImage.draggable = false;

    const findedImage = Studio.uploaded
      .find(image => Object.values(image)
        .some(source => imageUrl.includes(source))
      );
    
    if (!findedImage) {
      return;
    }

    const imageOriginalURL = findedImage.original;

    this.image = new Image();
    this.image.classList.add('editable-picture__image');
    this.image.style.opacity = 0;
    this.image.draggable = false;
    this.image.toggleAttribute('crossOrigin');
    
    this.image.onload = () => {
      this.image.style.opacity = null;
    }

    const getParams = () => {
      const size = this.pageConfig;

      if (this.parentBlock.hasAttribute('photobook-page')) {

        const widthProcent = Math.round(((this.offsetWidth * 100) / this.parentBlock.offsetWidth))
        const heightProcent = Math.round((this.offsetHeight * 100) / this.parentBlock.offsetHeight);
  
        const width = Math.ceil(size.width / 100 * widthProcent);
        const height = Math.ceil(size.height / 100 * heightProcent);
  
        return [width, height];
      }

      return [this.pageConfig.width, this.pageConfig.height];
    };


    const [width, height] = this.pageConfig ? getParams() : [this.offsetWidth, this.offsetHeight];
    const [containerWidth, containerHeight] = [Math.ceil(this.offsetWidth * 1.5), Math.ceil(this.offsetHeight * 1.5)]

    this.defaultImageUrl = imageOriginalURL + `?resize=[${width},${height}]&container=[${containerWidth},${containerHeight}]`;

    this.previewImage.src = this.defaultImageUrl;

    this.image.src = this.defaultImageUrl;

    this.classList.remove('is-empty');
    this.append(this.previewImage, this.image);
  }

  setBackground(background) {
    this.setAttribute('background-color', background);
  }

  removeImage() {
    this.image.remove();
    this.previewImage.remove();

    this.classList.add('is-empty');
  }

  destroy() {
    this.remove();
  }

  hasImage() {
    return this.image && this.image.hasAttribute('src');
  }

  setValue(settings) {
    clearTimeout(this.timer);
    const { crop, rotate, backgroundColor } = settings;

    const toChange = this.classList.contains('is-selected')
      || (
        !compareObjects(this.crop, crop)
          || !compareObjects(this.rotate, rotate)
      ) || !compareObjects(this.previousBackground, backgroundColor);

    this.crop = crop;
    this.rotate = rotate;

    if (crop) {
      this.setAttribute('crop', crop.value);
    }

    if (rotate) {
      this.setAttribute('rotate', rotate.value);
    }

    if (backgroundColor) {
      this.setAttribute('background-color', backgroundColor.value);
    }

    if (this.image && crop && rotate && toChange) {
      this.image.style.opacity = 0;
      this.previewImage.style.opacity = null;

      this.previewImage.style.transform = `rotate(${rotate.value}deg) scale(${1 + (crop.value / 50)})`;
    }

    if (backgroundColor && this.image) {
      this.previousBackground = backgroundColor;

      this.previewImage.src = this.defaultImageUrl + `&background=${backgroundColor.value}`
    }

    if (this.image && rotate && toChange || (this.image && backgroundColor)) {
      this.image.onload = () => {
        this.image.style.opacity = 1;

        setTimeout(() => {
          this.previewImage.style.opacity = 0;
        }, 300);
      }

      this.timer = setTimeout(() => {
        const cropValue = 1 + (Math.round((crop.value / 50) * 100) / 100);

        this.image.src = `${this.defaultImageUrl}&rotate=${rotate.value}&crop=${cropValue}&background=${backgroundColor.value}`;
      }, 600);
    }
  }

  getValue() {
    return {
      crop: {
        value: +this.getAttribute('crop')
      },
      rotate: {
        value: +this.getAttribute('rotate')
      },
      backgroundColor: {
        value: this.getAttribute('background-color')
      }
    }
  }
}
customElements.define('editable-picture', EditablePicture);

class EditableText extends HTMLElement {
  static defaultValue = TextTool.defaultValue;

  static ToolList = ['text'];

  constructor() {
    super();

    this.editableArea = document.createElement('span');
    this.editableArea.classList.add('textarea');

    this.editableArea.textContent = 'Add your description here';
  }

  connectedCallback() {
    this.classList.add('product-element__text', 'textarea-container');
    this.toggleAttribute('editable-text')

    if (!this.getAttribute('child-block')) {
      this.setAttribute('child-block', window.uniqueID.childBlock());
    }

    if (!this.hasAttribute('text-align')) {
      this.setAttribute('text-align', 'center');
    }

    if (!this.hasAttribute('is-bold')) {
      this.setAttribute('is-bold', false);
    }

    if (!this.hasAttribute('is-italic')) {
      this.setAttribute('is-italic', false);
    }

    if (!this.hasAttribute('is-underline')) {
      this.setAttribute('is-underline', false);
    }

    if (!this.hasAttribute('font')) {
      this.setAttribute('font', Studio.state.panel.tools.text.value.font);
    }

    this.append(this.editableArea);

    if (this.hasAttribute('line')) {
      this.editableArea.classList.add('line');
      this.observer = this.observeSpan(this.editableArea);
    }

    this.addEventListener('click', (event) => {
      Studio.studioView.setSelectedChild(this, event.shiftKey);
      Studio.panel.tools.focusOnTab('edit');
    })
  }

  observeSpan = (element) => {
    const mutate = (mutations) => {
      mutations.forEach(mutation => {
        const { textContent } = mutation.target;

        const range = document.createRange();
        const selection = document.getSelection();
        const textArr = textContent.split('');

        if (textArr.length > 35 && this.classList.contains('line')) {
          const maxSize = this.hasAttribute('max-size') ? this.getAttribute('max-size') : 35;

          mutation.target.textContent = textContent.substring(0, maxSize);
          range.setStartAfter(element.lastChild);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);

        } else if (textArr.length > 300) {
          mutation.target.textContent = textContent.substring(0, 300);
          range.setStartAfter(element.lastChild);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);
        }
      })
    }

    const observer = new MutationObserver(mutate);
    const config = { characterData: true, attributes: false, childList: false, subtree: true };

    observer.observe(element, config);

    return observer;
  }

  select() {
    this.classList.add('is-selected');
  }

  unselect() {
    this.classList.remove('is-selected');
  }

  getToolsList() {
    return ['text'];
  }

  setValue(settings) {
    const { text, align, fontStyle, font, maxSize } = settings;

    if (text) {
      this.editableArea.textContent = text;
    }

    if (maxSize) {
      this.setAttribute('max-size', maxSize);
    }

    if (align) {
      this.setAttribute('text-align', align);
    }

    if (fontStyle) {
      const { bold, italic, underline } = fontStyle;

      if (typeof bold === 'boolean') {
        this.setAttribute('is-bold', bold);
      }

      if (typeof italic === 'boolean') {
        this.setAttribute('is-italic', italic);
      }

      if (typeof underline === 'boolean') {
        this.setAttribute('is-underline', underline);
      }
    }

    if (font) {
      this.setAttribute('font', font);
    }
  }

  getValue() {
    return {
      text: {
        text: this.editableArea.textContent,
        align: this.getAttribute('text-align'),
        fontStyle: {
          bold: JSON.parse(this.getAttribute('is-bold')),
          italic: JSON.parse(this.getAttribute('is-italic')),
          underline: JSON.parse(this.getAttribute('is-underline')),
        },
        maxSize: +this.getAttribute('max-size')
      }
    }
  }

  setDefaultText(text) {
    this.editableArea.textContent = text;
  }
}
customElements.define('editable-text', EditableText);

class ProductControls extends HTMLElement {
  static icons = {
    remove: `
      <svg width="19" height="20" viewBox="0 0 19 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.17499 4.75H16.225L15.8025 13.4914C15.6737 16.1559 13.4759 18.25 10.8083 18.25H8.59166C5.92407 18.25 3.72627 16.1559 3.59749 13.4914L3.17499 4.75Z" stroke="currentColor" stroke-width="2"/>
        <path d="M6.07501 4.75V4.75C6.07501 3.09315 7.41816 1.75 9.07501 1.75H10.325C11.9819 1.75 13.325 3.09315 13.325 4.75V4.75" stroke="currentColor" stroke-width="2"/>
        <path d="M11.875 9.25V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M7.52499 9.25V13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M1.72501 4.75H17.675" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>  
    `,
    plus: `
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.52499 9.00977C6.52499 9.28591 6.30114 9.50977 6.02499 9.50977H4.75742C4.48127 9.50977 4.25742 9.28591 4.25742 9.00977V6.66113C4.25742 6.38499 4.03356 6.16113 3.75742 6.16113H1.3912C1.11506 6.16113 0.891205 5.93728 0.891205 5.66113V4.3584C0.891205 4.08226 1.11506 3.8584 1.3912 3.8584H3.75742C4.03356 3.8584 4.25742 3.63454 4.25742 3.3584V0.992188C4.25742 0.716045 4.48127 0.492188 4.75742 0.492188H6.02499C6.30114 0.492188 6.52499 0.716045 6.52499 0.992188V3.3584C6.52499 3.63454 6.74885 3.8584 7.02499 3.8584H9.40878C9.68493 3.8584 9.90878 4.08226 9.90878 4.3584V5.66113C9.90878 5.93728 9.68493 6.16113 9.40878 6.16113H7.02499C6.74885 6.16113 6.52499 6.38499 6.52499 6.66113V9.00977Z" fill="black"/>
      </svg>
    `,
    minus: `
      <svg width="7" height="4" viewBox="0 0 7 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.78867 3.05957H2.01132C1.58945 3.05957 1.26718 2.96289 1.04453 2.76953C0.827728 2.57031 0.71933 2.31543 0.71933 2.00488C0.71933 1.68848 0.824799 1.43359 1.03574 1.24023C1.25253 1.04102 1.57773 0.941406 2.01132 0.941406H4.78867C5.22226 0.941406 5.54453 1.04102 5.75546 1.24023C5.97226 1.43359 6.08066 1.68848 6.08066 2.00488C6.08066 2.31543 5.97519 2.57031 5.76425 2.76953C5.55331 2.96289 5.22812 3.05957 4.78867 3.05957Z" fill="black"/>
      </svg>
    `,
    edit: `
      <svg width="19" height="18" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3.30143 11.8619L13.6969 1.46643C13.7062 1.46378 13.7158 1.4611 13.7258 1.45839C13.8626 1.42133 14.0605 1.38264 14.2925 1.37944C14.7367 1.37331 15.3279 1.49293 15.9134 2.07843C16.4989 2.66392 16.6185 3.25504 16.6123 3.69925C16.6091 3.93131 16.5705 4.1292 16.5334 4.266C16.5307 4.27601 16.528 4.28563 16.5254 4.29486L6.12986 14.6904L2.91574 15.076L3.30143 11.8619Z" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M3.30143 11.8619L13.6969 1.46643C13.7062 1.46378 13.7158 1.4611 13.7258 1.45839C13.8626 1.42133 14.0605 1.38264 14.2925 1.37944C14.7367 1.37331 15.3279 1.49293 15.9134 2.07843C16.4989 2.66392 16.6185 3.25504 16.6123 3.69925C16.6091 3.93131 16.5705 4.1292 16.5334 4.266C16.5307 4.27601 16.528 4.28563 16.5254 4.29486L6.12986 14.6904L2.91574 15.076L3.30143 11.8619Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M11.1003 2.64844L15.141 6.68905" stroke="white" stroke-width="2"/>
        <path d="M11.1003 2.64844L15.141 6.68905" stroke="currentColor" stroke-width="2"/>
        <path d="M3.90781 1V6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M6.39999 3.5L1.39999 3.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>  
    `,
  }

  static createBlockControls = (productId) => {
    const blockElem = document.querySelector(StudioView.selectors.blockById(productId));

    const productControls = document.createElement('product-controls');

    productControls.setAttribute('type', 'block');
    productControls.classList.add('product-element__controls', 'product-controls');
    productControls.setAttribute('block-controls', productId);

    const removeBtn = document.createElement('button');
    removeBtn.toggleAttribute('data-remove');
    removeBtn.classList.add('product-controls__button');
    removeBtn.innerHTML = ProductControls.icons.remove;

    const controlsQuantity = document.createElement('div');
    controlsQuantity.classList.add('product-controls__quantity');
    controlsQuantity.toggleAttribute('data-quantity');

    const plus = document.createElement('button');
    plus.classList.add('product-controls__button');
    plus.toggleAttribute('data-quantity-add');
    plus.innerHTML = ProductControls.icons.plus;

    const count = document.createElement('span');
    count.toggleAttribute('data-quantity-count');
    count.innerHTML = '1';

    const minus = document.createElement('button');
    minus.classList.add('product-controls__button');
    minus.toggleAttribute('data-quantity-remove');
    minus.innerHTML = ProductControls.icons.minus;

    controlsQuantity.append(plus, count, minus);

    const editBtn = document.createElement('button');
    editBtn.classList.add('product-controls__button');
    editBtn.toggleAttribute('data-edit');
    editBtn.innerHTML = ProductControls.icons.edit;

    const editTooltip = document.createElement('span');
    editTooltip.classList.add('button__tooltip');
    editTooltip.textContent = 'Edit';

    editBtn.append(editTooltip);

    if (blockElem && blockElem.getAttribute('block-type') === 'photobook-page' || Studio.product.quantity.type === 'single') {
      productControls.append(removeBtn, editBtn);
    } else {
      productControls.toggleAttribute('is-quantitative');
      productControls.append(removeBtn, controlsQuantity, editBtn);
    }

    return productControls;
  }

  static createPictureControls = (blockId) => {
    const pictureControls = document.createElement('product-controls');
    pictureControls.classList.add('product-element__controls', 'product-controls', 'product-controls--picture');
    pictureControls.setAttribute('type', 'picture');
    pictureControls.setAttribute('block-controls', blockId);

    const removeBtn = document.createElement('button');
    removeBtn.toggleAttribute('data-remove');
    removeBtn.classList.add('product-controls__button');
    removeBtn.innerHTML = ProductControls.icons.remove;

    const editBtn = document.createElement('button');
    editBtn.classList.add('product-controls__button');
    editBtn.toggleAttribute('data-edit');
    editBtn.innerHTML = ProductControls.icons.edit;

    const editTooltip = document.createElement('span');
    editTooltip.classList.add('button__tooltip');
    editTooltip.textContent = 'Edit';

    editBtn.append(editTooltip);

    pictureControls.append(removeBtn, editBtn);

    return pictureControls
  }

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
  }

  connectedCallback() {
    this.init(this.getAttribute('type'));
  }

  disconnectedCallback() {
    if (this.elements.remove) {
      this.elements.remove.removeEventListener('click', this.removeBlock);
      this.elements.remove.removeEventListener('click', this.removePicture);
    }

    if (this.elements.edit) {
      this.elements.edit.removeEventListener('click', this.openEdit);
    }

    if (this.elements.decreaseQuantity) {
      this.elements.decreaseQuantity.removeEventListener('click', this.decreaseQuantity);
    }

    if (this.elements.increaseQuantity) {
      this.elements.increaseQuantity.removeEventListener('click', this.increaseQuantity);
    }
  }

  init(type) {
    const block = this.parentElement.querySelector(StudioView.selectors.block);
    
    this.productId = this.getAttribute('block-controls');

    const remove = this.querySelector(ProductControls.selectors.remove);
    const edit = this.querySelector(ProductControls.selectors.edit);

    const increaseQuantity = this.querySelector(ProductControls.selectors.quantity.plus);
    const decreaseQuantity = this.querySelector(ProductControls.selectors.quantity.minus);

    if (increaseQuantity) {
      increaseQuantity.addEventListener('click', this.increaseQuantity.bind(this));
    }

    if (decreaseQuantity) {
      decreaseQuantity.addEventListener('click', this.decreaseQuantity.bind(this));
    }

    const quantity = this.querySelector(ProductControls.selectors.quantity.count);

    this.elements = {
      product: block,
      remove,
      edit,
      increaseQuantity,
      decreaseQuantity,
      quantity
    }

    this.type = type;

    if (remove) {
      switch (type) {
        case 'block':
          remove.addEventListener('click', this.removeBlock.bind(this));
          break;
        case 'picture':
          remove.addEventListener('click', this.removePicture.bind(this))
          break;
      }
    }

    if (edit) {
      edit.addEventListener('click', this.openEdit.bind(this));
    }
  }

  openEdit() {
    if (this.elements.product) {
      Studio.studioView.setSelectedBlock(this.elements.product, false, false);
    }
    
    Studio.panel.tools.focusOnTab('edit')
  }

  removeBlock() {
    const newBlocks = Studio.state.view.blocks
      .map(block => {
        if (block.id === this.getAttribute('block-controls')) {
          const newChildren = block.childBlocks
            .map(child => {
              if (child.type === 'editable-picture') {
                return {
                  ...child,
                  imageUrl: null
                }
              }

              return child;
            })

          return {
            ...block,
            childBlocks: newChildren
          }
        }

        return block;
      });

    Studio.utils.change({
      view: {
        ...Studio.state.view,
        blocks: newBlocks
      }
    }, 'controls - remove block')
  }

  removePicture() {
    const newBlocks = Studio.state.view.blocks
      .map(block => {
        if (block.childBlocks.some(child => child.id === this.getAttribute('block-controls'))) {
          const newChildren = block.childBlocks
            .map(child => {
              if (child.id === this.getAttribute('block-controls')) {
                return {
                  ...child,
                  imageUrl: null
                }
              }

              return child
            });

          return {
            ...block,
            childBlocks: newChildren
          }
        }
        

        return block
      });

    Studio.utils.change({
      view: {
        ...Studio.state.view,
        blocks: newBlocks
      }
    }, 'remove picture')
  }

  increaseQuantity() {
    const { blocks } = Studio.state.view;

    const maxCount = Studio.product.quantity.maximum
      ? Studio.product.quantity.maximum
      : Infinity;

    const prevCount = blocks.reduce((count, block) => count + block.count, 0);

    const newBlocks = blocks.map(block => {
      if (block.id === this.productId && prevCount < maxCount) {
        const currCount = block.count + 1;

        return {
          ...block,
          count: currCount
        }
      }

      return block;
    });

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        blockCount: Studio.state.panel.blockCount + 1
      },
      view: {
        ...Studio.state.view,
        blocks: newBlocks,
        blockCount: Studio.state.panel.blockCount + 1
      }
    }, 'controls - increase');
  }

  decreaseQuantity() {
    const { blocks } = Studio.state.view;

    const minCount = 0;
    let currCount;

    const newBlocks = blocks.map(block => {
      if (block.id === this.productId && block.count > minCount) {
        currCount = block.count - 1;

        return {
          ...block,
          count: currCount
        }
      }

      return block;
    });

    Studio.utils.change({
      panel: {
        ...Studio.state.panel,
        blockCount: Studio.state.panel.blockCount - 1
      },
      view: {
        ...Studio.state.view,
        blocks: newBlocks,
        blockCount: Studio.state.panel.blockCount - 1
      }
    }, 'controls - decrease');
  }

  setStateDecreaseBtn(isDisable) {
    if (isDisable && !this.elements.decreaseQuantity.hasAttribute('disabled')) {
      this.elements.decreaseQuantity.toggleAttribute('disabled');
    } else if (!isDisable && this.elements.decreaseQuantity.hasAttribute('disabled')) {
      this.elements.decreaseQuantity.toggleAttribute('disabled');
    }
  }

  setStateIncreaseBtn(isDisable) {
    if (isDisable && !this.elements.increaseQuantity.hasAttribute('disabled')) {
      this.elements.increaseQuantity.toggleAttribute('disabled');
    } else if (!isDisable && this.elements.increaseQuantity.hasAttribute('disabled')) {
      this.elements.increaseQuantity.toggleAttribute('disabled');
    }
  }

  isQuantitative() {
    return this.hasAttribute('is-quantitative');
  }

  setValue(value) {
    this.elements.quantity.textContent = value;
  }
}
customElements.define('product-controls', ProductControls);

class ProductElement extends HTMLElement {
  static selectors = {
    picture: 'editable-picture',
    controls: 'product-controls'
  }

  constructor() {
    super();

    this.addEventListener('click', this.select.bind(this));

    this.state = {
      selectedPicture: this.querySelector('editable-picture'),
    };
    this.studioView = document.querySelector('studio-view');
  }

  connectedCallback() {
    this.setAttribute('required-count-of-images', 1);
    this.setAttribute('count-of-images', 0);

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.setAttribute('block-type', 'default-product');

    this.initControls();
    this.setContent();
  }

  setContent() {
    const picture = document.createElement('editable-picture');
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );

    picture.innerHTML += EditablePicture.emptyState;
    this.appendChild(picture);

    this.style.opacity = 0;
    setTimeout(() => {
      this.style.opacity = null;
    });
  }

  initControls() {
    this.controls = this.querySelector(ProductElement.selectors.controls);

    if (this.controls) {
      this.controls.addEventListener('clear:product', (() => {
        this.clear()
      }).bind(this));
    }
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

  editableQuery(editablePicturesJSON = []) {
    let queryCount = 0;

    const states = [...editablePicturesJSON];

    return () => {
      return states[queryCount++];
    };
  }

  getEditable(state) {
    const picture = document.createElement('editable-picture')
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );

    picture.innerHTML += EditablePicture.emptyState;

    if (state) {
      const { id, imageUrl, settings } = state;

      picture.setAttribute('child-block', id);

      if (imageUrl) {
        picture.setAttribute('picture-url', imageUrl);
      }

      picture.setValue(settings);
    }

    return picture;
  }

  getText(state, options = {
    line: false,
    defaultText: null,
    maxSize: 35
  }) {
    const { line, defaultText, maxSize } = options;

    const textarea = document.createElement('editable-text');

    if (line) {
      if (!textarea.hasAttribute('line')) {
        textarea.toggleAttribute('line');
      }

      if (maxSize && !textarea.hasAttribute('max-size')) {
        textarea.setAttribute('max-size', maxSize);
      }
    }

    if (defaultText) {
      textarea.setDefaultText(defaultText);
    }

    if (state) {
      const { id, settings } = state;

      textarea.setAttribute('child-block', id);
      textarea.setValue(settings);
    }

    return textarea;
  }

  select() {
    this.parentElement.classList.add('is-selected');
    this.classList.add('is-selected');
  }

  unselect() {
    this.parentElement.classList.remove('is-selected');
    this.classList.remove('is-selected');
  }

  getId() {
    return this.getAttribute('product-element');
  }

  setValue() {

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
    text: 'editable-text',
    child: 'photobook-page > [data-child]'
  }

  static config = {
    '20x20': {
      width: 4724,
      height: 2362
    },
    '15x15': {
      width: 3543,
      height: 1772
    }
  }

  static get observedAttributes() {
    return ['photobook-page', 'background-color', 'is-white'];
  }
  
  constructor() {
    super();
  }

  connectedCallback() {
    if (!this.getAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.setAttribute('photobook-size', '20x20');

    this.setAttribute('block-type', 'photobook-page');

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', '#fff');
      this.setAttribute('is-white', false);
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    this.parentElement.append(this.controls);
  
    this.init();

    this.addEventListener('click', (event) => {
      if (event.target === this) {
        Studio.panel.tools.focusOnTab('edit');
      }
    })
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) {
      return;
    }

    switch(name) {
      case 'photobook-page':
        this.layout = layouts[newValue];
        if (this.layout.id !== oldValue) {
          this.selectLayout();
        }
        break;
      case 'background-color':
        this.backgroundColor = newValue;
        this.setBackgroundColor();
        break;
      case 'is-white':
        if (JSON.parse(newValue)) {
          this.style.color = '#fff';
        } else {
          this.style.color = null;
        }
        break;
    }
  }

  init() {
    this.layout = layouts[this.getAttribute('photobook-page')];

    this.midGradiend = this.initMiddleGradient();
    this.midGradiend.create();
  }

  setValue(settings, block) {
    const { layout, backgroundColor } = settings;

    if (layout && this.layout !== layout.value) {
      const editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');

      const editableText = block.childBlocks
        .filter(child => child.type === 'text');

      this.setLayout(layout.layout, editablePictures, editableText);
    }

    if (backgroundColor) {
      this.setAttribute('background-color', backgroundColor.value);

      if (backgroundColor.whiteFont) {
        this.setAttribute('is-white', true);
      } else {
        this.setAttribute('is-white', false);
      }
    }
  }

  setBackgroundColor() {
    if (!this.backgroundColor) {
      return;
    }

    this.style.backgroundColor = this.backgroundColor;
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

  setLayout(layout, editablePicturesJSON, editableTextJSON) {
    this.editablePicturesJSON = editablePicturesJSON;
    this.editableTextJSON = editableTextJSON;
    this.setAttribute('photobook-page', layout);
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

  getEditable(state) {
    const picture = document.createElement('editable-picture')
    picture.classList.add(
      'product-element__picture',
      'editable-picture',
      'is-empty'
    );

    picture.innerHTML += EditablePicture.emptyState;

    if (state) {
      const { id, imageUrl, settings } = state;

      picture.setAttribute('child-block', id);

      if (imageUrl) {
        picture.setAttribute('picture-url', imageUrl);
      }

      picture.setValue(settings);
    }

    return picture;
  }

  getText(state, options = {
    line: false
  }) {
    const { line } = options;

    const textarea = document.createElement('editable-text');

    if (line) {
      textarea.toggleAttribute('line');
    }

    if (state) {
      const { id, settings } = state;

      textarea.setAttribute('child-block', id);
      textarea.setValue(settings);
    }

    return textarea;
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

  editableQuery(editablePicturesJSON = []) {
    let queryCount = 0;

    const states = [...editablePicturesJSON];

    return () => {
      return states[queryCount++];
    };
  }

  wholeLayout() {
    this.clearLayout();

    const editableQuery = this.editableQuery(this.editablePicturesJSON);

    const bigImage = this.getEditable(editableQuery());

    this.append(bigImage);
  }

  bigWithThreeSquareLayout() {
    this.clearLayout();

    const editableQuery = this.editableQuery(this.editablePicturesJSON);

    const bigImage = this.getEditable(editableQuery());

    const small = [
      this.getEditable(editableQuery()),
      this.getEditable(editableQuery()),
      this.getEditable(editableQuery())
    ];

    this.append(bigImage, ...small);

  }

  wholeFramelessLayout() {
    this.clearLayout();

    const editableQuery = this.editableQuery(this.editablePicturesJSON);

    this.append(this.getEditable(editableQuery()));

  }

  rightImageWithTextLayout() {
    this.clearLayout();

    const editablePicQuery = this.editableQuery(this.editablePicturesJSON);
    const editableTextQuery = this.editableQuery(this.editableTextJSON);

    const text = this.getText(editableTextQuery());

    const image = this.getEditable(editablePicQuery());

    this.append(text, image);

  }

  leftImageWithTextLayout() {
    this.clearLayout();

    const editableQuery = this.editableQuery(this.editablePicturesJSON);
    const editableTextQuery = this.editableQuery(this.editableTextJSON);

    const text = this.getText(editableTextQuery());

    const image = this.getEditable(editableQuery());

    this.append(image, text);

  }

  twoRectangleImagesWithTextLayout() {
    this.clearLayout();

    const editableQuery = this.editableQuery(this.editablePicturesJSON);
    const editableTextQuery = this.editableQuery(this.editableTextJSON);

    const [leftWrap, rightWrap] = [document.createElement('div'), document.createElement('div')];

    leftWrap.toggleAttribute('data-child');
    rightWrap.toggleAttribute('data-child');

    leftWrap.append(this.getEditable(editableQuery()), this.getText(editableTextQuery(), { line: true }));
    rightWrap.append(this.getEditable(editableQuery()), this.getText(editableTextQuery(), { line: true }));

    this.append(leftWrap, rightWrap);
  }
}
customElements.define('photobook-page', PhotobookPage);

class Prints extends ProductElement {
  static getConfig = (type) => {
    switch (type) {
      case 'polaroid':
        return PolaroidPrints.config.sizes;
      case '9-13':
        return getResolution(9, 13);
      case '10-15':
        return getResolution(10, 15);
      case '15-21':
        return getResolution(15, 21);
      case '20-30':
        return getResolution(20, 30);
      case '30-40':
        return getResolution(30, 40);
      default:
        return {
          width: 800,
          height: 800
        }
    }
  }

  static printTypes = ['9-13', '10-15', '15-21', '20-30', '30-40'];

  static get observedAttributes() {
    return ['background-color', 'is-white'];
  }

  constructor() {
    super();

    this.addEventListener('click', (event) => {
      if (event.target === this) {
        Studio.panel.tools.focusOnTab('edit');
      }
    })
  }

  connectedCallback() {
    this.initDefaultPrintsConfig();
  }

  initDefaultPrintsConfig() {
    this.classList.add('prints', 'product-element');

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    // this.setAttribute('block-type', 'prints');

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', '#fff');
    }

    this.parentElement.append(this.controls);

    this.setContent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.initAttributeChangeConfig(name, oldValue, newValue);
  }

  initAttributeChangeConfig(name, oldValue, newValue) {
    
  }

  setContent() {
    const editableQuery = this.editableQuery(this.editablePictures);

    const picture = this.getEditable(editableQuery());

    this.append(picture);
  }

  setValue(settings, block) {
    this.editablePictures = block.childBlocks
      .filter(child => child.type === 'editable-picture');
  }
}
customElements.define('product-prints', Prints);

class Canvas extends Prints {
  static getConfig = (type) => {
    switch (type) {
      case '30-40':
        return getResolution(30, 40);
      case '30-30':
        return getResolution(30, 30);
      case '40-40':
        return getResolution(40, 40);
      default:
        return {
          width: 800,
          height: 800
        }
    }
  }

  static printTypes = ['30-40', '40-40', '30-30'];

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('canvas', 'product-element');

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    this.setAttribute('block-type', 'canvas');

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', '#fff');
    }

    this.parentElement.append(this.controls);

    this.setContent();
  }

  setValue(settings, block) {
    if (block) {
      this.editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');
    
      this.editableText = block.childBlocks
        .filter(child => child.type === 'text');
    }
  }
}
customElements.define('product-canvas', Canvas);

class PolaroidPrints extends Prints {
  static config = { 
    sizes: getResolution(7.8, 7.68)
  } 

  constructor() {
    super();
  }

  connectedCallback() {
    this.setAttribute('print-type', 'polaroid');

    this.initDefaultPrintsConfig();

    this.setAttribute('required-count-of-images', 1);
    this.setAttribute('count-of-images', 0);

    this.classList.add('prints__polaroid', 'polaroid');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.initAttributeChangeConfig(name, oldValue, newValue);

    switch(name) {
      case 'background-color':
        this.backgroundColor = newValue;
        this.setBackgroundColor();
        break;
      case 'is-white':
        if (JSON.parse(newValue)) {
          this.style.color = '#fff';
        } else {
          this.style.color = null;
        }
      break;
    }
  }

  setContent() {
    const editableQueryPicture = this.editableQuery(this.editablePictures);
    const editableQueryText = this.editableQuery(this.editableText);

    const picture = this.getEditable(editableQueryPicture());
    const text = this.getText(editableQueryText(), {
      line: true,
      defaultText: 'Add text here',
      maxSize: 20
    });

    this.append(picture, text);
  }

  setValue(settings, block) {
    const { backgroundColor} = settings;

    if (backgroundColor) {
      this.setAttribute('background-color', backgroundColor.value);

      if (backgroundColor.whiteFont) {
        this.setAttribute('is-white', true);
      } else {
        this.setAttribute('is-white', false);
      }
    }

    if (block) {
      this.editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');
    
      this.editableText = block.childBlocks
        .filter(child => child.type === 'text');
    }
  }

  setBackgroundColor() {
    if (!this.backgroundColor) {
      return;
    }

    this.style.backgroundColor = this.backgroundColor;
  }
}
customElements.define('polaroid-prints', PolaroidPrints);

class Puzzle extends ProductElement {
  static puzzleSvg = async () => {
    return await fetch(baseURL + '/product-builder/assets/puzzleTemplate.svg')
      .then(res => res.blob())
  };


  static get observedAttributes() {
    return ['background-color'];
  }

  static types = ['96', '192', '513'];

  static getConfig = (type) => {
    switch (type) {
      case '192':
        return getResolution(30, 40);
      case '513':
        return getResolution(50, 70);
      case '96':
      default:
        return getResolution(20, 30)
    }
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('puzzle', 'product-element');

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    this.setAttribute('block-type', 'puzzle');

    if (!this.hasAttribute('background-color')) {
      this.setAttribute('background-color', '#fff');
    }

    this.parentElement.append(this.controls);

    this.setContent();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'background-color':
        this.backgroundColor = newValue;
        this.setBackgroundColor();
    }
  }

  setContent() {
    const reader = new FileReader();

    const svgContainer = document.createElement('div');
    svgContainer.classList.add('puzzle__template-container');

    reader.onloadend = () => {
      svgContainer.style.backgroundImage = `url(${reader.result})`;
    }

    Puzzle.puzzleSvg()
      .then(blob => {
        reader.readAsDataURL(blob);
      })

    const editableQuery = this.editableQuery(this.editablePictures);

    const picture = this.getEditable(editableQuery());

    picture.append(svgContainer);

    this.append(picture);
  }

  setValue(settings, block) {
    const { backgroundColor} = settings;

    if (backgroundColor) {
      this.setAttribute('background-color', backgroundColor.value);

      if (backgroundColor.whiteFont) {
        this.setAttribute('is-white', true);
      } else {
        this.setAttribute('is-white', false);
      }
    }

    if (block) {
      this.editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');
    }
  }

  setBackgroundColor() {
    if (!this.backgroundColor) {
      return;
    }

    this.style.backgroundColor = this.backgroundColor;
  }
}
customElements.define('product-puzzle', Puzzle);

class Magnet extends ProductElement {
  static heartMask = `
    <svg width="161" height="151" viewBox="0 0 161 151" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.58381 28.0062C19.5838 -8.9946 63.0859 -9.49519 80.0859 28.5053C97.5859 -10.4952 141.586 -8.4952 156.586 28.5053C161.598 43.3284 162.409 51.8629 156.586 66.0054C153.5 73.5 150.893 77.0037 146.086 82.5053L90.5859 144.505C82.5859 153.005 77.0859 153.005 69.5859 144.505L14.5859 82.5053C11.6564 79.9656 7.97936 76.1178 3.58381 66.0054C-1.91412 51.5054 -0.416794 39.5054 3.58381 28.0062Z" fill="#D9D9D9"/>
    </svg>  
  `;

  constructor() {
    super();
  }
  
  connectedCallback() {
    this.classList.add('magnet', 'product-element');

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    switch(this.getAttribute('magnet-type')) {
      case 'heart':
        this.classList.add('magnet--heart');
        break;
      case 'circle':
        this.classList.add('magnet--circle');
        break;
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    this.setAttribute('block-type', 'magnet');

    this.parentElement.append(this.controls);

    this.setContent();
  }

  setContent() {
    const editableQuery = this.editableQuery(this.editablePictures);
  
    const picture = this.getEditable(editableQuery());

    if (this.getAttribute('magnet-type') === 'heart') {
      picture.style.mask = `url('data:image/svg+xml;base64,${btoa(Magnet.heartMask)}') center center / contain no-repeat`;
      picture.style.webkitMask = `url('data:image/svg+xml;base64,${btoa(Magnet.heartMask)}') center center / contain no-repeat`;
    }

    this.append(picture);
  }

  setValue(settings, block) {
    if (block) {
      this.editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');
    
      this.editableText = block.childBlocks
        .filter(child => child.type === 'text');
    }
  }
}
customElements.define('product-magnet', Magnet);

class Tiles extends ProductElement {
  static frames = {
    black: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0.5 161 161"><path fill="#373737" fill-rule="evenodd" d="M0 .5h161v161H0V.5Zm151.45 8.54H8.55v142.7H9v.26h143V10h-.55v-.96Z" clip-rule="evenodd"/><path fill="#000" d="M1.22 1.72V161.5H161V1.72H1.22Zm151.24 151.24H9.76V10.26h142.7v142.7Z"/></svg>`,
    white: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="20 30.5 161 161"><g clip-path="url(#a)" filter="url(#b)"><path fill="#ECECEC" d="M21.22 31.72V191.5H181V31.72H21.22Zm151.24 151.24H29.76V40.26h142.7v142.7Z"/></g><defs><clipPath id="a"><path fill="#fff" d="M20 30.5h161v161H20z"/></clipPath><filter id="b" width="249" height="249" x="-11" y="-.5" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="13" dy="13"/><feGaussianBlur stdDeviation="22"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend in2="BackgroundImageFix" result="effect1_dropShadow_806_20103"/><feBlend in="SourceGraphic" in2="effect1_dropShadow_806_20103" result="shape"/></filter></defs></svg>`
  }

  static get observedAttributes() {
    return ['frame']
  }

  constructor() {
    super();
  }

  connectedCallback() {
    this.classList.add('tile', 'product-element');

    if (!this.hasAttribute('block')) {
      this.setAttribute('block', uniqueID.block());
    }

    this.controls = ProductControls.createBlockControls(this.getAttribute('block'));

    if (!this.hasAttribute('block-type')) {
      this.setAttribute('block-type', 'tile');
    }

    this.parentElement.append(this.controls);

    this.setContent();

    if (!this.hasAttribute('frame')) {
      this.setAttribute('frame', 'black');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch(name) {
      case 'frame':
        this.setFrame(newValue);
        break;
    }
  }

  setContent() {
    const editableQuery = this.editableQuery(this.editablePictures);

    const frame = document.createElement('div');
    this.frame = frame;
    frame.classList.add('tile__frame');

    this.setFrame(this.getAttribute('frame'));
    
    const picture = this.getEditable(editableQuery());

    this.append(picture, frame);
  }

  setFrame(frame) {
    const frameSvg = Tiles.frames[frame];

    if (!frameSvg || !this.frame) {
      return;
    }

    this.frame.style.backgroundImage = `url('data:image/svg+xml;base64,${btoa(frameSvg)}')`;
  }

  setValue(settings, block) {
    const { frame } = settings;

    if (frame) {
      this.setAttribute('frame', frame.value);
    }

    if (block) {
      this.editablePictures = block.childBlocks
        .filter(child => child.type === 'editable-picture');
    }
  }
}
customElements.define('product-tiles', Tiles);

class ViewControls extends HTMLElement {
  static selectors = {
    zoomIn: '[data-zoom-in]',
    zoomOut: '[data-zoom-out]',
    undo: '[data-undo]',
    redo: '[data-redo]',
  }

  constructor() {
    super();

    this.element = {
      zoomIn: this.querySelector(ViewControls.selectors.zoomIn),
      zoomOut: this.querySelector(ViewControls.selectors.zoomOut),
      undo: this.querySelector(ViewControls.selectors.undo),
      redo: this.querySelector(ViewControls.selectors.redo)
    }

    this.zoom = {
      studio: document.querySelector('studio-view'),
      studioPlayground: document.querySelector('[data-playground]'),
      studioContainer: document.querySelector('[data-studio-view-container]'),
    }

    this.studioPositionX = 0;
    this.studioPositionY = 0;

    this.element.undo.addEventListener('click', () => {
      Studio.utils.history.undoState();
    });

    this.element.redo.addEventListener('click', () => {
      Studio.utils.history.redoState();
    });

    this.element.zoomIn.addEventListener('click', this.zoomIn.bind(this));

    this.element.zoomOut.addEventListener('click', this.zoomOut.bind(this));

    this.mouseListener = this.studioDrag.bind(this);

    this.zoom.studio.addEventListener('mousedown', (event) => {
      if (!JSON.parse(this.zoom.studio.getAttribute('zoomed'))) {
        return;
      }

      this.prevXPosition = event.clientX;
      this.prevYPosition = event.clientY;

      this.zoom.studioPlayground.addEventListener('mousemove', this.mouseListener);
    });

    window.addEventListener('mouseup', () => {
      if (!JSON.parse(this.zoom.studio.getAttribute('zoomed'))) {
      return;
    }

    this.zoom.studioPlayground.removeEventListener('mousemove', this.mouseListener);
    this.zoom.studioContainer.classList.remove('on-drag');
    })
  }

  studioDrag(event) {
    this.zoom.studioContainer.classList.add('on-drag');

    const scale = JSON.parse(this.zoom.studioPlayground.style.scale);

    const xMove = (event.clientX - this.prevXPosition) / scale;
    const yMove = (event.clientY - this.prevYPosition) / scale;

    this.studioPositionX = ((this.studioPositionX * -1) - xMove) * -1;
    this.studioPositionY =((this.studioPositionY * -1) - yMove) * -1;

    this.zoom.studioContainer.style.translate = `${this.studioPositionX}px ${this.studioPositionY}px`;

    this.prevXPosition = event.clientX;
    this.prevYPosition = event.clientY;
  }

  async zoomIn() {
    this.zoom.studio.setAttribute('zoomed', true);
    this.zoom.studioPlayground.style.overflow = 'hidden';
    
    this.zoom.studioPlayground.style.scale = null;
    this.zoom.studioContainer.style.translate = null;

    this.zoom.studioContainer.style.transition = 'transform .3s, scale .3s, translate .3s';
    this.zoom.studioPlayground.style.transition = 'scale .3s';

    const { blocks } = Studio.state.view;

    let selectedElem, selected = blocks.find(block => block.selected);
    const blockWithActiveChild = blocks.find(block => block.activeChild);

    if (!selected && blockWithActiveChild) {
      selected = blockWithActiveChild.childBlocks.find(child => child.selected);
    }

    let offsetScrollTop;

    if (selected && selected.id.startsWith('block')) {
      selectedElem = document.querySelector(StudioView.selectors.blockById(selected.id));
      offsetScrollTop = selectedElem.offsetTop;
    } else if (selected && selected.id.startsWith('child')) {
      selectedElem = document.querySelector(StudioView.selectors.childBlockById(selected.id));
      offsetScrollTop = document.querySelector(StudioView.selectors.blockById(blockWithActiveChild.id)).offsetTop;
    } else {
      return;
    }

    if (!selectedElem) {
      return;
    }
    
    const [offsetLeft, offsetTop] = this.getOffset(selectedElem);
    
    this.toScroll(offsetScrollTop - 35, selectedElem);
    
    const scale = this.getScale(selectedElem);
    
    this.zoom.studioPlayground.style.scale = scale;

    this.studioPositionX = offsetLeft;
    this.studioPositionY = offsetTop;

    this.zoom.studioContainer.style.translate = `${this.studioPositionX}px ${this.studioPositionY}px`;

    clearTimeout(this.untransitionTimer);

    this.untransitionTimer = setTimeout(() => {
      this.zoom.studioContainer.style.transition = null;
      this.zoom.studioPlayground.style.transition = null;
    }, 500);
  
  }

  toScroll(position, selectedElem) {
    return new Promise(res => {
      this.zoom.studioPlayground.scrollTo({
        top: position,
        behavior: 'smooth'
      });

      let same = 0;
      let lastPos = null;

      const check = () => {
        const newPos = selectedElem.getBoundingClientRect().top;

        if (newPos === lastPos) {
          if (same > 2) {
            return res();
          }

          same++;
        } else {
          same = 0;
          lastPos = newPos;
        }

        requestAnimationFrame(check);
      }

      requestAnimationFrame(check);
    })
  }

  async zoomOut() {
    this.zoom.studio.setAttribute('zoomed', false);
    this.zoom.studioPlayground.style.overflow = null;

    this.zoom.studioContainer.style.transition = 'transform .3s, scale .3s, translate .3s';
    this.zoom.studioPlayground.style.transition = 'scale .3s';

    this.zoom.studioPlayground.style.scale = null;
    this.zoom.studioContainer.style.translate = null;

    clearTimeout(this.untransitionTimer);
    this.untransitionTimer = setTimeout(() => {
      this.zoom.studioContainer.style.transition = null;
      this.zoom.studioPlayground.style.transition = null;
    }, 500);
  }

  getOffset(elem) {
    const containerParams = this.zoom.studioContainer.getBoundingClientRect();
    const studioParams = this.zoom.studio.getBoundingClientRect();

    const elemParams = elem.getBoundingClientRect();

    const leftOffset = elemParams.x - studioParams.x - (elemParams.width / 2);

    const left = ((containerParams.width / 2) - (elemParams.width / 2) - leftOffset);
    const top = ((containerParams.height / 2) - (elemParams.height / 2));
  
    return [left, top];
  }

  getScale(elem) {
    if (!elem) {
      return;
    }

    const containerParams = this.zoom.studio.getBoundingClientRect();

    const elemParams = elem.getBoundingClientRect();

    const compareSide = Math.max(elemParams.width, elemParams.height);

    const compare = elemParams.width
    ? +((containerParams.width / compareSide).toFixed(2))
    : +((containerParams.height / compareSide).toFixed(2));

    return compare > 4
      ? compare * 0.4
      : compare;
  }
}
customElements.define('view-controls', ViewControls);

class StudioView extends HTMLElement {
  static selectors = {
    studio: 'studio-view',
    sizeSelector: '[data-product-option-selector]',
    container: '[data-studio-view-container]',
    productElement: '[product-element]',
    productInfo: 'product-info',
    tools: 'customization-tools',
    block: '[block]',
    studioBlock: '[data-studio-block]',
    blockById: (id) => `[block="${id}"]`,
    studioBlockById: (id) => `[data-studio-block="${id}"]`,
    editableById: (id) => `[editable-picture="${id}"]`,
    editablePicture: '[editable-picture]',
    childBlock: '[child-block]',
    childBlockById: (id) => `[child-block="${id}"]`,
    viewControls: 'view-controls',
    blockControls: 'product-controls',
    blockControlsById: (id) => `product-controls[block-controls="${id}"]`,
    addBlock: '[data-add-block]'
  };

  static get observedAttributes() {
    return ['state', 'zoomed'];
  }

  constructor() {
    super();
    this.setAttribute('state', JSON.stringify(globalState.view));

    this.viewControls = this.querySelector(StudioView.selectors.viewControls);

    this.addEventListener('click', this.eventSelectedBulk.bind(this));

    this.addBlockBtn = this.initAddBlockBtn();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const prevState = JSON.parse(oldValue);
    const currState = JSON.parse(newValue);

    if (name === 'zoomed') {
      if (currState) {
        this.classList.add('is-zoomed')
      } else {
        this.classList.remove('is-zoomed');
      }
    }

    this.state = currState;

    if (!prevState || !currState) {
      return;
    }

    if (compareObjects(prevState, currState)) {
      return;
    }


    if (!compareObjects(prevState.product, currState.product)) {
      this.init(currState.product);

      // this.clearViewSync();

      this.setProductElements(currState.blockCount, currState.blocks);
    }

    if (!compareObjects(prevState.blocks, currState.blocks)) {
      const prevCounts = this.getBlocksCount(prevState.blocks);
      const currCounts = this.getBlocksCount(currState.blocks);

      this.toggleSelected(prevState.blocks, currState.blocks);

      const newBlocks = this.setBlocksValue(prevState.blocks, currState.blocks);

      if (Studio.orderInfo && Studio.orderInfo.status === 'active'
        && prevCounts !== currCounts
        && prevCounts !== 0) {
        const currVariant = Studio.cart.items.find(item => {
          if (typeof currState.product.shopify_id === 'number') {
            return item.product_id === currState.product.shopify_id
              && item.properties.project_id == Studio.projectId;
          }

          return currState.product.shopify_id.includes(item.product_id)
            && item.properties.project_id == Studio.projectId;
        });

        const newQuantity = currVariant.quantity + (currCounts - prevCounts);

        this.setCurrentCartQuantity(currVariant.key, newQuantity)
          .then(_ => {
            Studio.getCart();
          })
      }

      if (newBlocks) {
        this.setProductElements(null, newBlocks);
      } else {
        this.setProductElements(null, currState.blocks);
      }
    }
    
    if (currState.product && prevState.blockCount !== currState.blockCount) {
    }

    if (currState.imagesToDownload && !compareObjects(currState.imagesToDownload, prevState.imagesToDownload)) {      
      this.setImages(currState);

      Studio.utils.change({
        imagesToDownload: null
      }, 'reset images to download')
    }
  }

  setImages({ blocks, imagesToDownload }) {
    const changedBlocks = [];

    imagesToDownload
      .forEach(({ pictureIds, imageUrl }) => {
        pictureIds.forEach(pictureId => {
          const picture = this.querySelector(StudioView.selectors.childBlockById(pictureId));
          if (picture) {
            picture.setImage(imageUrl);
          }

          const newBlock = blocks.find(block => block.childBlocks.some(child => child.id === pictureId));

          if (newBlock) {
            const ifChangedBlock = changedBlocks.find(block => block.id === newBlock.id);

            if (ifChangedBlock) {
              const newChilds = ifChangedBlock.childBlocks.map(child => {
                if (pictureIds.includes(child.id)) {
                  return {
                    ...child,
                    imageUrl
                  }
                }
  
                return child
              });

              const index = changedBlocks.indexOf(ifChangedBlock);

              changedBlocks[index] = {
                ...ifChangedBlock,
                childBlocks: newChilds
              }
            } else {
              const newChilds = newBlock.childBlocks.map(child => {
                if (pictureIds.includes(child.id)) {
                  return {
                    ...child,
                    imageUrl
                  }
                }
  
                return child
              });
  
              changedBlocks.push({
                ...newBlock,
                childBlocks: newChilds
              });
            }
          }
        })
      });

    const newBlocks = blocks
      .map(block => {
        const findedBlock = changedBlocks.find(finded => finded.id === block.id);

        if (findedBlock) {
          return findedBlock;
        }

        return block;
      });

    Studio.utils.change({ view: {
      ...this.state,
      blocks: newBlocks
    }}, 'set images');
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

    this.initEventListeners();

    if (product.quantity.type === 'multiply') {
      this.addBlockBtn.create();
    } else {
      this.addBlockBtn.remove();
    }

    this.inited = true;
  }

  eventSelectedBulk(event) {
    const blocks = JSON.parse(this.getAttribute('state')).blocks;

    const allBlocksElements = Array.from(this.querySelectorAll(StudioView.selectors.studioBlock));
    const allChildElements = Array.from(this.querySelectorAll(StudioView.selectors.childBlock));

    const selectedBlocksElements = allBlocksElements.filter(block => {
      const blockElem = block.querySelector(StudioView.selectors.block);

      if (this.lastSelected) {
        return blockElem.classList.contains('is-selected') && blockElem.getAttribute('block') !== this.lastSelected.id;
      }

      return blockElem.classList.contains('is-selected');
    });

    const selectedChildElements = allChildElements.filter(child => child.classList.contains('is-selected'));

    const noBlocksClicked = allBlocksElements.every(block => !block.contains(event.target));
    const noChildClicked = allChildElements.every(child => child !== event.target && !child.contains(event.target));

    const toDeselectBlockGroup = (!selectedBlocksElements.every(block => block.contains(event.target))
      && !event.shiftKey && noChildClicked);

    const toDeselectChildGroup = (!selectedChildElements.every(child => child.contains(event.target))
      && !event.shiftKey);

    if ((toDeselectBlockGroup && !toDeselectChildGroup)) {
      const newBlocks = blocks
        .map(newBlock => {
          if (this.lastSelected && newBlock.id !== this.lastSelected.id) {
            const newChildren = newBlock.childBlocks
            .map(child => ({ ...child, selected: false }));

            return {
              ...newBlock,
              selected: false,
              activeChild: false,
              childBlocks: newChildren
            }
          }
          
          return {
            ...newBlock
          }
        });

      Studio.utils.change({
        view: {
          ...JSON.parse(this.getAttribute('state')),
          blocks: newBlocks
        }
      }, 'set block value')
    } else if ((toDeselectChildGroup && !toDeselectBlockGroup)) {
      const newBlocks = blocks
        .map(newBlock => {
          const newChildren = newBlock.childBlocks
            .map(child => {
              if (this.lastSelectedChild && child.id !== this.lastSelectedChild.id) {
                return {
                  ...child,
                  selected: false
                }
              }

              return child;
            });
          
          const isActiveChild = newChildren.some(child => child.selected);

          return {
            ...newBlock,
            childBlocks: newChildren,
            selected: false,
            activeChild: isActiveChild
          }
        });

      Studio.utils.change({
        view: {
          ...JSON.parse(this.getAttribute('state')),
          blocks: newBlocks
        }
      }, 'set block value')
    } else if (toDeselectBlockGroup || (!noChildClicked && noBlocksClicked)) {
      const newBlocks = blocks
        .map(newBlock => {
          const newChildren = newBlock.childBlocks
            .map(child => {
              if (this.lastSelectedChild && child.id !== this.lastSelectedChild.id) {
                return {
                  ...child,
                  selected: false
                }
              }

              return child;
            });
          
          const isActiveChild = newChildren.some(child => child.selected);

          return {
            ...newBlock,
            childBlocks: newChildren,
            selected: false,
            activeChild: isActiveChild
          }
        });

      Studio.utils.change({
        view: {
          ...JSON.parse(this.getAttribute('state')),
          blocks: newBlocks
        }
      }, 'set block value')
    } else if (noBlocksClicked && noChildClicked) {
      if (this.lastSelected) {
        const newBlocks = blocks
          .map(newBlock => {
            if (this.lastSelected && newBlock.id !== this.lastSelected.id) {
              const newChildren = newBlock.childBlocks
              .map(child => ({ ...child, selected: false }));

              return {
                ...newBlock,
                selected: false,
                activeChild: false,
                childBlocks: newChildren
              }
            }
            
            return {
              ...newBlock
            }
          });

        Studio.utils.change({
          view: {
            ...JSON.parse(this.getAttribute('state')),
            blocks: newBlocks
          }
        }, 'set block value')
      } else if (this.lastSelectedChild) {
          const newBlocks = blocks
            .map(newBlock => {
              const newChildren = newBlock.childBlocks
                .map(child => {
                  if (this.lastSelectedChild && child.id !== this.lastSelectedChild.id) {
                    return {
                      ...child,
                      selected: false
                    }
                  }

                  return child;
                });
              
              const isActiveChild = newChildren.some(child => child.selected);

              return {
                ...newBlock,
                childBlocks: newChildren,
                selected: false,
                activeChild: isActiveChild
              }
            });

        Studio.utils.change({
          view: {
            ...JSON.parse(this.getAttribute('state')),
            blocks: newBlocks
          }
        }, 'set block value')
      }
    }
  }

  toggleSelected(prevBlocks, currBlocks) {
    const selectedBlocks = prevBlocks.filter(block => block.selected || block.activeChild);
    const toSelectBlocks = currBlocks.filter(block => block.selected || block.activeChild);

    const isActiveChild = currBlocks.some(block => block.childBlocks.some(child => child.selected));

    selectedBlocks
      .forEach(selectedBlock => {
        const selected = this.querySelector(
          StudioView.selectors.blockById(selectedBlock.id)
        );

        const currStateThisBlock = toSelectBlocks.find(block => block.id === selectedBlock.id);

        if (selected) {
          if (!currStateThisBlock || (currStateThisBlock && !currStateThisBlock.selected && !currStateThisBlock.activeChild)) {
            selected.unselect();
          }
    
          if (selectedBlock.activeChild && !selectedBlock.selected) {
            const childJSON = selectedBlock.childBlocks.find(child => child.selected);

            if (childJSON) {
              const child = this.querySelector(StudioView.selectors.childBlockById(childJSON.id));

              const currStateThisChild = currStateThisBlock
                ? currStateThisBlock.childBlocks.find(tiny => tiny.id === childJSON.id)
                : null;

              const toUnselect = !currStateThisChild || (
                currStateThisChild && !currStateThisChild.selected
              );

              if (child && toUnselect) {
                child.unselect();
              }
            }
          }
        }
      });

    toSelectBlocks
      .forEach(toSelectBlock => {
        const toSelect = this.querySelector(
          StudioView.selectors.blockById(toSelectBlock.id)
        );
    
        if (toSelect) {
          if (!(isActiveChild && !toSelect.activeChild)) {
            toSelect.select();
          }

    
          if (toSelectBlock.activeChild && !toSelectBlock.selected) {
            const childrenJSON = toSelectBlock.childBlocks.filter(child => child.selected);

            childrenJSON.forEach(childJSON => {
              const child = this.querySelector(StudioView.selectors.childBlockById(childJSON.id));
    
              if (child) {
                child.select();
              }
            })
          }
        }
      })
  }

  setBlocksValue(prevBlocks, currBlocks) {
    const initiateNewChildren = (element, selectedChildrenIds, prevChildrens) => {
      if (!element) {
        return;
      }

      return [...element.querySelectorAll(StudioView.selectors.childBlock)]
        .map(child => {
          const childID = child.getAttribute('child-block');

          const currBlock = currBlocks.find(block => block.id === element.getAttribute('block'))

          if (currBlock) {
            const currChild = currBlock.childBlocks.find(child => child.id === childID);

            if (currChild) {
              return currChild;
            }
          }

          return this.getChildJSON(child, selectedChildrenIds.includes(childID));
        });
    }

    const countPerBlock = this.getBlocksCount(currBlocks);

    const disableDecreaseButton = countPerBlock <= Studio.product.quantity.minimum;
    const disableIncreaseButton = countPerBlock >= Studio.product.quantity.maximum;

    const newBlocks = currBlocks
      .map(block => {
        const element = this.querySelector(StudioView.selectors.blockById(block.id));
        const elementControls = this.querySelector(StudioView.selectors.blockControlsById(block.id));

        if (elementControls && elementControls.isQuantitative()) {
          elementControls.setValue(block.count);

          elementControls.setStateDecreaseBtn(disableDecreaseButton);
          elementControls.setStateIncreaseBtn(disableIncreaseButton);
        }

        let prevSettings = {};

        const selectedChildrenIds = block.childBlocks
          .filter(child => child.selected)
          .map(child => child.id);

        const prevBlock = prevBlocks.find(prevB => prevB.id === block.id);
        
        if (prevBlock) {
          prevSettings = prevBlock.settings;
        }

        let children = null;

        if (!compareObjects(prevSettings, block.settings) && element) {
          element.setValue(block.settings, block);
        }

        if (block.settings.layout && !compareObjects(prevSettings, block.settings)) {
          children = layouts[block.settings.layout.layout].blocks
            .map((child, idx) => this.getChildsJSON(child, undefined, block.childBlocks));
        }

        return {
          ...block,
          childBlocks: children ? children : block.childBlocks
        };
      });

    const prevChildren = prevBlocks.map(block => block.childBlocks);
    const currChildren = newBlocks.map(block => block.childBlocks);

    let returnedBlocks;

    if (!compareObjects(prevChildren, currChildren)) {
      returnedBlocks = this.setChildsValue(prevChildren, currChildren, newBlocks);
    } else {
      returnedBlocks = newBlocks;
      Studio.utils.change({
        view: {
          ...JSON.parse(this.getAttribute('state')),
          blocks: newBlocks
        }
      }, 'set block value')
    }

    const prevSelected = prevBlocks.filter(block => block.selected || block.activeChild).map(block => block.id);
    const currSelected = newBlocks.filter(block => block.selected || block.activeChild).map(block => block.id);

    const prevChildsSelected = prevBlocks
      .filter(block => block.activeChild)
      .map(block => block.childBlocks
        .filter(child => child.selected)
        .map(child => child.id)
      )
      .reduce((arr, childArr) => [...arr, ...childArr], []);

    const currChildsSelected = newBlocks
      .filter(block => block.activeChild)
      .map(block => block.childBlocks
        .filter(child => child.selected)
        .map(child => child.id)
      )
      .reduce((arr, childArr) => [...arr, ...childArr], []);

    const allowToSave = currSelected.every(block => prevSelected.includes(block)) && currChildsSelected.every(child => prevChildsSelected.includes(child));

    if (allowToSave) {
      clearTimeout(window.Savetimer);
      window.Savetimer = setTimeout(() => {
        Studio.utils.history.save();
      }, 10);
    }

    return returnedBlocks;
  }

  setChildsValue(prevChildren, currChildren, currBlocks) {
    const newBlocks = currBlocks
      .map(block => {
        const currBlockChildren = currChildren.find(children => compareObjects(children, block.childBlocks));
        
        const newChildren = currBlockChildren
          .map(child => {
            switch(child.type) {
              case 'text':
                const textElement = this.querySelector(StudioView.selectors.childBlockById(child.id));

                if (textElement) {
                  textElement.setValue(child.settings.text);
                }
                break;
              case 'editable-picture':
                const pictureElement = this.querySelector(StudioView.selectors.childBlockById(child.id));

                if (!pictureElement) {
                  break;
                }

                if (!child.imageUrl && pictureElement && pictureElement.hasImage()) {
                  pictureElement.removeImage();
                } else if (child.imageUrl && pictureElement && !pictureElement.hasImage()) {
                  pictureElement.setImage(child.imageUrl);
                }

                if (pictureElement) {
                  pictureElement.setValue(child.settings);
                }
                break;
            }
          })

        return block
      });

    Studio.utils.change({
      view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocks
      }
    }, 'set block value - from set child value');

    return newBlocks;
  }

  setSelectedBlock(block, activeChild, isBulk) {
    const selectedBlock = this.getBlockJSON(block);

    this.lastSelected = selectedBlock;
    this.lastSelectedChild = null;
    const { blocks } = JSON.parse(this.getAttribute('state'));

    const isBlockSelected = blocks.some(block => block.selected);

    const turnOfChilds = (activeChild ? !activeChild : true) || isBlockSelected;

    const newBlocks = blocks
      .map(sBlock => {
        let isSelected;

        if (isBulk) {
          const blockElement = this.querySelector(StudioView.selectors.blockById(sBlock.id));
          
          if (blockElement) {
            isSelected = blockElement.classList.contains('is-selected');
          }
        }

        if (sBlock.id !== selectedBlock.id) {
          return {
            ...sBlock,
            selected: isBulk ? isSelected : false,
            activeChild: false,
            childBlocks: turnOfChilds
              ? sBlock.childBlocks.map(child => ({ ...child, selected: false }))
              : sBlock.childBlocks
          }
        }

        return {
          ...sBlock,
          selected: !activeChild,
          activeChild: activeChild && isBlockSelected,
          childBlocks: turnOfChilds
              ? sBlock.childBlocks.map(child => ({ ...child, selected: false }))
              : sBlock.childBlocks
        }
      })

    Studio.utils.change({
      view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocks
      }
    }, 'set selected blocks');
  }

  setSelectedChild(child, isBulk) {
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

    this.lastSelectedChild = childJSON;
    this.lastSelected = null;

    const newChildBlocks = blockJSON.childBlocks.map(child => {
      let isSelected;

      if (isBulk) {
        const childElement = this.querySelector(StudioView.selectors.childBlockById(child.id));
        
        if (childElement) {
          isSelected = childElement.classList.contains('is-selected');
        }
      }
      
      if (child.id === childID) {
        return {
          ...childJSON,
          selected: true
        }
      }

      if (isBulk) {
        return child
      } else {
        return {
          ...child,
          selected: false
        }
      }
    })

    const isActiveChild = newChildBlocks.some(children => children.selected);

    const newBlock = {
      ...blockJSON,
      selected: !isActiveChild,
      activeChild: isActiveChild,
      childBlocks: newChildBlocks
    }

    const newBlocksList = blocks
      .map(block => {
        if (block.id === newBlock.id) {
          return newBlock
        }

        const newChildren = isBulk
          ? block.childBlocks
          : block.childBlocks
            .map(child => ({ ...child, selected: false }));

        const isActiveChild = newChildren.some(child => child.selected);

        const blockWithNoActiveChild = {
          ...block,
          selected: false,
          activeChild: isActiveChild,
          childBlocks: newChildren
        }

        return blockWithNoActiveChild
      });

    Studio.utils.change({
      view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocksList
      }
    }, 'set selected child')
  }

  initEventListeners() {
  }

  createStudioBlock(type, id) {
    const block = document.createElement('div');
    block.style.opacity = 0;

    block.classList.add('studio-view__block');

    if (id) {
      block.setAttribute('data-studio-block', id);
    } else {
      block.toggleAttribute('data-studio-block');
    }

    switch(type) {
      case 'photobook-page':
        block.classList.add('block__photobook-page');
        break;
    }

    block.addEventListener('DOMNodeInserted', () => {
      setTimeout(() => {
        block.style.opacity = null;
      }, 10);
    }, false);

    return block
  }

  createDefaultProductElement() {
    const block = this.createStudioBlock();

    const productElement = document.createElement('product-element');
    productElement.classList.add('product-builder__element', 'product-element', 'is-default');
    productElement.setAttribute('quantity', 1);

    this.blockClickedListener(productElement);

    block.append(productElement);

    const elementControls = ProductControls.createBlockControls(productElement.getAttribute('block'));

    block.append(elementControls);

    this.elements.container.appendChild(block);
  }

  createPhotobookPage(block) {
    const studioBlock = this.createStudioBlock('photobook-page');
    const { id, type, settings } = block;

    const page = document.createElement('photobook-page');
    page.classList.add('photobook-page', 'product-builder__element');
    page.setAttribute('photobook-page', block.settings.layout.layout);

    page.setAttribute('block', id);
    page.setAttribute('block-type', type);
    
    this.blockClickedListener(page);

    page.setValue(settings, block);

    studioBlock.append(page);

    this.elements.container.append(studioBlock);
  }

  createPrint(block) {
    const { id, type, settings } = block;

    const studioBlock = this.createStudioBlock('product-prints');

    const print = document.createElement('product-prints');
    
    this.blockClickedListener(print);

    const { width, height } = Studio.product.resolution;

    print.setAttribute('print-type', `${width}-${height}`);

    print.setAttribute('block', id);
    print.setAttribute('block-type', type);
    
    print.setValue(settings, block);
    
    studioBlock.append(print);
    
    this.elements.container.append(studioBlock);
  }

  createCanvas(block, productHandle) {
    const { id, type, settings } = block;
    const studioBlock = this.createStudioBlock('product-canvas');

    const canvas = document.createElement('product-canvas');
    
    this.blockClickedListener(canvas);

    const canvasType = Canvas.printTypes.find(type => productHandle.includes(type));

    if (type) {
      canvas.setAttribute('print-type', canvasType);
    }

    canvas.setAttribute('block', id);
    canvas.setAttribute('block-type', type);

    canvas.setValue(settings, block);
    
    studioBlock.append(canvas);
    
    this.elements.container.append(studioBlock);
  }

  createPolaroidPrints(block) {
    const { id, type, settings } = block;

    const studioBlock = this.createStudioBlock('polaroid-prints');

    const polaroid = document.createElement('polaroid-prints');

    polaroid.setAttribute('block', id);
    polaroid.setAttribute('block-type', type);

    this.blockClickedListener(polaroid);
    polaroid.setValue(settings, block);
    
    studioBlock.append(polaroid);
    this.elements.container.append(studioBlock);    
    

    const children = polaroid.querySelectorAll(StudioView.selectors.childBlock);

    children.forEach(child => {
      const childJSON = block.childBlocks.find(fChildJSON => fChildJSON.id === child.getAttribute('child-block'));

      if (childJSON) {
        const { imageUrl, settings } = childJSON;

        if (imageUrl) {
          child.setImage(imageUrl);
        }

        if (settings) {
          child.setValue(childJSON.settings);
        }
      }
    })
  }

  createPuzzle(block, productHandle) {
    const { id, type, settings } = block;

    const studioBlock = this.createStudioBlock('product-puzzle');

    const puzzle = document.createElement('product-puzzle');
    
    this.blockClickedListener(puzzle);

    if (productHandle) {
      const puzzleType = Puzzle.types.find(type => productHandle.includes(type));

      puzzle.setAttribute('puzzle-type', puzzleType);
    }

    puzzle.setAttribute('block', id);
    puzzle.setAttribute('block-type', type);
    
    puzzle.setValue(settings,block);
    
    studioBlock.append(puzzle);
    
    this.elements.container.append(studioBlock);
  }

  createMagnets(block, productHandle) {
    const { id, type, settings } = block;
    const studioBlock = this.createStudioBlock('product-magnet');

    const magnet = document.createElement('product-magnet');

    this.blockClickedListener(magnet);

    studioBlock.append(magnet);

    const MagnetType = productHandle.includes('heart')
      ? 'heart'
      : productHandle.includes('circle')
        ? 'circle'
        : 'square';

    magnet.setAttribute('magnet-type', MagnetType);

    magnet.setAttribute('block', id);
    magnet.setAttribute('block-type', type);

    magnet.setValue(settings, block);
    
    this.elements.container.append(studioBlock);
  }

  createTiles(block) {
    const { id, type, settings } = block;
    const studioBlock = this.createStudioBlock('product-tile');

    const tile = document.createElement('product-tiles');

    this.blockClickedListener(tile);

    studioBlock.append(tile);

    tile.setAttribute('block', id);
    tile.setAttribute('block-type', type);

    // console.log(block);

    tile.setValue(settings, block);
    
    this.elements.container.append(studioBlock);
  }

  blockClickedListener(element, callback) {
    if (!element) {
      return;
    }

    element.addEventListener('click', (event) => {
      const childs = [...element.querySelectorAll(StudioView.selectors.childBlock)];

      const someIsChild = childs.includes(event.target)
        || childs.some(child => child.contains(event.target));

      if (!someIsChild) {
        this.setSelectedBlock(element, someIsChild, event.shiftKey);
      }
    });

    if (callback) {
      element.addEventListener('click', callback);
    }
  }

  clearViewSync(size, toRemove) {
    if (!this.elements || !this.elements.container) {
      return;
    }

    const blocks =  this.elements.container.querySelectorAll(StudioView.selectors.studioBlock);

    if (!size && toRemove && Array.isArray(toRemove)) {
      toRemove
        .map(id => this.querySelector(StudioView.selectors.blockById(id)).parentElement)
        .forEach(block => {
          if (block) {
            block.remove();
          }
        });

      return Boolean(toRemove.length);
    }

    if (!size) {
      blocks.forEach(block => block.remove());
    } else {
      const newBlocks = blocks
        .forEach((block, idx) => {
          if (idx >= size) {
            block.remove();
          }
        })
    }
  }

  clearView(size) {
    const blocks =  this.elements.container.querySelectorAll(StudioView.selectors.studioBlock);

    if (!size) {
      return new Promise((res, rej) => {
        if (blocks.length === 0) {
          res();
        }

        blocks
          .forEach((item, idx) => {
            item.style.opacity = 0;

            setTimeout(() => {
              item.remove();

              if (idx === blocks.length - 1) {
                res();
              }
            }, 300);
          })
      });
    }

    return new Promise((res, rej) => {
      if (blocks.length === 0) {
        res();
      }

      blocks
        .forEach((item, idx) => {
          if (idx >= size) {
            item.style.opacity = 0;
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

  getBlocksJSON() {
    const product = Studio.product;

    let type;
    let childList;

    const childOptions = {};

    switch (product.type.id) {
      case 'photobook':
        type = 'photobook-page';
        childList = layouts.whole.blocks;
        break;
      case 'prints':
        if (product.handle.includes('polaroid') || product.handle.includes('retro')) {
          type = 'polaroid';
          childList = ['editable-picture', 'text'];
          childOptions.isLine = true;
        } else {
          type = 'prints'
          childList = ['editable-picture'];
        }
        break;
      case 'puzzle':
        type = 'puzzle';
        childList = ['editable-picture'];
        break;
      case 'canvas':
        type = 'canvas';
        childList = ['editable-picture'];
        break;
      case 'magnets':
        type = 'magnet';
        childList = ['editable-picture'];
        break;
      case 'boxes':
        if (product.handle.includes('polaroid') || product.handle.includes('retro')) {
          type = 'polaroid';
          childList = ['editable-picture', 'text'];
        } else {
          type = 'prints';
          childList = ['editable-picture'];
        }
        break;
      case 'tiles':
        type = 'tiles';
        childList = ['editable-picture'];
        break;
      default:
        type = 'default-product'
        childList = ['editable-picture'];
        break;
    }

    const { settings } = Studio.product;

    const blockSettings = Object.keys(settings)
      .reduce((obj, tool) => {
        switch(tool) {
          case 'hasLayout':
            if (settings[tool]) {
              obj.layout = LayoutTool.defaultValue;
            }
            break;
          case 'hasBackground':
            if (settings[tool]) {
              obj.backgroundColor = BackgroundColorTool.defaultValue;
            }
            break;
          case 'hasFrame':
            if (settings[tool]) {
              obj.frame = FrameTool.defaultValue
            }
            break;
        }

        return obj;
      }, {});

    const childrenJSON = childList
      .map(child => this.getChildsJSON(child, childOptions));

    return {
      id: uniqueID.block(),
      type,
      count: 1,
      selected: false,
      activeChild: false,
      settings: blockSettings,
      childBlocks: [
        ...childrenJSON
      ]
    };
  }

  getChildsJSON(type, options = {}) {
    const id = uniqueID.childBlock();

    const { isLine = false } = options;

    const resolution = !Studio.product.settings.hasLayout && !Studio.product.type.id !== 'tiles'
      ? getResolution(Studio.product.resolution.width, Studio.product.resolution.height)
      : {};

    switch (type) {
      case 'editable-picture':
        return {
          type,
          id,
          selected: false,
          tools: EditablePicture.ToolsList,
          settings: EditablePicture.defaultValue,
          resolution
        }
      case 'text':
        return {
          type,
          id,
          isLine: isLine,
          selected: false,
          tools: EditableText.ToolList,
          settings: EditableText.defaultValue
        }
      case 'line':
        return {
          type,
          id,
          isLine: true,
          selected: false,
          tools: EditableText.ToolList,
          settings: EditableText.defaultValue
        }
      default:
        return {
          type: 'default',
          id,
          settings: {}
        }
    }
  }

  setProductElements(
    size,
    blocks,
    options = { clearAll: false, initBefore: false }
  ) {
    const { product } = JSON.parse(this.getAttribute('state'));

    if (!product) {
      return;
    }

    const productHandle = product.handle;

    const waitToClear = [];

    const createBlock = (block) => {

      switch(block.type) {
        case 'photobook-page':
          this.createPhotobookPage(block);
          break;
        case 'prints':
          this.createPrint(block, productHandle);
          break;
        case 'polaroid':
          this.createPolaroidPrints(block);
          break;
        case 'puzzle':
          this.createPuzzle(block, productHandle);
          break;
        case 'canvas':
          this.createCanvas(block, productHandle);
          break;
        case 'magnet':
          this.createMagnets(block, productHandle);
          break;
        case 'boxes':
          if (product.handle.includes('polaroid')) {
            this.createPolaroidPrints();
          } else if (product.handle.includes('10-15')) {
            this.createPrint(block, '10-15');
          }
          break;
        case 'tiles':
          this.createTiles(block);
          break;
        default:
          this.createDefaultProductElement();
          break;
      }
    }

    let toUpdate = false, newBlocks = [ ...blocks ];

    const blockElements = [...this.querySelectorAll(StudioView.selectors.block)];
    
    const elemsToRemove = blockElements
      .filter(elem => {
        const blockJSON = newBlocks.find(block => block.id === elem.getAttribute('block'));

        return (
          !blockJSON
          || (blockJSON && !blockJSON.count)
        );
      })
      .map(elem => elem.getAttribute('block'));

    this.clearViewSync(null, elemsToRemove);

    if (!options.clearAll && size) {
      if (size > newBlocks.length) {
        toUpdate = true;

        for (let i = 0; i < size; i++) {
          newBlocks.push(this.getBlocksJSON());
        }
      } 
    } else if (options.clearAll) {
      toUpdate = true;

      this.clearViewSync();
      // waitToClear.push(this.clearView());

      for (let i = 0; i < size; i++) {
        newBlocks.push(this.getBlocksJSON());
      }
    }

    const blocksToCreate = newBlocks.filter(block => !blockElements.some(elem => {
      return elem.getAttribute('block') === block.id;
    }));

    
    newBlocks = newBlocks.filter(block => !elemsToRemove.includes(block.id));
    
    if (blocksToCreate !== 0) {
      toUpdate = true;
    }
    // console.log(newBlocks, toUpdate);

    if (!toUpdate) {
      return;
    }

    blocksToCreate.forEach(block => createBlock(block));

    const block = this.querySelector(StudioView.selectors.block);

    if (block) {
      const { offsetHeight, offsetWidth } = block;
      const { offsetWidth: controlsWidth } = this.querySelector(StudioView.selectors.blockControls);

      this.addBlockBtn.setSize(offsetWidth > controlsWidth ? offsetWidth : controlsWidth, offsetHeight);
    }

      Studio.utils.change({ view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocks
      }}, 'set product elements');

    Promise.all(waitToClear).then(_ => {
      // do something on async block delete
    });
  }

  getBlockJSON(block, state) {
    const id = block.getAttribute('block');

    if (state && id === state.id) {
      return state;
    }

    const childBlocks = [...block.querySelectorAll(StudioView.selectors.childBlock)];

    const { settings } = Studio.product;

    const { tools } = Studio.state.panel;

    const blockSettings = Object.keys(settings)
      .reduce((obj, tool) => {
        switch(tool) {
          case 'hasLayout':
            if (settings[tool]) {
              obj.layout = LayoutTool.defaultValue;
            }
            break;
          case 'hasBackground':
            if (settings[tool]) {
              obj.backgroundColor = BackgroundColorTool.defaultValue;
            }
            break;
          case 'hasFrame':
            if (settings[tool]) {
              obj.frame = FrameTool.defaultValue
            }
            break;
        }

        return obj;
      }, {});

    const childrenJSON = childBlocks
      .map(child => this.getChildJSON(child));

    const blockJSON = {
      id,
      type: block.getAttribute('block-type'),
      selected: block.classList.contains('is-selected'),
      activeChild: childrenJSON.some(child => child.selected),
      childBlocks: [
        ...childrenJSON
      ],
      settings: blockSettings,
      count: 1
    }

    return blockJSON
  }

  getChildJSON(child, isSelected = false) {
    const key = child.getAttribute('child-block');
    const type = child.hasAttribute('editable-picture') ? 'editable-picture' : 'text';

    if (type === 'editable-picture') {
      return {
        type,
        id: key,
        selected: isSelected,
        tools: child.getToolsList(),
        settings: child.getValue()
      }
    } else if (type === 'text') {
      return {
        type,
        id: key,
        isLine: child.hasAttribute('line'),
        selected: isSelected,
        tools: child.getToolsList(),
        settings: child.getValue()
      }
    }

    return {
      type,
      id: key,
      selected: isSelected,
      tools: child.getToolsList(),
      settings: child.getValue()
    }
  }

  getImages() {
    return [...this.querySelectorAll('.editable-picture__image')]
      .map(img => img.src);
  }

  getBlocksCount(blocks) {
    return blocks.reduce((count, block) => count + block.count, 0);
  }

  initAddBlockBtn() {
    const container = document.createElement('div');
    container.classList.add('studio-view__button-add-wrapper');

    const button = document.createElement('button');
    button.classList.add('studio-view__button-add');

    container.style.paddingTop = '20px';

    const icon = `
      <svg xmlns="http://www.w3.org/2000/svg" width="91" height="91" fill="none"><path fill="#FFD9D9" fill-rule="evenodd" d="M45.5 91a45.5 45.5 0 1 0 0-91 45.5 45.5 0 0 0 0 91Zm0-10a35.5 35.5 0 1 0 0-71 35.5 35.5 0 0 0 0 71Z" clip-rule="evenodd"/><path fill="#FFD9D9" d="M40 22h10v47H40z"/><path fill="#FFD9D9" d="M22 50v-9h48v9z"/></svg>
    `;

    button.toggleAttribute('data-add-block');
    container.style.order = '1';

    button.innerHTML = icon;

    const addBlockCallback = this.addBlock.bind(this);

    container.append(button);

    return {
      container: container,
      create: () => {
        this.elements.container.append(container);
        button.addEventListener('click', addBlockCallback);
      },
      remove: () => {
        container.remove();
        button.removeEventListener('click', addBlockCallback);
      },
      setSize: (width, height) => {
        if (!width) {
          return;
        }

        if (width) {
          container.style.width = width + 'px';
        }

        if (height) {
          container.style.height = height + 'px';
        } else if (width) {
          container.style.height = width + 'px';
        } 
      }
    }
  }

  addBlock() {
    const currCount = this.getBlocksCount(Studio.state.view.blocks);

    if (currCount >= Studio.state.product.quantity.maximum) {
      return;
    }

    const newBlock = this.getBlocksJSON();

    Studio.utils.change({
      view: {
        ...Studio.state.view,
        blocks: [ ...Studio.state.view.blocks, newBlock ]
      }
    }, 'block add');
  }

  async setCurrentCartQuantity(key, quantity) {
    return fetch(location.origin + '/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'id': key,
        'quantity': quantity
      })
    }).then(res => res.json());
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
      size: productParams.get('size'),
      'project-id': productParams.get('project-id')
    }

    localStorage.setItem('instToRedirect', JSON.stringify(instToRedirect));

    const state = JSON.stringify({
      shop: location.origin,
      customerId: window.customerId
    });

    const url = `https://api.instagram.com/oauth/authorize?client_id=${223768276958680}&redirect_uri=${baseURL}/api/instagram/oauth&scope=user_profile,user_media&response_type=code&state=${state}`;

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
              .forEach(photo => {
                this.imageList.append(this.imageTemplate(photo))
              });
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

class RelatedProducts extends HTMLElement {
  static selectors = {
    exitBtn: '[data-exit]',
    productImage: '[data-related-product-image]',
    productsList: '[data-related-products-list]',
    checkoutBtn: '[data-checkout]',
    relatedProduct: '[data-related-product]'
  }

  static get  observedAttributes() {
    return ['state']
  }

  constructor() {
    super();

    this.elements = {
      exitBtn: this.querySelector(RelatedProducts.selectors.exitBtn),
      productImage: this.querySelector(RelatedProducts.selectors.productImage),
      productsList: this.querySelector(RelatedProducts.selectors.productsList),
      checkoutButton: this.querySelector(RelatedProducts.selectors.checkoutBtn)
    };

    if (this.getAttribute('state') === 'open') {
      subscribeToActionController({
        target: this,
        opener: null,
        callback: () => {
          this.close()
        }
      })
    }

    this.elements.exitBtn.addEventListener('click', this.close.bind(this));

  }

  open(toSubscribe = true) {
    this.setAttribute('state', 'open');

    this.style.opacity = 0;

    setTimeout(() => {
      this.style.opacity = 1;
      this.relatedProductsElems.forEach(elem => elem.setButtonWidth());
    }, 10);

    setTimeout(() => {
      this.style.opacity = null;
    }, 300);

    if (toSubscribe) {
      subscribeToActionController({
        target: this,
        opener: checkoutButton,
        callback: callback || (() => {
          this.close()
        })
      })
    }
  }

  close() {
    this.style.opacity = 0;

    setTimeout(() => {
      this.setAttribute('state', 'close');
    }, 300);
  }

  setImage(imageUrl) {
    if (typeof imageUrl !== 'string') {
      return;
    }

    this.elements.productImage.src = imageUrl;
  }

  async init() {
    const { product } = Studio.state;

    if (this.relatedProductsElems) {
      this.relatedProductsElems.forEach(elem => elem.remove());
    }

    this.setImage(product.imageUrl);

    this.relatedProducts = product.relatedProducts;

    this.initRelatedProducts();
  }

  initRelatedProducts() {
    this.relatedProductsElems = this.relatedProducts
      .map(product => this.productTemplate(product));
  }

  productTemplate(product) {
    const { handle, id, image, options, priceRangeV2, title } = product;

    const added = 'Added!';

    const container = document.createElement('div');
    container.classList.add('related-products__product', 'related-product');
    container.setAttribute('data-product-id', id);
    container.toggleAttribute('data-related-product');

    if (options.length === 1) {
      container.setAttribute('data-variant', options[0]);
    }

    const titleElem = document.createElement('div');
    titleElem.classList.add('related-product__title');
    titleElem.textContent = title;

    const description = document.createElement('div');
    description.classList.add('text', 'related-product__description');
    description.textContent = `Before leaving, would you like to find this creation in your account to edit and order later?`;

    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add('related-product__content');
    contentWrapper.append(titleElem, description);

    const addButton = document.createElement('button');
    const buttonText = document.createElement('span');

    const price = moneyFormat(priceRangeV2.minVariantPrice.amount, 'USD');

    addButton.classList.add('button', 'button--primary-action', 'related-product__add-btn');
    addButton.append(buttonText);

    container.append(contentWrapper, addButton);
    
    const select = () => {
      container.classList.add('is-selected');
    };

    const unselect = () => {
      container.classList.remove('is-selected');
    }

    const toggle = () => {
      container.classList.toggle('is-selected');

      if (container.classList.contains('is-selected')) {
        buttonText.textContent = added;
      } else {
        buttonText.textContent = price;
      }
    }

    const setButtonWidth = () => {
      buttonText.textContent = added;
      const addedLength = buttonText.scrollWidth;

      buttonText.textContent = price;
      const priceLength = buttonText.scrollWidth;

      buttonText.style.width = `${Math.max(addedLength, priceLength)}px`;

      if (container.classList.contains('is-selected')) {
        buttonText.textContent = added;
      }
    }

    const initVariants = async () => {
      const url = baseURL + `/product-builder/shopify/product/${id.split('/').pop()}/variants?shop=${window.shop}`;

      const product = await fetch(url)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            return data;
          }

          const variants = data.variants.edges
            .map(variant => variant.node)

          return {
            ...data,
            variants
          }
        });

      const { variants } = product;

      const currentVariantId = variants[0].id;

      container.setAttribute(
        'data-variant', 
        String(currentVariantId).startsWith('gid://') 
          ? currentVariantId.split('/').pop()
          : currentVariantId
        )
    }

    addButton.addEventListener('click', toggle);

    this.elements.productsList.append(container);
    setButtonWidth();

    initVariants();

    return {
      container,
      select,
      unselect,
      toggle,
      setButtonWidth,
      remove: container.remove.bind(container)
    };
  }

  getRelatedProducts() {
    return new Promise((resolve, reject) => {
      this.open(false);

      subscribeToActionController({
        target: this,
        opener: checkoutButton,
        callback: () => {
          reject({ rejected: true });
          this.close();
        }
      })

      this.elements.checkoutButton.addEventListener('click', () => {
        const relatedProducts = [...document.querySelectorAll(RelatedProducts.selectors.relatedProduct)]
          .filter(elem => elem.classList.contains('is-selected'))
          .map(elem => ({
            id: elem.getAttribute('data-variant'),
            quantity: 1,
            properties: {
              'related-project': Studio.projectId || ''
            }
          }))

        resolve(relatedProducts);
        this.close();
      });
    })
  }
}
customElements.define('related-products', RelatedProducts);