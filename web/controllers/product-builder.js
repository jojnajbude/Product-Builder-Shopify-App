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

  const options = ['rotate', 'flip', 'flop', 'crop', 'resize', 'filter', 'thumbnail', 'format', 'container', 'background'];

  const config = Object.keys(req.query)
    .reduce((obj, key) => {
      if (options.includes(key) && req.query[key]) {
        if (key === 'background') {
          try {
            const backgroundColor = JSON.stringify(req.query[key]);

            if (backgroundColor.includes('rgb')) {
              const rgb = backgroundColor.match(/\d+/g).map(item => +item);

              obj[key] = {
                r: rgb[0] ?? 255,
                g: rgb[1] ?? 255,
                b: rgb[2] ?? 255,
                alpha: rgb[3] ?? 1
              };
            } else {
              obj[key] = '#' + req.query[key];
            }
          } catch {
            return obj;
          }

          return obj;
        }

        try { 
          obj[key] = JSON.parse(req.query[key]);
        } catch {
          try {
            obj[key] = parseFloat(req.query[key]);
          } catch {
            obj[key] = req.query[key];
          }
        }
      } 

      return obj;
    }, {})
 
  if (!fs.existsSync(path)) {
    res.sendStatus(400);
    return;
  }
 
  let file = sharp(path);

  const metadata = await file.metadata();

  const { width, height } = metadata;  

  const {
    flip,
    flop,
    rotate = 0,
    crop = 1,
    resize = [width, height],
    thumbnail,
    format = 'jpeg',
    container,
    background = { r: 255, g: 255, b: 255, alpha: 1 }
  } = config;

  if (thumbnail && typeof thumbnail !== 'boolean') { 
    res.sendStatus(400);
    return;
  }
  
  file = rotateImage(file, flip, flop, rotate, background);

  if (!resize || resize.some(item => !item)) {
    res.sendStatus(400);
    return;
  }

  if (!thumbnail) {
    file = await resizeImage(file, resize, width, height, rotate, background); 
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

  file = await cropImage(file, crop, background); 

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

  if (container && Array.isArray(container)) {
    const [contWidth, contHeight] = container;

    if (contWidth && contHeight || typeof contWidth === 'number' || typeof contHeight === 'number') {
      file = await file
        .toBuffer();
  
      file = sharp(file)
        .resize({
          width: contWidth,
          height: contHeight
        }); 
    }
  }

  const readyFile = await file.toBuffer();
 
  res.send(readyFile);
}

const rotateImage = (file, flip, flop, rotate, background) => {
  if (flip && typeof flop === 'boolean') {
    file = file.flip();
  }
 
  if (flop && typeof flop === 'boolean') {
    file = file.flop();
  } 

  if (rotate && typeof rotate === 'number' && rotate > 0 && rotate < 360) {
    file = file
      .rotate(rotate, { background: background })
  }

  return file;
}

const resizeImage = async (file, resize, width, height, rotate, background) => {
  const [resizeWidth, resizeHeight] = resize;

  const [rotateWidth, rotateHeight] = await new Promise(res => {
        file.toBuffer((err, buffer, info) => {
          res([info.width, info.height])
        });
    });

  if (resize && Array.isArray(resize) && rotateWidth && rotateHeight) { 

    if (rotateWidth <= resizeWidth && rotateHeight <= resizeHeight) {
      const horizontal = rotateWidth > resizeWidth ? 0 : Math.round((resizeWidth - rotateWidth) / 2);
      const vertical = rotateHeight > resizeHeight ? 0 : Math.round((resizeHeight - rotateHeight) / 2);
  
      file = file.extend({ 
        top: vertical,
        left: horizontal,
        right: horizontal, 
        bottom: vertical,
        background: background,
      }).resize({
        width: width,
        height: height
      });
    }
  }

  let afterWidth, afterHeight;

  const isResize = (rotateWidth > resizeWidth || rotateHeight > resizeHeight)
    || (rotateWidth === rotateHeight && height !== width)
    || (height > width)
    || (
      height === width
      && rotate !== 0
      && rotate % 90 !== 0
      && rotateWidth === rotateHeight
    );

  if (isResize) {
    afterWidth = resizeWidth;
    afterHeight = resizeHeight;
  } else {
    afterWidth = rotateWidth;
    afterHeight = rotateHeight;
  }

  file = file.resize({
    width: afterWidth,
    height: afterHeight,
    fit: 'contain',
    background: background,
  });

  return file;
}

const cropImage = async (file, crop, background) => {
  const [width, height] = await new Promise(res => {
    file.toBuffer((err, buffer, info) => res([info.width, info.height]));
  });

  const zoom = crop;

  const [zoomedWidth, zoomedHeight] = [Math.ceil(width * zoom), Math.ceil(height * zoom)];

  if (crop !== 1 && crop > 1 && crop <= 4) {
    file.resize({
      width: zoomedWidth,
      height: zoomedHeight,
    });

    const newBuffer = await file.toBuffer();

    file = sharp(newBuffer, { limitInputPixels: false });

    const [newWidth, newHeight] = await new Promise(res => {
      file.toBuffer((err, buffer, info) => {
        if (!err) {
          res([info.width, info.height])
        }
      });
    });

    const extractWidth = Math.round(newWidth / zoom * 1);
    const extractHeight = Math.round(newHeight / zoom * 1);

    const horizontal = Math.round((newWidth - extractWidth) / 2);
    const vertical = Math.round((newHeight - extractHeight) / 2);

    file.extract({
      top: vertical,
      left: horizontal,
      width: extractWidth,
      height: extractHeight
    }).resize({
      width,
      height
    });
  }

  return file
}
  