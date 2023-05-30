import { Router } from 'express';
import multer from "multer";
import fs from 'fs';

import { getCustomer } from '../controllers/order.js';

import makeCode from '../utils/makeCode.js';
import { join } from 'path';
import { shopifyApp } from '@shopify/shopify-app-express';

const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { customerId, shop, anonimId } = req.query;
  
    const uploadShops = fs.readdirSync(cdnPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
  
    const shopPath = join(cdnPath, shop);
    const shopAnonimPath = join(cdnPath, shop, 'anonims')
  
    if (!uploadShops.includes(shop)) {
      fs.mkdirSync(shopPath); 
      fs.mkdirSync(shopAnonimPath);
    }
  
    const customers = fs.readdirSync(shopPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory() && dirent.name !== 'anonims')
      .map(dirent => dirent.name);
  
    let uploads = join(process.cwd(), 'frontend', 'product-builder/src', 'uploads');

    if ((!customerId || !customers.includes(customerId)) && anonimId) {
      uploads = getCustomer(join(shopAnonimPath, anonimId));
    } else if (customerId && !anonimId) {
      uploads = getCustomer(join(shopPath, customerId));
    }

    cb(null, uploads);
  }, 
  filename: function (req, file, cb) {
    const { originalname } = file;

    const name = Date.now() + '.' + originalname.split('.').pop();

    cb(null, name);
  },
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1048576 * 40
  } 
})

const cdnPath = join(process.cwd(), 'frontend', 'product-builder', 'src', 'uploads');

const orders = Router();

orders.get('/', (req, res) => {
  res.sendStatus(201);
});

orders.post('/uploads', imageUpload.single('images'), (req, res) => {
  const file = req.file;

  const { customerId, shop, anonimId } = req.query;

  const clientPath =  customerId
    ? join(customerId, 'uploads')
    : join('anonims', anonimId, 'uploads')

  const path = join(shop, clientPath, file.filename);

  if (!file) {
    res.send(400);
  } else { 
    res.send(path);
  }  
});

export default orders; 