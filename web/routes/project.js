import { Router, json, urlencoded } from 'express';
import multer from "multer";
import fs from 'fs';

import { composeProject, createProject, deleteProject, getCustomer, getImageFromUrl, getProjectInfo, getProjectPath, getProjectState, updateProject, updateProjectStatus, viewProject } from '../controllers/order.js';

import { join } from 'path';
import cron from 'node-cron';
import Project from '../models/Projects.js';
import shopifyOrders from './shopify-order.js';
import { decryptPassword } from '../utils/password_hashing.js';
import Order from '../models/Order.js';

import { deleteFile, downloadFile, existsFile, readDirectory, uploadFile, uploadImage } from '../utils/cdnApi.js';

const imageStorage = multer.memoryStorage();

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1048576 * 40
  }
});

cron.schedule('* */30 * * * *', async (now) => {
  const anonimsProjects = await Project.find({
    logged: false,
    status: 'draft',
  }).limit(50);

  const toDelete = anonimsProjects.filter(project => {
    const timeDiff = (now - project.updatedAt) / 1000;
    return timeDiff >= 10 * 24 * 60 * 60;
  });

  const deleted = await Promise.all(toDelete.map(project => {
    return new Promise(res => {
      Project.deleteOne({
        projectId: project.projectId
      }).then(_ => res(project));
    })
  }))

  deleted.map(async project => {
    const { projectId: id, shop, customerID, logged } = project;

    const path = logged
      ? join(cdnPath, shop, customerID, 'projects', id)
      : join(cdnPath, shop, 'anonims', customerID, 'projects', id);

    if ((await existsFile(path))) {
      deleteFile(path, { isDirectory: true });
    }
  });
});

cron.schedule('* */45 * * *', async () => {
  const shops = (await readDirectory(cdnPath))
    .filter(shop => {
      return shop.IsDirectory && shop.ObjectName.endsWith('myshopify.com');
    })
    .map(shop => shop.ObjectName);

  shops.forEach(async shop => {
    const anonimsPath = join(cdnPath, shop, 'anonims');
    
    if (!(await existsFile(anonimsPath))) {
      return;
    }

    const anonims = (await readDirectory(anonimsPath))
      .filter(user => user.IsDirectory)
      .map(user => user.ObjectName);

    // console.log(anonims);

    anonims.forEach(async anonim => {
      const anonimPath = join(cdnPath, shop, 'anonims', anonim);

      if (!(await existsFile(anonimPath))) {
        return;
      }

      const projectsPath = join(anonimPath, 'projects');

      if (!(await existsFile(projectsPath))) {
        await deleteFile(anonimPath);
      }

      const projects = (await readDirectory(join(anonimPath, 'projects')))
        .filter(project => project.IsDirectory && project.ObjectName.startsWith('draft'));

      if (!projects.length) {
        console.log('anonim has been deleted:', anonim);
        // console.log(anonimPath);
        deleteFile(anonimPath, { isDirectory: true });

        // console.log(await readDirectory(anonimPath));
      }
    })
  })
})

// const cdnPath = join(process.cwd(), 'frontend', 'product-builder', 'src', 'uploads');
const cdnPath = 'shops';

const projects = Router();

projects.use('/shopify', shopifyOrders);

projects.get('/view', viewProject);

projects.get('/compose', composeProject);

// projects.get('/generatePDF', async (req, res) => {
//   const { project: hashedProject } = req.query;

//   const projectId = decryptPassword(hashedProject, process.env.PASSWORD_SECRET);

//   const project = await Project.findOne({
//     projectId: projectId
//   });

//   if (!project) { 
//     res.sendStatus(404);  
//     return;
//   }  

//   const {
//     shop,
//     customerID,
//     logged
//   } = project;

//   const pdfPath = logged
//     ? join(cdnPath, shop, customerID, 'orders', projectId)
//     : join(cdnPath, shop, 'anonims', customerID, 'orders', projectId)

//   const url = `${process.env.HOST}/product-builder/orders/view?project=${hashedProject}&pdf=true`;
 
//   const browser = await puppeteer.launch({ headless: 'new' });
//   const page = await browser.newPage();

  
//   await page.goto(url, {
//     waitUntil: 'networkidle0'
//   });
  
//   await page.emulateMediaType('print');

//   const pdf = await page.pdf({
//     path: join(pdfPath, 'project.pdf'),
//     margin: {
//       top: '0px',
//       right: '0px',
//       bottom: '0px',
//       left: '0px',
//     },
//     printBackground: true,
//     format: 'A4',
//     scale: 1
//   });

//   await browser.close();

//   fs.createReadStream(join(pdfPath, 'project.pdf'))
//     .pipe(res);
// });
 
projects.post('/create', json(), getProjectPath, createProject);

projects.post('/update/:orderId', updateProjectStatus, json(), getProjectPath, updateProject);

projects.get('/checkout/:orderId', getProjectPath, async (req, res) => {
  const { id } = req.project;

  const project = await Project.findOne({
    projectId: id
  });

  if (!project) {
    res.send({
      error: 'No project'
    });
    return;
  }

  project.set('status', 'active');

  await project.save()

  res.sendStatus(200);
});

projects.post('/cart/check', json(), async (req, res) => {
  const { id: customerId, shop } = req.query;
  const { projects } = req.body;

  const userPath = customerId.split('-').length > 1
    ? join(cdnPath, shop, 'anonims', customerId, 'orders')
    : join(cdnPath, shop, customerId, 'orders');

  const isUserExist = await existsFile(userPath);

  if (!isUserExist) {
    res.send({
      error: "User doesn't exists"
    });
    return;
  }

  const projectExists = projects.reduce(async (result, project) => {
    const isExist = await existsFile(join(userPath, project));

    return {
      ...result,
      [project]: isExist
    }
  }, {});

  res.send(projectExists);
})

projects.get('/list/:customerId', async (req, res) => {
  const { customerId } = req.params; 

  const { shop, status } = req.query;

  console.log(customerId);

  if (!customerId) {
    res.send({
      error: {
        message: 'Id or anonimId has not provided' 
      }
    });
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

  const projects = await Project.find({
    shop,
    customerID: customerId
  });

  res.setHeader('Content-Type', 'application/json');

  res.send(projects);
});

projects.get('/info/:orderId', getProjectPath, getProjectInfo);

projects.get('/state/:orderId', getProjectPath, getProjectState);

projects.delete('/delete/:orderId', getProjectPath, deleteProject); 

projects.post('/uploads', imageUpload.single('images'), async (req, res) => {
  const file = req.file;
  
  const { customerId, shop, anonimId } = req.query;

  const fileName = Date.now() + '.' + file.originalname.split('.').pop();

  const path = customerId
    ? join(shop, customerId)
    : join(shop, 'anonims', anonimId);

  const response = await uploadImage(path, fileName, file); 

  if (!file) {
    res.sendStatus(400);
    return;
  }

  res.send(response);
});

projects.get('/*', (req, res) => {
  res.setHeader('Content-Type', 'application/liquid');

  res.sendFile(join(process.cwd(), 'product-builder', 'projects.liquid'));
});

export default projects; 