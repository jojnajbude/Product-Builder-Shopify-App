import fs from 'fs';
import { join } from 'path';

import sharp from 'sharp';
import { deleteFile, downloadFile, existsFile, readDirectory } from '../utils/cdnApi.js';
import { PhotobookElement } from './layouts.js';

const PROXY_PATH = `${process.cwd()}/frontend/product-builder/src`;

const textOptions = ['bold', 'align', 'font', 'italic', 'underline', 'text', 'color', 'fontSize'];

const options = [
  'rotate', 'flip', 'flop', 'crop',
  'resize', 'filter', 'thumbnail', 'format',
  'container', 'background', 'type', 'borderRadius', 'layout',
  ...textOptions
];

const getRGBValue = (color) => {
  if (typeof color !== 'string') {
    return new Error('color must be a string');
  }

  if (!color) {
    return {
      r: 255,
      b: 255,
      g: 255,
      alpha: 1
    }
  }

  const [ r, g, b, alpha = 1] = color.match(/\d+/gm).map(item => +item);

  return { r, g, b, alpha };
}

const getFontColor = (color) => {
  if (!color) {
    return;
  }

  const { r, g, b } = color;

  if (((255 + 255 + 255) / 2) >= (r + g + b)) {
    return 'white';
  }

  return 'black';
}

export const getUploadPath = (params) => {
  if (!params) {
    return;
  }

  const { shop, customerId, anonimId, fileName } = params;

  if (anonimId) {
    return join('product-builder', shop, 'anonims', anonimId, 'uploads', fileName);
  }

  return join('product-builder', shop, customerId, 'uploads', fileName);
}

export const removeImage = async (req, res) => {
  const { imageURL } = req.body;

  const urlPath = new URL(imageURL).pathname;

  const filePath = join('shops', urlPath.split('/product-builder/').pop());

  const response = await deleteFile(filePath);

  if (response.HttpCode === 200) {
    res.sendStatus(200);
    return;
  }

  res.sendStatus(400);
};

