const backButton = document.querySelector('[data-back-button]');
if (backButton) {
  backButton.addEventListener('click', () => {
    window.history.go(-1);
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

const Caman = window.Caman;

const subscribeToActionController = ActiveActionsController();

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

const DraftImages = [
  'https://hladkevych-dev.myshopify.com/apps/product-builder/uploads/1024%20(1).jpeg',
  'https://hladkevych-dev.myshopify.com/apps/product-builder/uploads/IMG_20220811_202102.jpg'
];

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

    this.state = { ...currState };

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
    }

    if (this.product && !compareObjects(prevState.panel.tools, currState.panel.tools)) {
      const { tools } = currState.panel;

      const { blocks } = currState.view;

      const isSelectedBlocks = blocks.some(block => block.selected);

      if (!isSelectedBlocks) {
        const newBlocks = blocks
          .map(block => {
            if (block.activeChild) {
              const newChildren = block.childBlocks
                .map(child => {
                  if (child.selected) {
                    const { settings } = child;

                    const newSettings = {};

                    for (const tool in settings) {
                      newSettings[tool] = tools[tool].value;
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
  
              for (const tool in settings) {
                newSettings[tool] = tools[tool].value;
              }
  
              return {
                ...block,
                settings: newSettings
              };
            }

            return block;            
          });

        this.studioView.setState({ blocks: newSelectedBlocks });
      }
    }

    if (prevState.panel.blockCount !== currState.panel.blockCount) {
      this.studioView.setState({ blockCount: currState.panel.blockCount });
    }
  }

  onViewChange(prevState, currState) {
    if (this.product && !compareObjects(prevState.view.blocks, currState.view.blocks)) {
      const { blocks } =  currState.view;

      const selectedBlock = blocks.find(block => block.selected);
      const blockWithActiveChild = blocks.find(block => block.activeChild);

      if (!selectedBlock) {
        if (blockWithActiveChild) {
          const selectedChild = blockWithActiveChild.childBlocks.find(child => child.selected);

          if (selectedChild) {
            this.setTools({
              toolsList: selectedChild.tools,
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

      for (const tool in updatedTools) {
        if (childTools.includes(tool)) {
          updatedTools[tool] = {
            ...updatedTools[tool],
            show: false
          }
          continue;
        }

        switch(tool) {
          case 'layout':
            updatedTools[tool] = {
              ...updatedTools[tool],
              show: settings.hasLayout,
              value: selectedSettings[tool]
            }
            break;
          case 'backgroundColor':
              updatedTools[tool] = {
                ...updatedTools[tool],
                show: settings.hasBackground,
                value: selectedSettings[tool]
              }
              break;
        }
      }

      Studio.utils.change({
        panel: {
          ...JSON.parse(Studio.panel.getAttribute('state')),
          tools: updatedTools
        }
      });

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
    });
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

    this.setState({
      ...JSON.parse(this.getAttribute('state')),
      productId: productParams.get('id') || null,
    })

    Promise.all([this.downloadFacebookAPI()]).then(_ => {
      customElements.define('image-chooser', ImageChooser);
    });

    this.customer = customer;

    window.oauthInstagram = JSON.parse(localStorage.getItem('oauthInstagram'));

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
    save: () => {
      if (!utils.history.allowSave) {
        return;
      }
  
      const historyString = localStorage.getItem('product-builder-history');
    
      if (!historyString) {
        localStorage.setItem('product-builder-history', JSON.stringify([Studio.state]));
        return Studio.utils.history.save();
      }
    
      let history = JSON.parse(historyString);
  
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
  
      localStorage.setItem('product-builder-history', JSON.stringify(history));
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
    },
    historyList: () => JSON.parse(localStorage.getItem('product-builder-history')),
    clear: () => {
      const historyString = localStorage.getItem('product-builder-history');
  
      if (historyString) {
        localStorage.removeItem('product-builder-history');
      }
    },
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
      console.log(utils.history.allowSave);
      Studio.utils.rangeActivated = true;
    })

    this.container.addEventListener('mouseup', () => {
      utils.history.allowSave = true;
      Studio.utils.history.save();
      console.log(utils.history.allowSave);
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

      const panelState = JSON.parse(Studio.panel.getAttribute('state'));

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
      });
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
          })
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
    })    
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
    })
  }

  onTextInput() {
    this.text.style.height = (this.text.scrollHeight) + 'px';

    const isLine = Studio.state.view.blocks
      .filter(block => block.selected || block.activeChild)
      .some(block => block.childBlocks.some(child => child.isLine));

    const { value } = this.text;

    if (value.length > 35 && isLine) {
      this.text.value = value.substring(0, 35);
      
      this.text.focus();
      this.text.setSelectionRange(this.text.value.length, this.text.value.length);
    } else if (!isLine && value.length > 300) {
      this.text.value = value.substring(0, 300);
      
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
    })
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
      font: this.values.font
    }
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

      console.log(value);

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
      })
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
      })
    })

    wrapper.append(slider.container, cropValue.container);

    this.collapsible.inner.append(wrapper);
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
      value: '#000',
      whiteFont: true,
    },
    white: {
      label: 'White',
      value: '#fff',
      default: true
    },
    red: {
      label: 'Red',
      value: '#FF2828',
      whiteFont: true,
    },
    orange: {
      label: 'Orange',
      value: '#FFA41C',
      whiteFont: true,
    },
    yellow: {
      label: 'Yellow',
      value: '#FFE81C'
    },
    green: {
      label: 'Green',
      value: '#00FF85'
    },
    blue: {
      label: 'Blue',
      value: '#28A5FF',
      whiteFont: true,
    },
    indigo: {
      label: 'Indigo',
      value: '#0029FF',
      whiteFont: true,
    },
    purple: {
      label: 'Purple',
      value: '#FF28C3',
      whiteFont: true,
    }
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
          })
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

    if (backButton) {
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
}

