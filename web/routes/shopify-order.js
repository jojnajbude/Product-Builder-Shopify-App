import { Router, json } from 'express';
import fs from 'fs';

import Project from '../models/Projects.js';
import Order from '../models/Order.js';

const shopifyOrders = Router();

shopifyOrders.post('/order/create', json(), async (req, res) => {
  const shopifyOrder = req.body;

  if (!shopifyOrder) {
    res.sendStatus(400);
    return;
  }

  const {
    id: shopify_id,
    checkout_id,
    contaict_email,
    email,
    current_subtotal_price,
    name,
    order_number,
    number,
    order_status_url,
    customer,
    line_items
  } = shopifyOrder;

  const projects = line_items
    .filter(item => item.properties.some(prop => prop.name === 'order_id'))
    .map(item => ({
      id: item.id,
      quantity: item.quantity,
      title: item.title,
      order_id: item.properties.find(prop => prop.name === 'order_id').value
    }));

  if (!projects.length) {
    res.sendStatus(200);
    return;
  }

  const order = new Order({
    shopify_id,
    checkout_id,
    contaict_email,
    email,
    current_subtotal_price,
    name,
    order_number,
    number,
    order_status_url,
    customer,
    line_items
  });

  await order.save();

  console.log(name, projects);

  res.sendStatus(200);
});

export default shopifyOrders;