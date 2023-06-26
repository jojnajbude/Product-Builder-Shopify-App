import { join } from 'path';
import fs from 'fs';

import makeCode from '../utils/makeCode.js';

const cdnPath = join(process.cwd(), 'frontend', 'product-builder', 'src', 'uploads');

export const getCustomer = (path) => {
  const uploads = join(path, 'uploads');

  if (!fs.existsSync(path) && !fs.existsSync(uploads)) {
    fs.mkdirSync(path);

    fs.mkdirSync(uploads);
  } 

  const draftPath = join(path, 'orders');

  if (!path.includes('anonims') && !fs.existsSync(draftPath)) {
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
  }

  if (!shop) {

    res.send({
      error: {
        message: 'Shop has not provided'
      }
    })
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
    })
  }

  const createdAt = Date.now();

  const orderId = req.params.orderId ? req.params.orderId : `draft-${createdAt}-${makeCode(5)}`;

  const ordersPath = isLoggedCustomer
    ? join(cdnPath, shop, customerId, 'orders', orderId)
    : join(cdnPath, shop, 'anonims', customerId, 'orders', orderId);

  req.ordersPath = ordersPath;
  req.orderId = orderId;
  req.createdAt

  req.order = {
    path: ordersPath,
    id: orderId,
    createdAt
  }

  next();
}

export const createOrder = async (req, res) => {
  const { path: ordersPath, id: orderId, createdAt } = req.order;

  const { status } = req.query;

  const isExist = fs.existsSync(ordersPath);

  if (isExist) {
    res.send({
      error: {
        message: 'Order is exists'
      }
    }) 
  }

  fs.mkdirSync(ordersPath);

  const state = req.body;

  fs.writeFileSync(join(ordersPath, 'state.json'), JSON.stringify(state));

  const quantity = state.view.blocks.reduce((sum, block) => sum + block.count, 0);

  const info = {
    id: orderId,
    status: status ? status : 'draft',
    createdAt: createdAt,
    updatedAt: createdAt,
    quantity
  }

  const { product } = state;

  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id } = product;

    info.product = { imageUrl, handle, type, title, status, shopify_id };
  }

  fs.writeFileSync(join(ordersPath, 'info.json'), JSON.stringify(info));

  res.send(info);
};

export const updateOrder = async (req, res) => {
  const { path: ordersPath } = req.order;

  const statePath = join(ordersPath, 'state.json');
  const infoPath = join(ordersPath, 'info.json');

  const state = req.body;

  const info = JSON.parse(fs.readFileSync(infoPath));

  const { product } = state;

  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id, price } = product;

    info.product = { imageUrl, handle, type, title, status, shopify_id, price };
  }

  info.quantity = state.view.blocks.reduce((sum, block) => sum + block.count, 0);

  info.updatedAt = Date.now();

  fs.writeFileSync(statePath, JSON.stringify(state));
  fs.writeFileSync(infoPath, JSON.stringify(info));

  res.sendStatus(200); 
};
 
export const getOrderInfo = (req, res) => {
  const { path: ordersPath } = req.order;

  const info = fs.readFileSync(join(ordersPath, 'info.json'));

  res.setHeader('Content-Type', 'application/json');

  res.status(200).send(JSON.parse(info));
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

export const deleteOrder = (req, res) => {
  const orderPath = req.ordersPath;

  const { inactive } = req.query;

  const isExist = fs.existsSync(orderPath);

  if (!isExist) {
    res.send({
      error: {
        message: "Order's id is incorrect, can't to delete order"
      }
    })
  }

  if (inactive) {
    const infoPath = join(orderPath, 'info.json');

    const info = JSON.parse(fs.readFileSync(infoPath));

    if (info) {
      info.status = 'draft';
    }

    fs.writeFileSync(infoPath, JSON.stringify(info));

    res.send({
      correct: 'Set status of order to draft'
    });
    return;
  }

  fs.rmSync(orderPath, { recursive: true });

  res.send({
    correct: 'Deleted'
  });
};