export const getCustomerUploads = async (req, res) => {
  const { customerId, anonimId, shop } = req.query;

  const path = customerId
    ? join('shops', shop, customerId, 'uploads')
    : join('shops', shop, 'anonims', anonimId, 'uploads');

  if (!(await existsFile(path))) {
    res.send({
      error: 'directrory not exists'
    });
    return;
  }

  if (customerId && !anonimId) {
    const uploads = (await readDirectory(path))
      .map(file => getUploadPath({ shop, customerId, fileName: file.ObjectName }));

    res.send(uploads);
    return;
  } else if (!customerId && anonimId) {
    const uploads = (await readDirectory(path))
      .map(file => getUploadPath({ shop, anonimId, fileName: file.ObjectName }));

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

  const path = join('shops', ...pathArr.slice(startFrom));

  const textConfig = {};

  const config = Object.keys(req.query)
    .reduce((obj, key) => {
      if (options.includes(key) && req.query[key] && !textOptions.includes(key)) {
        if (key === 'background') {
          try {
            const backgroundColor = JSON.stringify(req.query[key]);

            if (backgroundColor.includes('rgb')) {
              obj[key] = getRGBValue(backgroundColor);
              textConfig[key] = getRGBValue(backgroundColor);
            } else {
              obj[key] = '#' + req.query[key];
            }
          } catch {
            return obj;
          }

          return obj;
        }

        if (['type', 'format', 'layout'].includes(key)) {
          obj[key] = req.query[key];
          return obj;
        }

        if (key === 'borderRadius') {
          if (req.query[key].endsWith('%')) {
            obj[key] = req.query[key];
          } else {
            obj[key] = JSON.parse(req.query[key]);
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
      } else if (textOptions.includes(key)) {
        try {
          textConfig[key] = JSON.parse(req.query[key]);
        } catch {
          textConfig[key] = req.query[key];
        }
      }

      return obj;
    }, {});

  if (textConfig.text) {
    textConfig.text = textConfig.text.split('0x0A').join('\n');
  }
 
  if (!(await existsFile(path))) {
    res.sendStatus(400);
    return;
  }

  const picture = await downloadFile(path);

  if (!(picture instanceof Buffer)) {
    res.sendStatus(400);
    return;
  }

  let file = sharp(picture);

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
    background = { r: 255, g: 255, b: 255, alpha: 1 },
    type = 'print',
    borderRadius = 0,
    layout
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

  if (thumbnail) {
    file = await createThumbnail(file, resize);

    res.setHeader('Content-Type', 'image/webp'); 

    res.send(file);
    return;
  }

  file = await resizeImage(file, resize, width, height, rotate, background); 

  file = await cropImage(file, crop, background); 

  if (borderRadius && borderRadius !== 0) {
    const [resizeWidth, resizeHeight] = resize;
    const mask = borderRadiusMask({
      width: parseInt(resizeWidth.toFixed(0)),
      height: parseInt(resizeHeight.toFixed(0)),
      borderRadius
    });

    file = file.composite([{
        input: mask,
        blend: 'dest-in',
      }])
      .png();
  }
  
  switch (format) {
    case 'webp':
      res.setHeader('Content-Type', 'image/webp'); 

      file = file.webp(); 
      break;
    case 'png':
      res.setHeader('Content-Type', 'image/png');

      file = file
        .withMetadata()
        .png();

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

  file = await file.toBuffer();

  if (type === 'polaroid') {
    file = await createPolaroid(file, textConfig, {
      background
    });
  } else if (type.endsWith('Tile')) {
    file = await createTile(file, type, background);
  }

  if (layout === 'tile') {
    file = await createTileLayout(file);
  }

 
  res.send(file);
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

  return file;
}

const borderRadiusMask = ({
  width = 200,
  height = 200,
  borderRadius = 0
}) => {
  const svg = `
    <svg>
      <rect x="0" y="0" width="${width}" height="${height}" rx="${borderRadius}" ry="${borderRadius}" />
    </svg>
  `;

  return Buffer.from(svg);
}

const createThumbnail = async (file, resize = [100, 100]) => {
  const [resizeWidth, resizeHeight] = resize;

  let thumbnail = file;

  thumbnail = thumbnail.resize({
    width: parseInt(resizeWidth.toFixed(0)),
    height: parseInt(resizeHeight.toFixed(0)),
  });

  thumbnail = await thumbnail
    .withMetadata()
    .webp() 
    .toBuffer();

  return thumbnail;
}

const createTile = async (img, layout, background) => {
  const tileSide = 2364;

  let tile = sharp({
    create: {
      width: tileSide,
      height: tileSide,
      channels: 4,
      background
    }
  });

  let mask;

  switch(layout) {
    case 'roundTile':
      mask = borderRadiusMask({
        width: 2000,
        height: 2000,
        borderRadius: '50%'
      });
      break;
    case 'squareTile':
      mask = borderRadiusMask({
        width: 2000,
        height: 2000,
        borderRadius: 80,
      });
      break;
  }

  let picture = sharp(img);

  if (layout !== 'squareFramelessTile') {
    picture = picture.resize({
        width: 2000,
        height: 2000
      });
  } else {
    picture = picture.resize({
      width: tileSide,
      height: tileSide
    });
  }

  if (mask) {
    picture = picture.composite([
      {
        input: mask,
        blend: 'dest-in'
      }
    ])
  }

  picture = await picture.png().toBuffer();

  if (layout !== 'squareFramelessTile') {
    tile = tile.composite([
      {
        input: picture,
        top: 182,
        left: 182
      }
    ]);
  } else {
    tile = tile.composite([
      {
        input: picture,
        top: 0,
        left: 0
      }
    ]);
  }
  

  tile = await tile.jpeg().toBuffer();

  return tile;
}

const createTileLayout = async (tile) => {
  let layout = sharp({
    create: {
      width: 2398,
      height: 3602,
      channels: 4,
      background: { r: 200, g: 200, b: 200, alpha: 1 }
    }
  });

  layout = layout.composite([
    {
      input: tile,
      top: 0,
      left: 0
    }
  ])

  layout = await layout.jpeg().toBuffer();

  return layout;
}

const createPolaroid = async (img, textConfig, {
  background
}) => {
  let polaroid = sharp({
    create: {
      width: 1200,
      height: 1800,
      channels: 4,
      background,
    }
  });

  let picture = await sharp(img)
    .resize({
      width: 1004,
      height: 1004
    })
    .jpeg()
    .toBuffer();

  const Text = await createText(textConfig);

  polaroid = polaroid
    .composite([
      {
        input: picture,
        top: 98,
        left: 98
      },
      {
        input: Text,
        top: 1240,
        left: 98,
      }
    ]);

  polaroid = await polaroid.jpeg().toBuffer();

  return polaroid;
}

async function createText(config) {
  const {
    align = 'center',
    font = 'Arial',
    bold = false,
    italic = false,
    underline = false,
    text = 'no text',
    background,
    color,
    fontSize = 110,
    width = 1004,
    height = 500
  } = config;

  const textSVG = await fetch(`${process.env.HOST}/product-builder/text`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      align,
      font,
      fontStyle: {
          bold,
          italic,
          underline
      },
      text,
      color: color ? color : getFontColor(background),
      fontSize
    })
  }).then(res => res.blob());

  const textBuffer = Buffer.from(await textSVG.arrayBuffer());

  const textSharp = await sharp(textBuffer)
    .resize({
      width,
      height,
      background: { r: 0, b: 0, g: 0, alpha: 0 }
    }).png().toBuffer();

    return textSharp;
}

export const getText = async (req, res) => {
  const textSettings = req.body;

  if (!textSettings) {
    res.send({
      error: {
        message:  'text settings no provided'
      }
    })
    return;
  }

  const {
    align,
    font,
    fontStyle,
    text,
    color = 'rgb(0,0,0)',
    fontSize = 100,
    width = 1004,
    height = 500
  } = textSettings;

  const { bold, italic, underline } = fontStyle;

  const lines = text.split('\n');

  const textSize = fontSize * (lines.length - 1);

  const verticalPadding = (100 * ((height - textSize) / 2)) / height;

  const linePart = (100 * fontSize) / height;

  const textTags = text.split('\n')
    .map((line, idx) => {
      const yPosition = (linePart * idx) + verticalPadding;

      return `
        <text
          x="50%"
          y="${yPosition}%"
          dominant-baseline="middle"
          text-anchor="middle"
        >${line}</text>
      `
    })
    .join('');

  const svg = `
    <svg
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
      fill="#343434"
    >
    <style>
      text {
        width: 100%;

        font-size: ${fontSize}px;
        fill: ${color};
        text-align: ${align};
        font-family: ${font}, sans-serif;
        ${underline ? 'text-decoration: underline;' : ''}
        ${bold ? 'font-weight: 700;' : ''}
        ${italic ? 'font-style: italic;' : ''}
      }
    </style>
      ${textTags}
    </svg>
  `;

  res.contentType('image/svg+xml');

  res.send(svg);
}

export const createLayout = async (req, res) => {
  const block = req.body;

  const page = new PhotobookElement(block);

  res.setHeader('Content-Type', 'image/jpeg');

  res.send(await page.draw());
}
  