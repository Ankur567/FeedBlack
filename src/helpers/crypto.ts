import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_CRYPTO_SECRET_KEY || "fallback-key";

export const encryptData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (cipherText: string): any => {
  if (!cipherText || typeof cipherText !== "string") return {};

  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) throw new Error("Decryption produced empty string.");
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("Decryption failed:", e);
    return {};
  }
};
