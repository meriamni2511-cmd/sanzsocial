
/**
 * Simple encryption service for securing API keys in local storage.
 * In a real production environment, use a more robust backend-managed encryption.
 */

const SALT = "BinaNeuralShift_2025";

export const encryptKey = (text: string): string => {
  if (!text) return "";
  const textChars = text.split("");
  const saltChars = SALT.split("");
  const encrypted = textChars.map((char, i) => {
    return String.fromCharCode(char.charCodeAt(0) ^ saltChars[i % saltChars.length].charCodeAt(0));
  });
  return btoa(encrypted.join(""));
};

export const decryptKey = (encoded: string): string => {
  if (!encoded) return "";
  try {
    const text = atob(encoded);
    const textChars = text.split("");
    const saltChars = SALT.split("");
    const decrypted = textChars.map((char, i) => {
      return String.fromCharCode(char.charCodeAt(0) ^ saltChars[i % saltChars.length].charCodeAt(0));
    });
    return decrypted.join("");
  } catch (e) {
    console.error("Decryption failed:", e);
    return "";
  }
};
