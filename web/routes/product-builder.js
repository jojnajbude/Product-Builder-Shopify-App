import express from 'express'
import projects from './project.js';
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import ProductModel from '../models/Product.js';
import Customer from '../models/Customer.js';


import { join } from 'path';
import { getCustomerUploads, getUploadPath, removeImage, sharpImage } from '../controllers/product-builder.js';
import { createDir, downloadFile, existsFile, readDirectory, uploadFile } from '../utils/cdnApi.js';
import Shop from '../models/Shop.js';
import shopify from '../shopify.js';

const PROXY_PATH = `${process.cwd()}/frontend/product-builder/src`;

const productBuilder = express.Router();

productBuilder.get('/', async (req, res) => {
  const host = process.env.HOST;

  res.setHeader('Content-Type', 'application/liquid');

  const pagePath = join(PROXY_PATH, 'builder.liquid');

  res.sendFile(pagePath); 
});

productBuilder.get('/testBunny', async (req, res) => {
  // const response = await downloadFile(join('shops'), 'block-8 - image-3 - original.jpg');

  // const file = fs.readFileSync(join(PROXY_PATH, 'assets', 'main.css'));

  // const isExists = await existsFile(join('shops', 'hladkevych-dev.myshopify.com', 'anonims'));

  // const filePath = await uploadFile(join('shops'), 'style.css', file);

  const response = await createDir('testDir');

  res.send(response);
})

productBuilder.get('/product', async (req, res) => {
  const { id } = req.query;

  const product = await ProductModel.findOne({ shopify_id: `gid://shopify/Product/${id}` });

  res.send(product); 
})

productBuilder.get('/shopify/product/:productId/variants',  async (req, res) => {
  const { productId } = req.params;

  const { shop: shopName } = req.query

  const shop = await Shop.findOne({
    name: shopName
  });

  if (!shop) {
    res.send({
      error: {
        message: 'No shop provided'
      }
    });
    return;
  }

  const client = new shopify.api.clients.Graphql({
    session: shop.session, 
    apiVersion: LATEST_API_VERSION
  });

  try {
    const product = await client.query({
      data: `{
        product (id: "gid://shopify/Product/${productId}") {
          handle,
          title,
          id,
          variants (first: 100){
            edges {
              node {
                id,
                image {
                  url
                },
                price,
                availableForSale,
                selectedOptions {
                  name,
                  value
                }
              }
            }
          }
        }
      }`
    });

    res.status(200).send(product.body.data.product);
    return;
  } catch {
    res.status(400).send({
      error: {
        message: 'Invalid id'
      }
    });
  }
})
 
productBuilder.get('/products', async (req, res) => {
  const products = await ProductModel.find({});

  res.send(products);
});

productBuilder.get('/customer', async (req, res) => {
  const { id } = req.query;

  if (!id) { 
    res.send({
      error: 'customer id has not provided'
    });
    return;
  }

  const customer = await Customer.findOne({ shopify_id: id });

  if (customer) {
    res.send(customer);
    return;
  } else {
    res.send({
      error: 'Customer do not exist'
    })
  }
});

productBuilder.get('/cart/checkProduct', async (req, res) => {
  const { id } = req.query;

  const shopify_id = "gid://shopify/Product/" + id;

  const isExist = await ProductModel.findOne({
    shopify_id
  });

  if (!isExist) {
    res.send({
      allowed: 'yes'
    });
    return;
  }

  res.send({
    allowed: 'no'
  })
});

productBuilder.get('/cart', (req, res) => {
  res.setHeader('Content-Type', 'application/liquid');

  res.sendFile(join(process.cwd(), 'frontend', 'product-builder/src', 'cart.liquid'));
});
 
productBuilder.use('/orders', projects);
 
productBuilder.get('/uploads/list', getCustomerUploads);

productBuilder.post('/uploads/remove', express.json(), removeImage);

productBuilder.use('/', express.static(PROXY_PATH));

productBuilder.get('/*', sharpImage); 

export default productBuilder;