import express from 'express'
import orders from './order.js';
import ProductModel from '../models/Product.js';
import Customer from '../models/Customer.js';
import fs from 'fs';


import { join } from 'path';
import { getCustomerUploads, getUploadPath, removeImage, sharpImage } from '../controllers/product-builder.js';

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
 
productBuilder.use('/orders', orders);
 
productBuilder.get('/uploads/list', getCustomerUploads);

productBuilder.post('/uploads/remove', express.json(), removeImage) 

productBuilder.get('/uploads/*', sharpImage); 
 
productBuilder.use('/', express.static(PROXY_PATH));

export default productBuilder;