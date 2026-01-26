import { hash, compare  } from "bcrypt";
import CryptoJS from "crypto-js";
import { v4 as uuid } from "uuid";

async function Hash({ plainText, salt = Number(process.env.SALT) }) {
  return hash(plainText, salt);
}

async function Compare({ plainText, cipherText }) {
  return compare(plainText, cipherText);
}

async function Encrypt({ plainText, key }) {
  return CryptoJS.AES.encrypt(plainText, key).toString();
}

async function Decrypt({ cipherText, key }) {
  return CryptoJS.AES.decrypt(cipherText, key).toString(CryptoJS.enc.Utf8);
}

async function generateOtp() {
  return uuid().replace(/\D/g, "").slice(0, 6);
}

export { Hash,
  Compare,
  Encrypt,
  Decrypt,
  generateOtp,
 };
