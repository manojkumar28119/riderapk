const encoder = new TextEncoder();
const decoder = new TextDecoder();

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

// console.log("Secret Key:", SECRET_KEY);

// -------- Base64 --------
const toBase64 = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes));

const fromBase64 = (base64: string) =>
  Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// -------- Key Derivation --------
const getKeyMaterial = (secretKey: string) =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

const deriveKey = async (secretKey: string, salt: Uint8Array) => {
  const keyMaterial = await getKeyMaterial(secretKey);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 120000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
};

// -------- Core Encrypt --------
const encrypt = async (plain: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const key = await deriveKey(SECRET_KEY, salt);
  const encrypted = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encoder.encode(plain)
    )
  );

  const combined = new Uint8Array(salt.length + iv.length + encrypted.length);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(encrypted, salt.length + iv.length);

  return toBase64(combined);
};

// -------- Core Decrypt --------
const decrypt = async (cipherText: string) => {
  const bytes = fromBase64(cipherText);

  const salt = bytes.slice(0, 16);
  const iv = bytes.slice(16, 28);
  const data = bytes.slice(28);

  const key = await deriveKey(SECRET_KEY, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data
  );

  return decoder.decode(decrypted);
};

// -------- JSON Helpers --------
const encryptObj = async <T>(obj: T) =>
  encrypt(JSON.stringify(obj));

const decryptObj = async <T>(cipher: string): Promise<T> =>
  JSON.parse(await decrypt(cipher));

export {
  encrypt,
  decrypt,
  encryptObj,
  decryptObj,
};
