import { Router, json } from 'express';
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


orders.get('/create', async (req, res) => {
  const { id, shop } = req.query;

  if (!id) {
    res.send({
      error: {
        message: 'Id or anonimId has not provided'
      }
    });
  }

  const isLoggedCustomer = fs.existsSync(join(cdnPath, shop, id));

  const isAnoninCustomer = isLoggedCustomer
    ? false
    : fs.existsSync(join(cdnPath, shop, 'anonims', id));

  if (!isLoggedCustomer && !isAnoninCustomer) {
    res.send({
      error: {
        message: "User's id doesn't exists"
      }
    })
  }

  const createdAt = Date.now();

  const orderId = `draft-${createdAt}-${makeCode(5)}`;

  const ordersPath = isLoggedCustomer
    ? join(cdnPath, shop, id, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', id, 'orders', orderId);

  const isExist = fs.existsSync(ordersPath);

  if (isExist) {
    res.send({
      error: {
        message: 'Order is exists'
      }
    })
  }

  fs.mkdirSync(ordersPath);

  fs.writeFileSync(join(ordersPath, 'state.json'), '{}');
  fs.writeFileSync(join(ordersPath, 'info.json'), JSON.stringify({
    id: orderId,
    createdAt: createdAt,
    updatedAt: createdAt
  }));

  res.send(orderId);
});

orders.post('/update/:id', json(), async (req, res) => {
  const { id: orderId } = req.params;
  const { id: customerId, shop } = req.query;

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
    ? join(cdnPath, shop, customerId, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', customerId, 'orders', orderId);

  const statePath = join(ordersPath, 'state.json');
  const infoPath = join(ordersPath, 'info.json');

  const state = req.body;

  const info = JSON.parse(fs.readFileSync(infoPath));

  const { product } = state;

  console.log(product);

  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id } = product;

    info.product = { imageUrl, handle, type, title, status, shopify_id };
  }

  info.updatedAt = Date.now();

  fs.writeFileSync(statePath, JSON.stringify(state));
  fs.writeFileSync(infoPath, JSON.stringify(info));

  res.send(200); 
})

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
    ? join(cdnPath, shop, customerId, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', customerId, 'orders', orderId);
});

orders.get('/info/:orderId', (req, res)   => {
  const { orderId } = req.params;

  console.log(orderId, req.query);

  res.send(id);
});

orders.get('/:id', async (req, res) => {
  const { id: orderId } = req.params;
  const { id: customerId, shop } = req.query;

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
    ? join(cdnPath, shop, customerId, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', customerId, 'orders', orderId);


  const isExist = fs.existsSync(ordersPath, 'state.json');

  if (!isExist) {
    res.send({
      error: {
        message: 'No such order in directory'
      }
    });
    return;
  }

  const state = fs.readFileSync(join(ordersPath, 'state.json'));

  res.send(state);
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

orders.use('/*', () => {
  res.sendStatus(400);
})

export default orders; 