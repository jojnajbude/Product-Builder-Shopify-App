import { join } from 'path';
import fs from 'fs';
import JSZip from 'jszip';

import CryptoJS from 'crypto-js';

import Order from '../models/Order.js';

import makeCode from '../utils/makeCode.js';
import Project from '../models/Projects.js';
import { decryptPassword, encryptPassword } from '../utils/password_hashing.js';
import { createDir, deleteFile, downloadFile, existsFile, readDirectory, uploadFile } from '../utils/cdnApi.js';

const zip  = new JSZip();

const frontPath = join(process.cwd(), 'frontend', 'product-builder', 'src');

const cdnPath = 'shops';

export const getCustomer = async (path) => {
  const uploads = join(path, 'uploads');

  const draftPath = join(path, 'projects');

  if (!(await existsFile(draftPath))) {
    const response = await createDir(join(path, 'projects'));

    console.log('response', response);
  }

  return uploads;
}

export const getProjectPath = async (req, res, next) => {
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

  const isLoggedCustomer = await existsFile(join(cdnPath, shop, customerId));

  const isAnoninCustomer = isLoggedCustomer
    ? false
    : await existsFile(join(cdnPath, shop, 'anonims', customerId));

  if (!isLoggedCustomer && !isAnoninCustomer) {
    res.send({
      error: {
        message: "User's id doesn't exists"
      }
    });
    return;
  }

  const createdAt = Date.now();

  const projectId = req.params.orderId ? req.params.orderId : `draft-${createdAt}-${makeCode(5)}`;

  const projectPath = isLoggedCustomer
    ? join(cdnPath, shop, customerId, 'projects', projectId)
    : join(cdnPath, shop, 'anonims', customerId, 'projects', projectId);

  req.project = {
    path: projectPath,
    id: projectId,
    createdAt,
    isLoggedCustomer
  }

  next();
}

