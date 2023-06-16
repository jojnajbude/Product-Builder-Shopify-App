import { Router, json } from 'express';
import multer from "multer";
import fs from 'fs';

import { createOrder, getCustomer, getOrderInfo, getOrderPath, getOrderState, updateOrder } from '../controllers/order.js';

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

orders.post('/create', json(), getOrderPath, createOrder);

orders.post('/update/:orderId', json(), getOrderPath, updateOrder)

orders.get('/list/:customerId', (req, res) => {
  const { customerId } = req.params;

  const { shop } = req.query;

  if (!customerId) {
    res.send({
      error: {
        message: 'Id or anonimId has not provided' 
      }
    });
    return;
  }

  const isLoggedCustomer = fs.existsSync(join(cdnPath, shop, customerId));

  const isAnoninCustomer = isLoggedCustomer
    ? false
    : fs.existsSync(join(cdnPath, shop, 'anonims', customerId));

  if (!isLoggedCustomer && !isAnoninCustomer) {
    res.send({
      error: {
        message: "User's id doesn't exists"
      }
    });
    return;
  }

  const ordersPath = isLoggedCustomer
    ? join(cdnPath, shop, customerId, 'orders')
    : join(cdnPath, shop, 'anonims', customerId, 'orders');

  const orders = fs.readdirSync(ordersPath, { withFileTypes: true })
    .filter(dir => dir.name.startsWith('draft'))
    .map(dir => {
      const infoPath = join(ordersPath, dir.name, 'info.json');
      const isExistInfo = fs.existsSync(infoPath)

      if (isExistInfo) {
        return fs.readFileSync(infoPath);
      }

      return false;
    }).filter(buff => buff)
    .map(buff => JSON.parse(buff));

  res.setHeader('Content-Type', 'application/json');

  res.send(orders);
});

orders.get('/info/:orderId', getOrderPath, getOrderInfo);

orders.get('/state/:orderId', getOrderPath, getOrderState);

orders.delete('/delete/:orderId', getOrderPath, (req, res) => {
  const orderPath = req.ordersPath;

  const isExist = fs.existsSync(orderPath);

  if (!isExist) {
    res.send({
      error: {
        message: "Order's id is incorrect, can't to delete order"
      }
    })
  }

  fs.rmSync(orderPath, { recursive: true });

  res.send({
    correct: 'Deleted'
  });
}) 

orders.post('/uploads', imageUpload.single('images'), (req, res) => {
  const file = req.file;

  const { customerId, shop, anonimId } = req.query;

  const clientPath =  customerId
    ? join(customerId, 'uploads')
    : join('anonims', anonimId, 'uploads')

  const path = join(shop, clientPath, file.filename);

  if (!file) {
    res.sendStatus(400);
    return;
  } else { 
    res.send(path);
  }  
});

orders.get('/*', (req, res) => {
  res.setHeader('Content-Type', 'application/liquid');

  res.sendFile(join(process.cwd(), 'frontend', 'product-builder/src', 'orders.liquid'));
});

export default orders; 