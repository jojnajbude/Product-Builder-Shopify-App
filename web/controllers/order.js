import { join } from 'path';
import fs from 'fs';
import JSZip from 'jszip';

import CryptoJS from 'crypto-js';

import Order from '../models/Order.js';

import makeCode from '../utils/makeCode.js';
import Project from '../models/Projects.js';
import { decryptPassword, encryptPassword } from '../utils/password_hashing.js';
import { createDir, deleteFile, downloadFile, existsFile, readDirectory, uploadFile } from '../utils/cdnApi.js';

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

export const updateProjectStatus = async (req, res, next) => {
  const { status } = req.query;
  const { orderId: projectId } = req.params;

  if (status) {
    const project = await Project.findOne({ projectId });

    console.log(project, projectId)

    if (!project) {
      res.status(404).send({
        error: {
          message: 'Project not found'
        }
      });
      return;
    }

    project.set('status', status);
    await project.save();

    res.status(200).send({
      success: 'Status updated'
    });
    return;
  }

  next();
} 

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

  const { inactive = false, status = null } = req.query;

  const isExist = await existsFile(path);

  if (!isExist) {
    res.send({
      error: {
        message: "Project's id is incorrect, can't to delete project"
      }
    });
    return;
  }

  if (inactive === 'true') {
    const project = await Project.findOne({
      projectId: id
    });

    project.set('status', 'draft');

    const newProject = await project.save();

    res.send({
      correct: 'Set status of project to draft'
    });
    return;
  }

  await deleteFile(path, { isDirectory: true });

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

async function UploadImagesFromBlock(state, uploadPath) {
  const blocks = state.view.blocks
    .filter(block => block.childBlocks.some(child => child.imageUrl))
    .map(block => {
      const { backgroundColor = { value: 'rgb(255,255,255)' }, layout } = block.settings;

      return ({
        id: block.id,
        images: block.childBlocks
          .filter(child => child.imageUrl)
          .map(child => ({
            url: child.imageUrl,
            settings: child.settings,
            resolution: child.resolution
          }))
          .map(image => {
            const { crop, rotate } = image.settings;
  
            const cropValue = 1 + (Math.round((crop.value / 50) * 100) / 100);
  
            const { width, height } = image.resolution || {
              width: 10,
              height: 10
            };
  
            const resize = width && height
              ? [width, height]
              : null; 
  
            const type = block.type === 'polaroid'
              ? '&type=polaroid'
              : '';
  
            let editedUrl;
  
            switch(block.type) {
              case 'polaroid':
                const textBlock = block.childBlocks.find(child => child.type === 'text');
  
                // console.log(textBlock.settings);
  
                const textSettings = Object.assign({
                  align: 'center',
                  font: 'Times New Roman',
                  fontStyle: {
                    bold: false,
                    italic: false,
                    underline: false
                  },
                  text: ''
                }, textBlock.settings);
  
                const { align, font, fontStyle: { bold, italic, underline }, text} = textSettings;
  
                const textQuery = `align=${align}&font=${font}&bold=${bold}&italic=${italic}&underline=${underline}&text=${text.split('\n').join('0x0A')}`;
  
                editedUrl = image.url + `?${
                  resize
                    ? `resize=${JSON.stringify(resize)}&`
                    : ''
                  }crop=${cropValue}&rotate=${rotate.value}&background=${backgroundColor.value}
                  &type=polaroid&${textQuery}
                `;
                break;
              case 'tiles':
                editedUrl = image.url + `?${
                  resize
                    ? `resize=${JSON.stringify(resize)}&`
                    : ''
                  }crop=${cropValue}&rotate=${rotate.value}&background=${backgroundColor.value}
                  &type=${layout.layout}
                `
                break;
              default:
                editedUrl = image.url + `?${
                  resize
                    ? `resize=${JSON.stringify(resize)}&`
                    : ''
                  }crop=${cropValue}&rotate=${rotate.value}&background=${backgroundColor.value}`
                break;
            }

            return { 
              original: image.url,
              edited: editedUrl
            }
          })
      })
    });
 
  const blocksReady = blocks.map((block, idx) => new Promise(async (res, rej) => {
    const images = block.images.map(image => new Promise(async res => {
      const edited = await getImageFromUrl(image.edited);
      // const [original, edited] = await Promise.all([
      //   getImageFromUrl(image.original),
      //   getImageFromUrl(image.edited)
      // ])

      res({
        edited
      });
    }));

    const imagesBuffers = await Promise.all(images); 

    const imagesDownloads = imagesBuffers.map((image, imageIdx) => {
      // const originalName = `block-${idx + 1}-image-${imageIdx + 1}-original.jpg`;
      const editedName = `block-${idx + 1}.jpg`;

      return Promise.all([
        // uploadFile(uploadPath, originalName, Buffer.from(image.original)),
        uploadFile(uploadPath, editedName, Buffer.from(image.edited))
      ])
    });

    await Promise.all(imagesDownloads);

    res();
  }));

  return Promise.all(blocksReady);
}

