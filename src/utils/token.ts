import { env } from "~/env";
import * as crypto from "crypto-js";

export function decryptFid(token: string): number {
  try {
    const padding = "=".repeat((4 - (token.length % 4)) % 4);
    const base64 = token.replace(/-/g, "+").replace(/_/g, "/") + padding;
    const bytes = crypto.AES.decrypt(base64, env.SECRERT_KEY);
    const decrypted = bytes.toString(crypto.enc.Utf8);
    return parseFloat(decrypted);
  } catch (e) {
    return 0;
  }
}

export function encryptFid(fid: number) {
  const encrypted = crypto.AES.encrypt(
    fid.toString(),
    env.SECRERT_KEY,
  ).toString();
  return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
