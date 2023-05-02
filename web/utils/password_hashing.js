import CryptoJS from "crypto-js"

export const encryptPassword = (password, secret) => {
  return CryptoJS.AES.encrypt(password, secret).toString();
}

export const decryptPassword = (hash, secret) => {
  const bytes = CryptoJS.AES.decrypt(hash, secret);

  return bytes.toString(CryptoJS.enc.Utf8);
}