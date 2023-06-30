import { join } from 'path';
import fs from 'fs';

import makeCode from '../utils/makeCode.js';
import Project from '../models/Projects.js';

const cdnPath = join(process.cwd(), 'frontend', 'product-builder', 'src', 'uploads');

export const getCustomer = (path) => {
  const uploads = join(path, 'uploads');

  if (!fs.existsSync(path) && !fs.existsSync(uploads)) {
    fs.mkdirSync(path);

    fs.mkdirSync(uploads);
  } 

  const draftPath = join(path, 'orders');

  if (!fs.existsSync(draftPath)) {
    fs.mkdirSync(join(path, 'orders'));
  }

  return uploads;
}

export const getOrderPath = (req, res, next) => {
  const { id: customerId, shop } = req.query;

  if (!customerId) {
    res.send({
      error: {
        message: 'Id or anonimId has not provided'
      }
    });
    return;
  }

  if (!shop) {
    res.send({
      error: {
        message: 'Shop has not provided'
      }
    })
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

  const createdAt = Date.now();

  const orderId = req.params.orderId ? req.params.orderId : `draft-${createdAt}-${makeCode(5)}`;

  const ordersPath = isLoggedCustomer
    ? join(cdnPath, shop, customerId, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', customerId, 'orders', orderId);

  req.order = {
    path: ordersPath,
    id: orderId,
    createdAt,
    isLoggedCustomer
  }

  next();
}

export const createOrder = async (req, res) => {
  const { path: ordersPath, id: orderId, createdAt, isLoggedCustomer } = req.order;

  const { id: customerID, shop } = req.query;

  const { status } = req.query;

  const isExist = fs.existsSync(ordersPath);

  if (isExist) {
    res.send({
      error: {
        message: 'Order is exists'
      }
    });
    return;
  }

  fs.mkdirSync(ordersPath);

  const state = req.body;

  fs.writeFileSync(join(ordersPath, 'state.json'), JSON.stringify(state));

  const quantity = state.view.blocks.reduce((sum, block) => sum + block.count, 0);

  const project = new Project({
    orderID: orderId,
    status: status ? status : 'draft',
    createdAt: createdAt,
    updatedAt: createdAt,
    logged: isLoggedCustomer,
    quantity,
    shop,
    customerID
  });

  const { product } = state;
 
  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id } = product;

    project.set('product', { imageUrl, handle, type, title, status, shopify_id });
  }
  await project.save();

  res.send(project);
};

export const updateOrder = async (req, res) => {
  const { path: ordersPath, id } = req.order;

  const statePath = join(ordersPath, 'state.json');

  const state = req.body;

  const project = await Project.findOne({
    orderID: id
  });

  const { product } = state;

  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id, price } = product;

    project.set('product', { imageUrl, handle, type, title, status, shopify_id, price });
  }

  project.set('quantity', state.view.blocks.reduce((sum, block) => sum + block.count, 0));

  project.set('updatedAt', Date.now());

  await project.save();

  fs.writeFileSync(statePath, JSON.stringify(state));

  res.sendStatus(200); 
};
 
export const getOrderInfo = async (req, res) => {
  const { id } = req.order;

  const project = await Project.findOne({
    orderID: id
  });

  if (!project) {
    res.send({
      error: "User doesn't have access to this draft"
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  res.status(200).send(project);
};

export const getOrderState = async (req, res) => {
  const { path: ordersPath, id: orderId, createdAt } = req.order;

  const isExist = fs.existsSync(join(ordersPath, 'state.json'));

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
}

export const deleteOrder = async (req, res) => {
  const { id, path } = req.order;

  const { inactive } = req.query;

  const isExist = fs.existsSync(path);

  console.log(path);

  if (!isExist) {
    res.send({
      error: {
        message: "Order's id is incorrect, can't to delete order"
      }
    });
    return;
  }


  if (inactive) {
    const project = await Project.findOne({
      orderID: id
    });

    project.set('status', 'draft');

    await project.save();

    res.send({
      correct: 'Set status of order to draft'
    });
    return;
  }

  fs.rmSync(path, { recursive: true });
  await Project.deleteOne({
    orderID: id
  });

  res.send({
    correct: 'Deleted'
  });
};