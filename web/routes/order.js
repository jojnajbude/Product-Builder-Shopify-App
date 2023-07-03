import { Router, json } from 'express';
import multer from "multer";
import fs from 'fs';

import { createOrder, deleteOrder, getCustomer, getOrderInfo, getOrderPath, getOrderState, updateOrder } from '../controllers/order.js';

import { join } from 'path';
import cron from 'node-cron';
import Project from '../models/Projects.js';
import shopifyOrders from './shopify-order.js';
import Order from '../models/Order.js';
import shopify from '../shopify.js';

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
});
let i = 0;

cron.schedule('* */30 * * * *', async (now) => {
  const anonimsProjects = await Project.find({
    logged: false,
    status: 'active',
  }).limit(50);

  const toDelete = anonimsProjects.filter(project => {
    const timeDiff = (now - project.updatedAt) / 1000;
    return timeDiff >= 60;
  });

  const deleted = await Promise.all(toDelete.map(project => {
    return new Promise(res => {
      Project.deleteOne({
        orderID: project.orderID
      }).then(_ => res(project));
    })
  }));

  deleted.map(project => {
    const { orderID: id, shop, customerID, logged } = project;

    const path = logged
      ? join(cdnPath, shop, customerID, 'orders', id)
      : join(cdnPath, shop, 'anonims', customerID, 'orders', id);

    if (fs.existsSync(path)) {
      fs.rmSync(path, { recursive: true });
    }
  });
});

cron.schedule('* */6 * * *', () => {
  const shops = fs.readdirSync(cdnPath, { withFileTypes: true})
    .filter(shop => shop.isDirectory())
    .map(shop => shop.name);

  shops.forEach(shop => {
    const anonimsPath = join(cdnPath, shop, 'anonims');
    
    if (!fs.existsSync(anonimsPath)) {
      return;
    }

    const anonims = fs.readdirSync(anonimsPath, { withFileTypes: true })
      .filter(user => user.isDirectory())
      .map(user => user.name);

    anonims.forEach(anonim => {
      const anonimPath = join(cdnPath, shop, 'anonims', anonim);

      if (!fs.existsSync(anonimPath)) {
        return;
      }

      const ordersPath = join(anonimPath, 'orders');

      if (!fs.existsSync(ordersPath)) {
        fs.rmSync(anonimPath, { recursive: true });
      }

      const projects = fs.readdirSync(join(anonimPath, 'orders'), { withFileTypes: true })
        .filter(project => project.isDirectory() && project.name.startsWith('draft'));

        
      if (!projects.length) {
        console.log('anonim has been deleted:', anonim);
        fs.rmSync(anonimPath, { recursive: true });
      }
    })
  })
})

const cdnPath = join(process.cwd(), 'frontend', 'product-builder', 'src', 'uploads');

const orders = Router();

orders.use('/shopify', shopifyOrders);


orders.get('/compose', shopify.validateAuthenticatedSession(), async (req ,res) => {
  const { id } = req.query;

  const order = await Order.findById(id);

  const projects = order.line_items
    .filter(item => item.properties.some(prop => prop.name === 'order_id'))
    .map((item, index, arr) => {
      const isAnonim = arr.every(item => item.properties.find(item => item.name === 'anonim_id'));

      return {
        shop: res.locals.shopify.session.shop,
        customer: isAnonim ? item.properties.find(prop => prop.name === 'anonim_id').value : order.customer.id,
        orderId: item.properties.find(prop => prop.name === 'order_id').value
      }
    });

  console.log(projects);
  // projects.forEach(project => {
  //   const projectPath = join(cdnPath, project.shop, pro)
  // })

  res.sendStatus(200);
})

orders.post('/create', json(), getOrderPath, createOrder);

orders.post('/update/:orderId', json(), getOrderPath, updateOrder);

orders.get('/checkout/:orderId', getOrderPath, async (req, res) => {
  const { path: ordersPath, id } = req.order;

  const project = await Project.findOne({
    orderID: id
  });

  if (!project) {
    res.send({
      error: 'No project'
    });
    return;
  }

  project.set('status', 'active');

  res.sendStatus(200);
});

orders.post('/cart/check', json(), (req, res) => {
  const { id: customerId, shop } = req.query;
  const { projects } = req.body;

  const userPath = customerId.split('-').length > 1
    ? join(cdnPath, shop, 'anonims', customerId, 'orders')
    : join(cdnPath, shop, customerId, 'orders');

  const isUserExist = fs.existsSync(userPath);

  if (!isUserExist) {
    res.send({
      error: "User doesn't exists"
    });
    return;
  }

  const projectExists = projects.reduce((result, project) => {
    const isExist = fs.existsSync(join(userPath, project));

    return {
      ...result,
      [project]: isExist
    }
  }, {});

  res.send(projectExists);
})

orders.get('/list/:customerId', async (req, res) => {
  const { customerId } = req.params; 

  const { shop, status } = req.query;

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

  const projects = await Project.find({
    shop,
    customerID: customerId
  });

  res.setHeader('Content-Type', 'application/json');

  res.send(projects);
});

orders.get('/info/:orderId', getOrderPath, getOrderInfo);

orders.get('/state/:orderId', getOrderPath, getOrderState);

orders.delete('/delete/:orderId', getOrderPath, deleteOrder); 

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