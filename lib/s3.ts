import { Client as MinioClient } from "minio";
import { isNone } from "./utils";

export function createS3Client(): MinioClient {
    if (!isNone(global.s3)) {
        return global.s3;
    }
    if (isNone(process.env.S3_REGION)) {
        throw new Error("S3_REGION is not set");
    }
    if (isNone(process.env.S3_BUCKET)) {
        throw new Error("S3_BUCKET is not set");
    }

    if (isNone(process.env.S3_ACCESS_KEY_ID)) {
        throw new Error("S3_ACCESS_KEY_ID is not set");
    }
    if (isNone(process.env.S3_SECRET_ACCESS_KEY)) {
        throw new Error("S3_SECRET_ACCESS_KEY is not set");
    }

    let ENDPOINT = process.env.S3_ENDPOINT;
    if (isNone(ENDPOINT)) {
        throw new Error("S3_ENDPOINT is not set");
    }
    if (ENDPOINT.startsWith(".")) {
        ENDPOINT = ENDPOINT.substring(1);
    }

    const s3 = new MinioClient({
        endPoint: ENDPOINT,
        useSSL: true,
        accessKey: process.env.S3_ACCESS_KEY_ID,
        secretKey: process.env.S3_SECRET_ACCESS_KEY,
        region: process.env.S3_REGION,
    });
    global.s3 = s3;
    return s3;
}

export interface VTObject {
    key: string;
    prefix: string;
    size: number;
    type: "FILE";
}

export interface VTPath {
    base: string;
    prefix: string;
    type: "FOLDER";
}

type VTObjectOrPath = VTObject | VTPath;

interface S3Object {
    name?: string;
    prefix?: string;
    size: number;
    lastModified?: Date;
    etag?: string;
}

export async function listObjectPaths(path?: string) {
    const s3 = createS3Client();
    const BUCKET = process.env.S3_BUCKET;
    if (isNone(BUCKET)) {
        throw new Error("S3_BUCKET is not set");
    }
    if (typeof path === "string") {
        path = path.trim();
        if (path == "") {
            path = undefined;
        } else {
            if (!path.endsWith("/")) {
                path = path + "/";
            }
        }
    }
    const objectStream = s3.listObjectsV2(BUCKET, path);
    const concattedObjects = [] as S3Object[];
    objectStream.on("data", (item) => {
        concattedObjects.push(item);
    });
    let isError = false;
    const promises = new Promise<any[]>((resolve, reject) => {
        objectStream.on("end", () => {
            console.info("END OF THE DATA!");
            resolve(concattedObjects);
        });
        objectStream.on("error", (err) => {
            isError = true;
            reject(err);
        });
    });
    await promises;
    if (isError) {
        return [[], true];
    }
    const allCollected = [] as VTObjectOrPath[];
    concattedObjects.forEach((item) => {
        if (item.prefix) {
            allCollected.push({
                base: path,
                prefix: item.prefix.replace(path, ""),
                type: "FOLDER",
            });
        } else {
            // Skip the base folder
            if (item.name === path) {
                return;
            }
            allCollected.push({
                key: item.name,
                prefix: path,
                size: item.size,
                type: "FILE",
            });
        }
    });
    return [allCollected, isError];
}
