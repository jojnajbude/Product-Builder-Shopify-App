import { join } from 'path';
import fs from 'fs';

export const getCustomer = (path) => {
  const uploads = join(path, 'uploads');

  if (!fs.existsSync(path) && !fs.existsSync(uploads)) {
    fs.mkdirSync(path);

    fs.mkdirSync(uploads);
  } 

  const draftPath = join(path, 'orders');

  if (!path.includes('anonims') && !fs.existsSync(draftPath)) {
    fs.mkdirSync(join(path, 'orders'));
  }

  return uploads;
}
 