class FilterTool extends Tool {
  constructor() {
    super();

    this.label.setLabel('Filter');
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


    DraftImages.forEach(imageUrl => {
      const imageTemplate = this.createNewImage(imageUrl);

      if (imageTemplate) {
        imagesWrapper.append(imageTemplate);
      }
    })

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

    console.log(typeof imageFile);

    const image = new Image();
    const imageWrapper = document.createElement('div');
    imageWrapper.classList.add('page__image-wrapper', 'is-loading');
    imageWrapper.toggleAttribute('data-image');

    imageWrapper.addEventListener('click', (event) => {
      const toDeleteBtn = imageWrapper.querySelector('[data-delete]');

      if (event.target !== toDeleteBtn && !toDeleteBtn.contains(event.target)) {
        Studio.utils.change({
          imagesToDownload: image.src
        })
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

    if (typeof imageFile === 'object') {
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
    } else if (typeof imageFile === 'string') {
      image.src = imageFile;

      image.onload = () => {
        imageWrapper.classList.remove('is-loading');
      };

      // this.pages.images.imageList.push(image.src);
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
        filter: new FilterTool()
      }
    }

    const editStateTools = Object.keys(this.edit.tools)
      .reduce((obj, tool) => {
        obj[tool] = {
          show: false,
          value: this.edit.tools[tool].getValue()
        }

        return obj
      }, {})

    Studio.utils.change({ panel: {
      ...JSON.parse(Studio.panel.getAttribute('state')),
      tools: editStateTools
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

  makeMagic() {
    const { blocks } = Studio.state.view;

    const childs = blocks.reduce((arr, block) => {
      const editablePictures = block.childBlocks
        .filter(block => block.type === 'editable-picture' && !block.imageUrl);

      return [...arr, ...editablePictures ];
    }, []);

    const imagesToSet = [...this.pages.images.imageList]
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

      const { hasLayout, hasText } = currState.product.settings;

      this.tools.setToolsState({
        layout: {
          show: hasLayout
        },
        text: {
          show: false
        }
      })
    }

    if (!compareObjects(prevState.tools, currState.tools)) {
      const toSet = Object.keys(currState.tools)
        .reduce((obj, tool) => {
          obj[tool] = {
            ...currState.tools[tool]
          }

          return obj;
        }, {});

      this.tools.setToolsState(toSet)
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

  static selectors = {
    emptyState: '[data-empty-state]'
  }

  constructor() {
    super();

    this.initImage();
  }

  connectedCallback() {
    this.toggleAttribute('editable-picture');

    if (!this.getAttribute('child-block')) {
      this.setAttribute('child-block', window.uniqueID.childBlock());
    }

    this.parentBlock = Array.from(document.querySelectorAll('[block]')).find(block => block.contains(this));

    this.controls = ProductControls.createPictureControls(this.getAttribute('child-block'));
    
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

    this.addEventListener('click', (event) => {
      const isControlsTarget = event.target === this.controls || this.controls.contains(event.target)

      Studio.studioView.setSelectedChild(this);

      if (!this.classList.contains('is-empty') && event.target !== this.emptyState && !this.emptyState.contains(event.target) && !isControlsTarget) {
        Studio.panel.tools.focusOnTab('edit');
      }

      if (this.classList.contains('is-empty')) {
        Studio.panel.tools.focusOnTab('images');
      }
    })
  }


  initImage() {
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

    this.defaultImageUrl = imageUrl;

    this.previewImage = new Image();
    this.previewImage.toggleAttribute('crossOrigin');
    this.previewImage.classList.add('editable-picture__image', 'editable-picture__preview-image');
    this.previewImage.style.opacity = 0;
    this.previewImage.draggable = false;

    this.previewImage.onload = () => {
      console.log(this.previewImage.naturalWidth);
      // this.previewImage.style.width = this.previewImage.naturalWidth + 'px';
      // this.previewImage.style.height = this.previewImage.naturalHeight + 'px'; 
    }

    this.previewImage.src = imageUrl;


    this.image = new Image();
    this.image.classList.add('editable-picture__image');
    this.image.style.opacity = 0;
    this.image.draggable = false;
    this.image.toggleAttribute('crossOrigin');
    
    this.image.onload = () => {
      this.image.style.opacity = null;
    }

    const getParams = () => {
      const size = PhotobookPage.config[this.parentBlock.getAttribute('photobook-size')];

      const widthProcent = Math.round(((this.offsetWidth * 100) / this.parentBlock.offsetWidth))
      const heightProcent = Math.round(((this.offsetHeight * 100) / this.parentBlock.offsetHeight))
      console.log(size);

      const width = Math.ceil(size.width / 100 * widthProcent);
      const height = Math.ceil(size.height / 100 * heightProcent);

      return [width, height];
    };

    const [width, height] = getParams();

    console.log(width, height);
    
    this.image.src = imageUrl + `?resize=[${width},${height}]`;

    this.defaultImageUrl = imageUrl + `?resize=[${width},${height}]`;
    
    this.classList.remove('is-empty');
    this.append(this.previewImage, this.image);
  }

  removeImage() {
    this.image.remove();

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
    const { crop, rotate } = settings;

    if (crop) {
      this.setAttribute('crop', crop.value);
    }

    if (rotate) {
      this.setAttribute('rotate', rotate.value);
    }

    if (this.image && crop && rotate) {
      this.image.style.opacity = 0;
      this.previewImage.style.opacity = null;

      this.previewImage.style.transform = `rotate(${rotate.value}deg) scale(${1 + (crop.value / 50)})`;
    }

    if (this.image && rotate) {
      this.image.onload = () => {
        this.image.style.opacity = 1;

        setTimeout(() => {
          this.previewImage.style.opacity = 0;
        }, 300);
      }

      this.timer = setTimeout(() => {
        this.image.src = `${this.defaultImageUrl}&rotate=${rotate.value}`;
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
      }
    }
  }
}
customElements.define('editable-picture', EditablePicture);

class EditableText extends HTMLElement {
  constructor() {
    super();

    this.editableArea = document.createElement('span');
    // this.editableArea.toggleAttribute('contenteditable');
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

    this.addEventListener('click', () => {
      Studio.studioView.setSelectedChild(this);
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
          mutation.target.textContent = textContent.substring(0, 35);
          range.setStartAfter(element.lastChild);
          range.collapse(true);

          selection.removeAllRanges();
          selection.addRange(range);
        } else if (textArr.length > 300) {
          mutation.target.textContent = textContent.substring(0, 35);
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
    const { text, align, fontStyle, font } = settings;

    if (text) {
      this.editableArea.textContent = text;
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
        }
      }
    }
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

    productControls.append(removeBtn, controlsQuantity, editBtn);

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

  init(type) {
    const block = this.parentElement.querySelector('.product-builder__element');

    const remove = this.querySelector(ProductControls.selectors.remove);
    const edit = this.querySelector(ProductControls.selectors.edit);

    const increaseQuantity = this.querySelector(ProductControls.selectors.quantity.plus);
    const decreaseQuantity = this.querySelector(ProductControls.selectors.quantity.minus);

    if (increaseQuantity) {
      increaseQuantity.addEventListener('click', () => {
        block.setQuantity(block.getQuantity() + 1);
  
        this.setValue();
      });
    }

    if (decreaseQuantity) {
      decreaseQuantity.addEventListener('click', () => {
        if (block.getQuantity() > 1) {
          block.setQuantity(block.getQuantity() - 1);
        }
  
        this.setValue();
      });
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

    if (remove) {
      switch (type) {
        case 'block':
          remove.addEventListener('click', () => {
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
            })
          });
          break;
        case 'picture':
          remove.addEventListener('click', () => {
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
            })
          })
          break;
      }
    }

    if (edit) {
      edit.addEventListener('click', () => {
        console.log('should to edit');
      });
    }
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
    this.setAttribute('block-type', 'default-product');

    this.initControls();
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
        this.selectLayout();
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

    this.selectLayout();
  }

  setValue(settings, block) {
    const { layout, backgroundColor } = settings;

    if (this.layout !== layout.value) {
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
      callback.apply(this, this.editablePicturesJSON);
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
        picture.setImage(imageUrl);
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

class Tiles extends ProductElement {
  constructor() {
    super();
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

    this.element.undo.addEventListener('click', () => {
      Studio.utils.history.undoState();
    });

    this.element.redo.addEventListener('click', () => {
      Studio.utils.history.redoState();
    });
  }
}
customElements.define('view-controls', ViewControls);
class StudioView extends HTMLElement {
  static selectors = {
    sizeSelector: '[data-product-option-selector]',
    container: '[data-studio-view-container]',
    productElement: '[product-element]',
    productInfo: 'product-info',
    tools: 'customization-tools',
    block: '[block]',
    studioBlock: '[data-studio-block]',
    blockById: (id) => `[block="${id}"]`,
    editableById: (id) => `[editable-picture="${id}"]`,
    editablePicture: '[editable-picture]',
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

    this.state = currState;

    if (!prevState || !currState) {
      return;
    }

    if (compareObjects(prevState, currState)) {
      return;
    }

    if (!compareObjects(prevState.product, currState.product)) {
      this.init(currState.product);
      this.setProductElements(currState.blockCount, { clearAll: true });
    }

    if (!compareObjects(prevState.blocks, currState.blocks)) {
      this.toggleSelected(prevState.blocks, currState.blocks);

      this.setBlocksValue(prevState.blocks, currState.blocks);
    }

    if (currState.product && prevState.blockCount !== currState.blockCount) {
      this.setProductElements(currState.blockCount);
    }

    if (currState.imagesToDownload && !compareObjects(currState.imagesToDownload, prevState.imagesToDownload)) {      
      this.setImages(currState);

      Studio.utils.change({
        imagesToDownload: null
      })
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

    this.state = {
      selected: [],
      selectedEditable: null,
      images: []
    };

    this.initEventListeners();

    this.inited = true;
  }

  toggleSelected(prevBlocks, currBlocks) {
    const selectedBlock = prevBlocks.find(block => block.selected || block.activeChild);
    const toSelectBlock = currBlocks.find(block => block.selected || block.activeChild);

    if (compareObjects(selectedBlock, toSelectBlock)) {
      return ;
    }

    const selected = this.querySelector(
      StudioView.selectors.blockById(selectedBlock?.id)
    );

    if (selected) {
      if (!toSelectBlock || (toSelectBlock && selectedBlock.id !== toSelectBlock.id)) {
        selected.unselect();
      }

      if (selectedBlock.activeChild && !selectedBlock.selected) {
        const childJSON = selectedBlock.childBlocks.find(child => child.selected);

        if (childJSON) {
          const child = this.querySelector(StudioView.selectors.childBlockById(childJSON.id));
          
          if (child) {
            child.unselect();
          }
        }
      }
    }
    
    if (toSelectBlock) {
      const toSelect = this.querySelector(
        StudioView.selectors.blockById(toSelectBlock.id)
      );
  
      if (toSelect) {
        toSelect.select();
  
        if (toSelectBlock.activeChild && !toSelectBlock.selected) {
          const childJSON = toSelectBlock.childBlocks.find(child => child.selected);
  
          if (childJSON) {
            const child = this.querySelector(StudioView.selectors.childBlockById(childJSON.id));
  
            if (child) {
              child.select();
            }
          }
        }
      }
    }
  }

  setBlocksValue(prevBlocks, currBlocks) {
    const initiateNewChildren = (element, selectedChildrenIds, prevChildrens) => {
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

    const newBlocks = currBlocks
      .map(block => {
        const element = this.querySelector(StudioView.selectors.blockById(block.id));

        let prevSettings = {};

        const selectedChildrenIds = block.childBlocks
          .filter(child => child.selected)
          .map(child => child.id);

        const prevBlock = prevBlocks.find(prevB => prevB.id === block.id);
        
        if (prevBlock) {
          prevSettings = prevBlock.settings;
        }

        let children = null;

        switch(block.type) {
          case 'photobook-page':
            if (!compareObjects(prevSettings, block.settings)) {
              element.setValue(block.settings, block);
            }

            children = initiateNewChildren(element, selectedChildrenIds, block.childBlocks);
            break;
        }

        return {
          ...block,
          childBlocks: children ? children : block.childBlocks
        };
      });

    const prevChildren = prevBlocks.map(block => block.childBlocks);
    const currChildren = newBlocks.map(block => block.childBlocks);

    if (!compareObjects(prevChildren, currChildren)) {
      this.setChildsValue(prevChildren, currChildren, newBlocks);
    } else {
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

                textElement.setValue(child.settings.text);
                break;
              case 'editable-picture':
                const pictureElement = this.querySelector(StudioView.selectors.childBlockById(child.id));

                if (!child.imageUrl && pictureElement.hasImage()) {
                  pictureElement.removeImage();
                } else if (child.imageUrl && !pictureElement.hasImage()) {
                  pictureElement.setImage(child.imageUrl);
                }

                pictureElement.setValue(child.settings);
                break;
            }
          })

        return block;
      })

    Studio.utils.change({
      view: {
        ...this.state,
        blocks: newBlocks
      }
    })
  }

  initEventListeners() {
    this.addEventListener('image:removed', () => {
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

  createStudioBlock(type) {
    const block = document.createElement('div');

    block.classList.add('studio-view__block');
    block.toggleAttribute('data-studio-block');

    switch(type) {
      case 'photobook-page':
        block.classList.add('block__photobook-page');
        break;
    }

    return block
  }

  createDefaultProductElement() {
    const block = this.createStudioBlock();

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

    block.append(productElement);

    const elementControls = ProductControls.createBlockControls(productElement.getAttribute('block'));

    block.append(elementControls);

    this.elements.container.appendChild(block);
  }

  createPhotobookPage(layout) {
    const block = this.createStudioBlock('photobook-page');

    const page = document.createElement('photobook-page');
    page.classList.add('photobook-page', 'product-builder__element');
    page.setAttribute('photobook-page', layout);

    page.addEventListener('click', (event) => {
      const childs = [...page.querySelectorAll(StudioView.selectors.childBlock)];

      const someIsChild = childs.includes(event.target)
        || childs.some(child => child.contains(event.target));

      this.setSelectedBlock(page, someIsChild);
    });

    block.append(page);

    this.elements.container.append(block);
  }

  setSelectedBlock(block, activeChild) {
    const selectedBlock = this.getBlockJSON(block);
    const { blocks } = JSON.parse(this.getAttribute('state'));

    const turnOfChilds = activeChild ? !activeChild : true;

    const newBlocks = blocks
      .map(sBlock => {
        if (sBlock.id !== selectedBlock.id) {
          return {
            ...sBlock,
            selected: false,
            activeChild: false,
            childBlocks: turnOfChilds
              ? sBlock.childBlocks.map(child => ({ ...child, selected: false }))
              : sBlock.childBlocks
          }
        }

        return {
          ...sBlock,
          selected: activeChild ? !activeChild : true,
          activeChild: activeChild ? activeChild : false,
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

    const newChildBlocks = blockJSON.childBlocks.map(block => {
      if (block.id === childID) {
        return childJSON
      }

      return {
        ...block,
        selected: false
      };
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

        const blockWithNoActiveChild = {
          ...block,
          activeChild: false,
          childBlocks: block.childBlocks
            .map(child => ({ ...child, selected: false }))
        }

        return blockWithNoActiveChild
      });

    Studio.utils.change({
      view: {
        ...JSON.parse(this.getAttribute('state')),
        blocks: newBlocksList
      }
    })
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

    this.checkProductsReady();

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
        }}, 'set product elements');
      });
  }

  getBlockJSON(block) {
    const id = block.getAttribute('block');

    const childBlocks = [...block.querySelectorAll(StudioView.selectors.childBlock)];

    const { settings } = Studio.product;

    const { tools } = Studio.state.panel;

    const blockSettings = Object.keys(settings)
      .reduce((obj, tool) => {
        switch(tool) {
          case 'hasLayout':
            if (settings[tool]) {
              obj.layout = tools.layout.value;
            }
            break;
          case 'hasBackground':
            if (settings[tool]) {
              obj.backgroundColor = tools.backgroundColor.value;
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
      settings: blockSettings
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
