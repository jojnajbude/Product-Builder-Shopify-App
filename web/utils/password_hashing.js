import CryptoJS from "crypto-js"

export const encryptPassword = (password, secret) => {
  return CryptoJS.AES.encrypt(password, secret, { }).toString().replace('+','xMl3Jk').replace('/','Por21Ld').replace('=','Ml32');
}

export const decryptPassword = (hash, secret) => {
  const bytes = CryptoJS.AES.decrypt(hash.replace('xMl3Jk', '+' ).replace('Por21Ld', '/').replace('Ml32', '='), secret);

  return bytes.toString(CryptoJS.enc.Utf8);
}