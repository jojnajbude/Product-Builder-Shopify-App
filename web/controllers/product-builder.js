import fs from 'fs';
import { join } from 'path';

import sharp from 'sharp';

const PROXY_PATH = `${process.cwd()}/frontend/product-builder/src`;

export const getUploadPath = (params) => {
  if (!params) {
    return;
  }

  const { shop, customerId, anonimId, fileName } = params;

  if (anonimId) {
    return join('product-builder/uploads', shop, 'anonims', anonimId, 'uploads', fileName);
  }

  return join('product-builder/uploads', shop, customerId, 'uploads', fileName);
}

export const removeImage = (req, res) => {
  const { imageURL } = req.body;

  const urlPath = new URL(imageURL).pathname;

  const filePath = join(PROXY_PATH, urlPath.split('/product-builder/').pop());

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  res.sendStatus(200);
};

export const getCustomerUploads = (req, res) => {
  const { logged_in_customer_id: customerId, anonimId, shop } = req.query;

  const path = customerId
    ? join(PROXY_PATH, 'uploads', shop, customerId, 'uploads')
    : join(PROXY_PATH, 'uploads', shop, 'anonims', anonimId, 'uploads');

  if (customerId && !anonimId && fs.existsSync(path) ) {
    const uploads = fs.readdirSync(path, { withFileTypes: true })
      .map(file => getUploadPath({ shop, customerId, fileName: file.name }));

    res.send(uploads);
    return;
  } else if (!customerId && anonimId && fs.existsSync(path)) {
    const uploads = fs.readdirSync(path, { withFileTypes: true })
      .map(file => getUploadPath({ shop, anonimId, fileName: file.name }));

    res.send(uploads);
    return;
  }

  res.send({
    error: 'directrory not exists'
  });
}

export const sharpImage = async (req, res) => {

  const pathArr = req.path.split('/');

  const startFrom = pathArr.indexOf('product-builder') + 1;

  const path = join(process.cwd(), 'frontend/product-builder/src', ...pathArr.slice(startFrom));

  const options = ['rotate', 'flip', 'flop', 'crop', 'resize', 'filter', 'thumbnail', 'format'];

  const config = Object.keys(req.query)
    .reduce((obj, key) => {
      if (options.includes(key) && req.query[key]) {
        try {
          obj[key] = JSON.parse(req.query[key]);
        } catch {
          obj[key] = req.query[key];
        }
      }

      return obj;
    }, {})

  let file = sharp(path);

  const metadata = await file.metadata();

  const { width, height } = metadata; 

  const { flip, flop, rotate = 0, crop, resize = [width, height], thumbnail, format = 'jpeg' } = config;

  if (thumbnail && typeof thumbnail !== 'boolean') {
    res.sendStatus(400);
    return;
  }
  
  file = rotateImage(file, flip, flop, rotate);

  let degree = rotate;

  if (rotate >= 270 && rotate <= 360) {
    degree = 360 - rotate;
  } else if (rotate >= 180) {
    degree = 270 - rotate;
  } else if (rotate >= 90) {
    degree = 180 - rotate;
  }

  // const radians = Math.ceil((Math.PI / 180) * degree * 100) / 100;

  // const rotateWidth = Math.round((width * Math.cos(radians)) + (height * Math.sin(radians)));
  // const rotateHeight = Math.round((width * Math.sin(radians)) + (height * Math.cos(radians)));

  const [rotateWidth, rotateHeight] = await new Promise(res => {
        file.toBuffer((err, buffer, info) => res([info.width, info.height]));
    });

  if (resize && Array.isArray(resize) && rotateWidth && rotateHeight && !thumbnail) {
    const [resizeWidth, resizeHeight] = resize;

    if (rotateWidth > resizeWidth || rotateHeight > resizeHeight) {
      // if (rotateWidth > resizeWidth && rotateHeight < resizeHeight) { 
      //   const vertical = Math.round((resizeHeight - rotateHeight) / 2);
      //   console.log('height');
      //   file = file.extend({
      //     top: vertical,
      //     left: 0,
      //     right: 0,
      //     bottom: vertical,
      //     background: { r: 255, g: 255, b: 255, alpha: 1 },
      //   })
      // }

      if (rotateHeight > resizeHeight && rotateWidth < resizeWidth)  {
        const horizontal = Math.round((resizeWidth - rotateWidth) / 2);
        console.log('WIDTH');
        file = file.extend({
          top: 0,
          left: horizontal,
          right: horizontal,
          bottom: 0,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
      }

      console.log(rotateWidth, rotateHeight, resizeHeight);
      file = file.resize({
        width: resizeWidth,
        height: resizeHeight
      });
    } else {
      const horizontal = rotateWidth > resizeWidth ? 0 : Math.round((resizeWidth - rotateWidth) / 2);
      const vertical = rotateHeight > resizeHeight ? 0 : Math.round((resizeHeight - rotateHeight) / 2);

      console.log(resizeWidth, resizeHeight, horizontal, vertical);

      console.log(width, height, rotateWidth, rotateHeight)
  
      file = file.extend({ 
        top: vertical,
        left: horizontal,
        right: horizontal, 
        bottom: vertical,
        background: { r: 255, g: 255, b: 255, alpha: 1 },
      }).resize({
        width: width,
        height: height
      });

      console.log(width);
    }
  }

  if (!thumbnail) {
    file = file.resize({
      width: rotateWidth,
      height: rotateHeight,
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    });
  } else {
    const [resizeWidth, resizeHeight] = resize;

    file = file.resize({
      width: resizeWidth,
      height: resizeHeight,
    });

    const readyFile = await file
    .withMetadata()
    .webp()
    .toBuffer();
 
    res.send(readyFile);  
    return;
  }

  switch (format) {
    case 'webp':
      res.setHeader('Content-Type', 'image/webp');

      file = file.webp() 
      break;
    case 'jpeg':
    default:
      res.setHeader('Content-Type', 'image/jpeg');

      file = file
        .withMetadata()
        .jpeg()
      break;
  }
 
  const readyFile = await file
    .toBuffer(); 
 
  res.send(readyFile);
}

const rotateImage = (file, flip, flop, rotate) => {
  if (flip && typeof flop === 'boolean') {
    file = file.flip();
  }
 
  if (flop && typeof flop === 'boolean') {
    file = file.flop();
  } 

  if (rotate && typeof rotate === 'number' && rotate > 0 && rotate < 360) {
    file = file
      .rotate(rotate, { background: { r: 255, g: 255, b: 255, alpha: 1 } })
  }

  return file;
}