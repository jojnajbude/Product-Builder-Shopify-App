import { join } from 'path';

const cdnPath = 'https://getcocun-dev.b-cdn.net/shops/';

const joinPath = (...path) => {
  const stringPath = path.map(elem => String(elem));

  if (stringPath.some(elem => typeof elem !== 'string')) {
    return;
  }

  return stringPath.join('%2F');
}

const headers = {
  accept: '*/*',
  AccessKey: process.env.BUNNY_API_KEY
}

const bunnyOrigin = 'https://storage.bunnycdn.com';

const bunnyHost = `${bunnyOrigin}/${process.env.BUNNY_STORAGE_ZONE}`;

export async function downloadFile(path, fileName) {
  const url = `${bunnyHost}/${path ? path : ''}${fileName ? '/' + fileName : ''}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  }).then(res => {
    if (res.ok) {
      return res.blob();
    }

    return res.text();
  }).then(res => {
    if (res instanceof Blob) {
      return res.arrayBuffer().then(arrayBuff => Buffer.from(arrayBuff));
    }

    return res;
  });

  return response;
}

export async function uploadFile(path, fileName, file) {
  const url = `${bunnyHost}${path ? '/' + path : '' }/${fileName}`;

  const fileUrl = join(path, fileName);

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: file ? Buffer.from(file.buffer) : ''
  }).then(res => res.json());

  if (response.HttpCode === 201) {
    return fileUrl;
  }

  return;
}

export async function uploadImage(path, fileName, image) {
  const url = join(bunnyHost, 'shops', ...path.split('/'), 'uploads', fileName);

  const [shop, customerId] = [path.split('/').shift(), path.split('/').pop()];

  const fileUrl = !url.includes('anonims')
    ? join(shop, customerId, 'uploads', fileName)
    : join(shop, 'anonims', customerId, 'uploads', fileName);

  const response = await fetch(url, {
    method: 'PUT',
    headers,
    body: image ? Buffer.from(image.buffer) : ''
  }).then(res => res.json());

  if (response.HttpCode === 201) {
    return fileUrl;
  }

  return;
}

export async function readDirectory(filePath) {
  if (typeof filePath !== 'string') {
    return [];
  }

  const url = `${bunnyHost}/${filePath}/`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }).then(res => res.json());

  if (response.HttpCode) {
    return [];
  }

  return response;
};

export async function existsFile(filePath) {
  if (typeof filePath !== 'string') {
    return false;
  }

  const [path, fileToFind] = [
    join(...filePath.split('/').slice(0, filePath.split('/').length - 1)),
    filePath.split('/').pop()
  ];

  const url = bunnyHost + '/' + path;

  const response = await fetch(url + '/', {
    method: 'GET',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
  }).then(res => res.json());


  if (response.HttpCode) {
    return false;
  }

  return response.some(file => file.ObjectName === fileToFind);
}

export async function createDir(path) {
  const uploaded = await uploadFile(path, 'toDelete');

  const deleted = await deleteFile(uploaded);

  if (deleted) {
    return path;
  }
}

const defaultDeleteConfig = {
  isDirectory: false
}

export async function deleteFile(path, {
  isDirectory
} = defaultDeleteConfig) {
  const url = bunnyHost + '/' + path + (isDirectory ? '/' : '');

  const response = await fetch(url, {
    method: 'DELETE',
    headers
  }).then(res => res.json());

  console.log(response);

  return response;
}