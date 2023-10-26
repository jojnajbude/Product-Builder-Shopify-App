
import layouts from './utils/layouts.js';
import adaptiveActions from './utils/helpers/adaptiveActions.js';
import subscribeToActionController from './utils/helpers/subscribeToActionController.js';

import {
  Tool,
  LayoutTool,
  RotateTool,
  CropTool,
  FilterTool,
  TextTool,
  FrameTool,
  BackgroundColorTool
} from './components/tools/index.js';
import ProductBuilder from "./components/Studio";

const baseURL = 'https://product-builder.dev-test.pro';
const pullZone = 'dev';

const cdnPublicURL = `https://getcocun-${pullZone}.b-cdn.net/shops`;

const cookiesTime = {
  anonimUser: 10
}
Tool.LayoutTool
window.oauthInstagram = JSON.parse(localStorage.getItem('oauthInstagram'));

function moneyFormat(price, currency) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: window.currency,
  });

  return formatter.format(Number(price));
};

const backButton = (function backButtonInit() {
  const previousUrl = document.referrer !== '' && new URL(document.referrer).pathname.endsWith('/apps/product-builder')
    ? new URL(document.referrer)
    : new URL(location.origin + localization.fallbackURL);

  const button = document.querySelector('[data-back-button]');

  if (!button) {
    return;
  }

  button.addEventListener('click', () => {
    location.replace(previousUrl.href);
  });

  return button;
})();

const checkoutButton = (function checkoutButtonInit() {
  const button = document.querySelector('[data-checkout-button]');

  button.disable = () => {
    if (!button.hasAttribute('disabled')) {
      button.toggleAttribute('disabled');
    }
  }

  button.enable = () => {
    button.removeAttribute('disabled');
  }

  if (!button) {
    return;
  }

  button.addEventListener('click', async () => {
    const projectId = productParams.get('project-id');
    button.disable();

    if (!Studio.state.product) {
      button.enable();
      return;
    }

    const { 
      isEnough,
      current,
      required
    } = Studio.panel.productInfo.checkDoneProduct();

    const minimum = Studio.product.quantity.minimum;

    const blockDiff = required - current;

    if (
      Studio.product.quantity.type === 'multiply'
      && current < minimum) {
      Studio.errorToast.error({
        text: `Not enough products quantity. Add ${blockDiff} more ${blockDiff === 1 ? 'block' : 'blocks' } to add project to the cart`
      });
      button.enable();
      return;
    } else if (
      current < minimum
    ) {
      Studio.errorToast.error({
        text: `To checkout project - each picture must have an image`
      });
      button.enable();
      return;
    }

    const newBlocks = Studio.state.view.blocks
      .filter(block => {
        const pictures = block.childBlocks
          .filter(child => child.type === 'editable-picture');
    
        return pictures.every(picture => picture.imageUrl)
      });

    Studio.utils.change({ view: { blocks: newBlocks } }, 'view - clear empty blocks');


    const relatedProduct = await Studio.relatedProducts.getRelatedProducts();

    if (relatedProduct.rejected) {

      button.enable();
      return;
    }

    if (projectId) {
      const shopifyProduct = await fetch(location.origin + `/products/${Studio.product.handle}.js`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }

          return null;
        });

      const { product } = Studio.state;

      let currVariant = shopifyProduct.variants[0];

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
          });
        return;
      } else {
        //console.log(addedToCart);
        Studio.errorToast.error({
          text: addedToCart.description,
          type: addedToCart.message
        })
      }
    } else {
      Studio.errorToast.error({
        text: "No project id provided"
      });
    }

    button.enable();
  });

  return button;
})(); 

const domReader = new DOMParser();

const defaultDPI = 300;

function getPixels(cm, dpi = 300) {
  const pixels = Math.floor(cm / 2.54 * dpi);
  return pixels % 2 === 0 ? pixels : pixels + 1;
}

function getResolution(width, height) {
  return {
    width: getPixels(width, defaultDPI),
    height: getPixels(height, defaultDPI)
  }
}

window.ImageLimits = {
  size: 25 * 1024 * 1024,
  resolution: {
    width: 200,
    height: 200
  },
  types: ['image/jpeg', 'image/png', 'image/webp']
};

// console.log(localization);

const compareObjects = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}
