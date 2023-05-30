import express from 'express'
import orders from './order.js';
import ProductModel from '../models/Product.js';
import Customer from '../models/Customer.js';
import fs from 'fs';

import sharp from 'sharp';

import { join } from 'path';
import { getUploadPath, removeImage } from '../controllers/product-builder.js';

const PROXY_PATH = `${process.cwd()}/frontend/product-builder/src`;

const productBuilder = express.Router();

productBuilder.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/liquid');

  res.sendFile(join(PROXY_PATH, 'builder.liquid')); 
});

productBuilder.get('/product', async (req, res) => {
  const { id } = req.query;

  const product = await ProductModel.findOne({ shopify_id: `gid://shopify/Product/${id}` });

  res.send(product); 
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

productBuilder.use('/drafts', orders);

productBuilder.get('/uploads/list', (req, res) => {
  const { logged_in_customer_id: customerId, anonimId, shop } = req.query;

  const path = customerId
    ? join(PROXY_PATH, 'uploads', shop, customerId, 'uploads')
    : join(PROXY_PATH, 'uploads', shop, 'anonims', anonimId, 'uploads');

  if (customerId && !anonimId && fs.existsSync(path) ) {
    const uploads = fs.readdirSync(path, { withFileTypes: true })
      .map(file => getUploadPath({ shop, customerId, fileName: file.name }));

    res.send(uploads);
    return;
  } else if (!customerId && anonimId && fs.existsSync(path)) {
    const uploads = fs.readdirSync(path, { withFileTypes: true })
      .map(file => getUploadPath({ shop, anonimId, fileName: file.name }));

    res.send(uploads);
    return;
  }

  res.send({
    error: 'directrory not exists'
  });
});

productBuilder.post('/uploads/remove', express.json(), removeImage)

productBuilder.get('/uploads/*', async (req, res) => {
  const pathArr = req.path.split('/');

  const startFrom = pathArr.indexOf('product-builder') + 1;

  const path = join(process.cwd(), 'frontend/product-builder/src', ...pathArr.slice(startFrom));

  const options = ['rotate', 'flip', 'flop', 'crop', 'resize', 'filter'];

  const config = Object.keys(req.query)
    .reduce((obj, key) => {
      if (options.includes(key) && req.query[key]) {
        obj[key] = JSON.parse(req.query[key]);
      }

      return obj;
    }, {})

  const { flip, flop, rotate, crop, resize } = config;

  let file = sharp(path);

  const metadata = await file.metadata();

  const { width, height } = metadata; 

  // if (flip && typeof flop === 'boolean') {
  //   file = file.flip();
  // }
 
  // if (flop && typeof flop === 'boolean') {
  //   file = file.flop();
  // } 

  if (rotate && typeof rotate === 'number') {
    file = file
      .rotate(rotate, { background: { r: 255, g: 255, b: 255, alpha: 1 } })
  }

  if (resize && Array.isArray(resize) && width && height) {
    const [resizeWidth, resizeHeight] = resize;

    if (width > resizeWidth || height > resizeHeight) {
      file = file.resize({
        width: resizeWidth,
        height: resizeHeight
      })
    } else {
      const horizontal = width > resizeWidth ? 0 : Math.round((resizeWidth - width) / 2);
      const vertical = height > resizeHeight ? 0 : Math.round((resizeHeight - height) / 2);

      const maxResize = Math.max(width, height);

      console.log(resizeWidth, resizeHeight, horizontal, vertical);
  
      file = file.extend({ 
        top: vertical,
        left: horizontal,
        right: horizontal, 
        bottom: vertical,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      }); 
    }
  }

  // if (resize && Array.isArray(resize)) {
  //   const [resizeWidth, resizeHeight] = resize; 

  //   file = file.resize({
  //     width: resizeWidth,
  //     height: resizeHeight,
  //     fit: 'contain',
  //     background: { r: 255, g: 255, b: 255, alpha: 1 },
  //   });
  // }

  res.setHeader('Content-Type', 'image/jpeg'); 

  const readyFile = await file
    .withMetadata()
    .jpeg()
    .toBuffer(); 
 
  res.send(readyFile);
}); 

productBuilder.use('/', express.static(PROXY_PATH));

export default productBuilder;