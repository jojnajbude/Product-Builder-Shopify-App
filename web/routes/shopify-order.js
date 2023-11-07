import { Router, json } from 'express';
import fs from 'fs';

import Project from '../models/Projects.js';
import Order from '../models/Order.js';
import { composeOrder } from '../controllers/order.js';

const shopifyOrders = Router();

shopifyOrders.post('/order/create', json(), async (req, res) => {
  
  const shopifyOrder = req.body;

  res.sendStatus(200);

  if (!shopifyOrder) {
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
    .filter(item => item.properties.some(prop => prop.name === 'project_id'))
    .map(item => ({
      id: item.id,
      quantity: item.quantity,
      title: item.title,
      project_id: item.properties.find(prop => prop.name === 'project_id').value
    }));

  if (!projects.length) {
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

  await Promise.all(projects.map(async project => {
    const projectDoc = await Project.findOne({ projectId: project.project_id });

    if (!projectDoc) {
      return;
    }

    projectDoc.set('status', 'ordered');

    await projectDoc.save();

    return;
  }))

  console.log(name, projects);
});

shopifyOrders.get('/order/compose', composeOrder);

export default shopifyOrders;