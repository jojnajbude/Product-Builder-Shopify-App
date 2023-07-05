import { join } from 'path';
import fs from 'fs';
import JSZip from 'jszip';

import Order from '../models/Order.js';

import makeCode from '../utils/makeCode.js';
import Project from '../models/Projects.js';

const zip  = new JSZip();

const frontPath = join(process.cwd(), 'frontend', 'product-builder', 'src');

const cdnPath = join(frontPath, 'uploads');

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

export const getImageFromUrl = async (url) => {
  if (!url) {
    return new Promise(rej => rej());
  }

  return fetch(url).then(res => res.arrayBuffer());
}

export const composeProject = async (req ,res) => {
  const { order_id, project_id } = req.query;

  const [ order, project ] = await Promise.all([
    Order.findOne({
      shopify_id: order_id
    }),
    Project.findOne({
      orderID: project_id
    })
  ]);

  const lineItem = order.line_items
    .filter(item => item.properties.some(prop => prop.name === 'order_id'))
    .map((item, _, arr) => {
      const isAnonim = arr.every(item => item.properties.find(item => item.name === 'anonim_id'));

      // console.log(item);

      return {
        shop: project.shop,
        customer: {
          id: isAnonim ? item.properties.find(prop => prop.name === 'anonim_id').value : order.customer.id,
          name: order.customer.first_name,
          lastName: order.customer.last_name,
          email: order.customer.email
        },
        product: {
          name: item.name,
          title: item.title
        },
        orderId: item.properties.find(prop => prop.name === 'order_id').value
      }
    }).find(item => item.orderId === project_id);

  const { customer } = lineItem;

  const projectPath = customer.id.split('-').length === 2
    ? join(cdnPath, lineItem.shop, 'anonims', customer.id, 'orders', lineItem.orderId)
    : join(cdnPath, lineItem.shop, customer.id, 'orders', lineItem.orderId);
  
  const composeName = `${project.product.title.split('/').join('-')} - ${
    customer.name && customer.lastName
      ? `${customer.name} ${customer.lastName}(${customer.email})`
      : `${customer.email || customer.id}`
  }`;

  const composePath = join(projectPath, composeName);
  const zipPath = join(projectPath, composeName + '.zip');

  const zipName = composePath.split('/').pop();

  if (fs.existsSync(zipPath)) {
    res.sendFile(zipPath);
    return;
  }

  if (fs.existsSync(composePath)) {
    const zipName = composePath.split('/').pop();

    const projectZip = zip.folder(zipName);

    const projectComposeContent = fs.readdirSync(composePath, { withFileTypes: true })
      .filter(file => !file.isDirectory())
      .map(file => ({
        name: file.name,
        data: fs.readFileSync(join(composePath, file.name))
      }));

    projectComposeContent.forEach(file => {
      projectZip.file(file.name, file.data, { binary: true });
    });

    const zipFolder = await zip.generateAsync({ type: 'blob' });

    const zibBuffer = Buffer.from(await zipFolder.arrayBuffer());

    fs.writeFileSync(zipPath, zibBuffer);

    res.send({
      name: zipName,
      data: zibBuffer
    });
    return;
  }

  if (!fs.existsSync(composePath)) {
    fs.mkdirSync(composePath);
  }

  const state = JSON.parse(fs.readFileSync(join(projectPath, 'state.json')));

  const blocks = state.view.blocks
    .filter(block => block.childBlocks.some(child => child.imageUrl))
    .map(block => ({
      id: block.id,
      images: block.childBlocks
        .filter(child => child.imageUrl)
        .map(child => ({
          url: child.imageUrl,
          settings: child.settings,
          resolution: child.resolution
        }))
        .map(image => {
          const { crop, rotate, backgroundColor } = image.settings;

          const { width, height } = image.resolution;

          const resize = width && height
            ? [width, height]
            : null;

          const editedUrl = image.url + `?${
              resize
                ? `resize=${JSON.stringify(resize)}&`
                : ''
            }crop=${crop.value}&rotate=${rotate.value}&background=${backgroundColor.value}`

          return { 
            original: image.url,
            edited: editedUrl
          }
        })
    }));

  const blocksReady = blocks.map(async (block, idx) => new Promise(async (res, rej) => {
    const images = block.images.map(image => new Promise(async res => {
      const [original, edited] = await Promise.all([
        getImageFromUrl(image.original),
        getImageFromUrl(image.edited)
      ])

      res({
        original,
        edited
      });
    }));

    const imagesBuffers = await Promise.all(images);

    imagesBuffers.forEach(image => {
      const originalPath = join(composePath, `${block.id} - image-${idx + 1} - original.jpg`);
      const editedPath = join(composePath, `${block.id} - image-${idx + 1} - edited.jpg`);

      fs.writeFileSync(originalPath, Buffer.from(image.original));
      fs.writeFileSync(editedPath, Buffer.from(image.edited));
    });

    res();
  }));

  await Promise.all(blocksReady);

  const projectZip = zip.folder(zipName);

  const projectComposeContent = fs.readdirSync(composePath, { withFileTypes: true })
    .filter(file => !file.isDirectory())
    .map(file => ({
      name: file.name,
      data: fs.readFileSync(join(composePath, file.name))
    }));

  projectComposeContent.forEach(file => {
    projectZip.file(file.name, file.data, { binary: true });
  });

  const zipFolder = await zip.generateAsync({ type: 'blob' });

  const zipBuffer = Buffer.from(await zipFolder.arrayBuffer());

  fs.writeFileSync(zipPath, zipBuffer);

  res.send(zipBuffer);
};

export const viewProject = async (req, res) => {
  const { project: projectId } = req.query;

  const project = await Project.findOne({
    orderID: projectId
  });

  if (!project) {
    res.sendStatus(404);
    return;
  }

  const { shop, customerID } = project;

  const isLoggedCustomer = fs.existsSync(join(cdnPath, shop, customerID));

  const projectPath = isLoggedCustomer
    ? join(cdnPath, shop, customerID, 'orders', projectId)
    : join(cdnPath, shop, 'anonims', customerID, 'orders', projectId);

  if (!fs.existsSync(projectPath)) {
    res.sendStatus(400);
    return;
  }

  const state = JSON.parse(fs.readFileSync(join(projectPath, 'state.json')));

  const blocks = state.view.blocks;

  res.render('project-view', { 
    state: JSON.stringify(state),
    blocks,
    product: state.product
  });
}