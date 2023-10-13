import { join } from 'path';

import { deleteFile, existsFile, readDirectory } from '../utils/cdnApi.js';

export const getUploadPath = (params) => {
  if (!params) {
    return;
  }

  const { shop, customerId, anonimId, fileName } = params;

  if (anonimId) {
    return join(shop, 'anonims', anonimId, 'uploads', fileName);
  }

  return join(shop, customerId, 'uploads', fileName);
}

export const removeImage = async (req, res) => {
  const { imageURL } = req.body;

  const urlPath = new URL(imageURL).pathname;

  const response = await deleteFile(urlPath);

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