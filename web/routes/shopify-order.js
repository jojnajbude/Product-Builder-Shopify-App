import { Router, json } from 'express';
import fs from 'fs';

import Project from '../models/Projects.js';
import Order from '../models/Order.js';
import { composeOrder } from '../controllers/order.js';
import { join } from 'path';
import { downloadFile, uploadFile } from '../utils/cdnApi.js';

const shopifyOrders = Router();

shopifyOrders.post('/order/create', json(), async (req, res) => {
  
  const shopifyOrder = req.body;

  res.sendStatus(200);
  res.end();

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

    const customerUploadsLinks = await fetch(`${process.env.HOST}/product-builder/uploads/list?shop=${projectDoc.shop}&anonimId=${projectDoc.customerID}`)
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        throw new Error('Error while fetching customer uploads');
      }).catch(err => console.log(err));

    if (customerUploadsLinks.error || !Array.isArray(customerUploadsLinks)) {
      return;
    }

    customerUploadsLinks.forEach(async link => {
      const name = link.split('/').pop();

      const image = await fetch(join(process.env.BUNNY_HOST, 'shops', link))
        .then(res => {
          if (res.ok) {
            return res.blob();
          }

          throw new Error('Error while fetching image: ', link);
        }).catch(err => console.log(err));

        if (!image) {
          return;
        }

        const resourcePath = projectDoc.customerID.split('-').length === 2
          ? join('shops', projectDoc.shop, 'anonims', projectDoc.customerID, 'projects', projectDoc.projectId, 'resources')
          : join('shops', projectDoc.shop, projectDoc.customerID, 'projects', projectDoc.projectId, 'resources');

        const response = await uploadFile(resourcePath, name, image);
    });
    return;
  }));

  console.log(name, projects);
});

shopifyOrders.get('/order/compose', composeOrder);

export default shopifyOrders;