export const createProject = async (req, res) => {
  const { path: projectPath, id: projectId, createdAt, isLoggedCustomer } = req.project;

  const { id: customerID, shop } = req.query;

  const { status } = req.query;

  const isExist = await existsFile(projectPath);

  if (isExist) {
    res.send({
      error: {
        message: 'Project is exists'
      }
    });
    return;
  }

  await createDir(projectPath);

  const state = req.body;

  await uploadFile(projectPath, 'state.json', Buffer.from(JSON.stringify(state)));

  const quantity = state.view.blocks.reduce((sum, block) => sum + block.count, 0);

  const project = new Project({
    projectId: projectId,
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

export const updateProject = async (req, res) => {
  const { path: projectPath, id } = req.project;

  const state = req.body;

  const project = await Project.findOne({
    projectId: id
  });

  const { product } = state;

  if (product) {
    const { imageUrl, handle, type, title, status, shopify_id, price } = product;

    project.set('product', { imageUrl, handle, type, title, status, shopify_id, price });
  }

  project.set('quantity', state.view.blocks.reduce((sum, block) => sum + block.count, 0));

  project.set('updatedAt', Date.now());

  await project.save();

  await uploadFile(projectPath, 'state.json', Buffer.from(JSON.stringify(state)));

  res.sendStatus(200); 
};
 
export const getProjectInfo = async (req, res) => {
  const { id } = req.project;

  const project = await Project.findOne({
    projectId: id
  });

  if (!project) {
    res.send({
      error: "User doesn't have access to this project"
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  res.status(200).send(project);
};

export const getProjectState = async (req, res) => {
  const { path: projectPath, id: projectId, createdAt } = req.project;

  const isExist = await existsFile(join(projectPath, 'state.json'));

  if (!isExist) {
    res.send({
      error: {
        message: 'No such project in directory'
      }
    });
    return;
  }

  const state = await downloadFile(projectPath, 'state.json');

  res.send(state);
}

export const deleteProject = async (req, res) => {
  const { id, path } = req.project;

  const { inactive } = req.query;

  const isExist = await existsFile(path);

  if (!isExist) {
    res.send({
      error: {
        message: "Project's id is incorrect, can't to delete project"
      }
    });
    return;
  }


  if (inactive) {
    const project = await Project.findOne({
      projectId: id
    });

    project.set('status', 'draft');

    await project.save();

    res.send({
      correct: 'Set status of project to draft'
    });
    return;
  }

  await deleteFile(path);

  await Project.deleteOne({
    projectId: id
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
}; 

export const composeProject = async (req ,res) => {
  const { order_id, project_id } = req.query;

  const [ order, project ] = await Promise.all([
    Order.findOne({
      shopify_id: order_id
    }),
    Project.findOne({
      projectId: project_id
    })
  ]);

  if (!project) {
    res.send({
      error: {
        message: 'no project'
      }
    });
    return;
  }

  if (!order) {
    res.send({
      error: {
        message: 'no order'
      }
    });
    return;
  }

  const lineItem = order.line_items
    .filter(item => item.properties.some(prop => prop.name === 'project_id'))
    .map((item, _, arr) => {
      const isAnonim = arr.every(item => item.properties.find(item => item.name === 'anonim_id'));

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
        projectId: item.properties.find(prop => prop.name === 'project_id').value
      }
    }).find(item => item.projectId === project_id);

  const { customer } = lineItem;

  const projectPath = customer.id.split('-').length === 2
    ? join(cdnPath, lineItem.shop, 'anonims', customer.id, 'projects', lineItem.projectId)
    : join(cdnPath, lineItem.shop, customer.id, 'projects', lineItem.projectId);
  
  const composeName = `${project.product.title.split('/').join('-')} - ${
    customer.name && customer.lastName
      ? `${customer.name} ${customer.lastName}(${customer.email})`
      : `${customer.email || customer.id}`
  }`;

  const composePath = join(projectPath, composeName);
  const zipPath = join(projectPath, composeName + '.zip');

  const zipName = composePath.split('/').pop();

  if (await existsFile(zipPath)) {
    const zip = await downloadFile(zipPath);

    res.send(zip);
    return;
  }

  project.set('status', 'composing');

  await project.save();

  const pdfURL = `${process.env.HOST}/product-builder/orders/generatePDF?project=${
    encryptPassword(project.orderID, process.env.PASSWORD_SECRET)
  }`;

  if (await existsFile(composePath)) {
    const zipName = composeName.split('/').pop();

    // const pdf = await fetch(pdfURL)
    //   .then(response => {
    //     if (!response.ok) {
    //       return response;
    //     }

    //     return response.blob()
    //   })

    // if (!pdf.ok && !(pdf instanceof Blob)) {
    //   res.sendStatus(400);
    //   return;
    // }

    const projectZip = zip.folder(zipName);

    const projectComposeContent = (await readDirectory(composePath))
      .filter(file => !file.IsDirectory)
      .map(async file => ({
        name: file.ObjectName,
        data: await downloadFile(join(composePath, file.ObjectName))
      }));

    (await Promise.all(projectComposeContent)).forEach(file => {
      projectZip.file(file.name, file.data, { binary: true });
    });

    // projectZip.file('project.pdf', Buffer.from(await pdf.arrayBuffer()));

    const zipFolder = await zip.generateAsync({ type: 'blob' });

    const zibBuffer = Buffer.from(await zipFolder.arrayBuffer());

    await uploadFile(projectPath, composeName + '.zip', zibBuffer)

    res.send(zibBuffer);

    project.set('status', 'complete');
    project.save();

    return;
  }

  // const pdf = await fetch(pdfURL)
  //   .then(response => {
  //     if (!response.ok) {
  //       return response;
  //     }

  //     return response.blob()
  //   })

  // if (!pdf.ok && !(pdf instanceof Blob)) {
  //   res.sendStatus(400);
  //   return;
  // }

  const state = JSON.parse(await downloadFile(join(projectPath, 'state.json')));

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

  const blocksReady = blocks.map((block, idx) => new Promise(async (res, rej) => {
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

    const imagesDownloads = imagesBuffers.map((image, imageIdx) => {
      const originalName = `block-${idx + 1}-image-${imageIdx + 1}-original.jpg`;
      const editedName = `block-${idx + 1}-image-${imageIdx + 1}-edited.jpg`;

      return Promise.all([
        uploadFile(composePath, originalName, Buffer.from(image.original)),
        uploadFile(composePath, editedName, Buffer.from(image.edited))
      ])
    });

    await Promise.all(imagesDownloads);

    res();
  }));

  await Promise.all(blocksReady);

  const projectZip = zip.folder(zipName);

  const projectComposeContent = (await readDirectory(composePath))
    .filter(file => !file.IsDirectory)
    .map(async file => ({
      name: file.ObjectName,
      data: await downloadFile(join(composePath, file.ObjectName))
    }));

  (await Promise.all(projectComposeContent)).forEach(file => {
    projectZip.file(file.name, file.data, { binary: true });
  });


  // projectZip.file('project.pdf', Buffer.from(await pdf.arrayBuffer()));

  const zipFolder = await zip.generateAsync({ type: 'blob' });

  const zipBuffer = Buffer.from(await zipFolder.arrayBuffer());

  await uploadFile(projectPath, composeName + '.zip', zipBuffer);

  res.send(zipBuffer);

  project.set('status', 'complete');
  project.save();
};

export const viewProject = async (req, res) => {
  const { project: projectHash, pdf = false } = req.query;

  const projectId = decryptPassword(projectHash, process.env.PASSWORD_SECRET);

  const project = await Project.findOne({
    projectId: projectId
  });

  if (!project) {
    res.status(404).send({
      error: {
        message: `no valid project - ${projectId}`
      }
    });
    return;
  }

  const { shop, customerID } = project;

  const isLoggedCustomer = await existsFile(join(cdnPath, shop, customerID));

  const projectPath = isLoggedCustomer
    ? join(cdnPath, shop, customerID, 'projects', projectId)
    : join(cdnPath, shop, 'anonims', customerID, 'projects', projectId);

  if (!(await existsFile(projectPath))) {
    res.status(400).send({
      error: {
        message: `no valid project path - ${projectId}`
      }
    });
    return;
  }

  const state = JSON.parse(await downloadFile(join(projectPath, 'state.json')));

  const [ mainCss, viewCss ] = await Promise.all([
    fetch(`${process.env.HOST}/product-builder/assets/main.css`).then(res => res.text()),
    fetch(`${process.env.HOST}/product-builder/assets/project-view.css`).then(res => res.text()),
  ])

  const blocks = state.view.blocks;

  res.render('project-view', { 
    state: JSON.stringify(state),
    blocks,
    product: state.product,
    mainCss,
    viewCss,
    pdf: true
  });
};