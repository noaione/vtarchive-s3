import Crypto from "crypto";
import { isNone } from "./utils";

const ALGO = "aes-256-cbc";

export function encryptKey(data: string) {
    if (isNone(process.env.ENCRYPT_KEY)) {
        throw new Error("ENCRYPT_KEY is not defined");
    }
    const iv = Crypto.randomBytes(16);
    const cipher = Crypto.createCipheriv(ALGO, process.env.ENCRYPT_KEY, iv);

    let encryptedContent = cipher.update(data, "utf-8", "hex");
    encryptedContent += cipher.final("hex");

    const ivData = iv.toString("hex");
    return `${ivData}-${encryptedContent}`;
}

export function decryptKey(encrypted: string) {
    const iv = encrypted.substring(0, 32);
    const encryptedContent = encrypted.substring(33);

    const ivBytes = Buffer.from(iv, "hex");
    const cipher = Crypto.createDecipheriv(ALGO, process.env.ENCRYPT_KEY, ivBytes);
    let decryptedData = cipher.update(encryptedContent, "hex", "utf-8");
    decryptedData += cipher.final("utf-8");
    return decryptedData;
}
