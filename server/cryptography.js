import CryptoJS from "crypto-js";

// Encrypt
export const encrypt = (message) => {
  return CryptoJS.AES.encrypt(message, process.env.SECRET_KEY_HASH).toString();
};

// Decrypt
export const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY_HASH);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
};
