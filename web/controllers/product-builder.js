import fs from 'fs';
import { join } from 'path';

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