export const composeProject = async (req ,res) => {
  const zip  = new JSZip();

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
          id: isAnonim ? item.properties.find(prop => prop.name === 'anonim_id').value : String(order.customer.id),
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

  await UploadImagesFromBlock(state, composePath);

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

export const composeOrder = async (req, res) => {
  const zip  = new JSZip();
  const { order: orderId } = req.query;

  if (!orderId) {
    res.send({
      error: {
        message: "Order's id not provided"
      }
    });
    return;
  }

  const order = await Order.findOne({ shopify_id: orderId });

  if (!order) {
    res.send({
      error: {
        message: "Order doesn't exist"
      }
    });
    return;
  }

  const projects = await Promise.all(order.line_items
    .filter(item => item.properties.find(prop => prop.name === 'project_id'))
    .map(async item => {
      const projectId = item.properties.find(prop => prop.name === 'project_id').value;

      const project = await Project.findOne({ projectId });

      return project;
    }));

  const orderName = `Order-${order.order_number}(${order.customer.email})`;

  const orderZip = zip.folder(orderName);

  const projectsZips = projects.map(async project => {
    if (!project) {
      return;
    }

    const {
      shop,
      customerID,
      projectId,
      logged
    } = project;

    const { customer } = order;

    const projectPath = logged
      ? join(cdnPath, shop, customerID, 'projects', projectId)
      : join(cdnPath, shop, 'anonims', customerID, 'projects', projectId);

    const projectComposeName = `${project.product.title.split('/').join('-')} - ${
      customer.name && customer.lastName
        ? `${customer.name} ${customer.lastName}(${customer.email})`
        : `${customer.email || customer.id}`
    }`;

    const projectZip = orderZip.folder(projectComposeName);

    if ((await existsFile(join(projectPath, projectComposeName)))) {
      const projectComposeContent = (await readDirectory(join(projectPath, projectComposeName)))
        .filter(file => !file.IsDirectory)
        .map(async file => ({
          name: file.ObjectName,
          data: await downloadFile(join(projectPath, projectComposeName, file.ObjectName))
        }));

      (await Promise.all(projectComposeContent))
        .forEach(file => {
          projectZip.file(file.name, file.data, { binary: true });
        });

      return;
    } else {
      let state;

      try {
        state = JSON.parse(await downloadFile(projectPath, 'state.json'));
      } catch {
        return;
      }
      

      await UploadImagesFromBlock(state, join(projectPath, projectComposeName));

      const projectComposeContent = (await readDirectory(join(projectPath, projectComposeName)))
        .filter(file => !file.IsDirectory)
        .map(async file => ({
          name: file.ObjectName,
          data: await downloadFile(join(projectPath, projectComposeName, file.ObjectName))
        }));

      (await Promise.all(projectComposeContent))
        .forEach(file => {
          projectZip.file(file.name, file.data, { binary: true });
        });

      return;
    }
  });

  await Promise.all(projectsZips);

  console.log(orderName);

  const zipFolder = await zip.generateAsync({ type: 'blob' });

  const zipBuffer = Buffer.from(await zipFolder.arrayBuffer());

  res.send(zipBuffer);
}

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