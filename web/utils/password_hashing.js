import CryptoJS from "crypto-js";

export const encryptPassword = (password, secret) => {
  if (!password || !secret) {
    return '';
  }

  const code = CryptoJS.AES
    .encrypt(password, secret)
    .toString()
    .replace(/\+/g,'p1L2u3S')
    .replace(/\//g,'s1L2a3S4h')
    .replace(/=/g,'e1Q2u3A4l');

  return code;
}

export const decryptPassword = (hash, secret) => {
  if (!hash) return '';

  const code = hash
    .replace(/p1L2u3S/g, '+' )
    .replace(/s1L2a3S4h/g, '/')
    .replace(/e1Q2u3A4l/g, '=');

  const bytes = CryptoJS.AES.decrypt(code, secret);

  return bytes.toString(CryptoJS.enc.Utf8);
}