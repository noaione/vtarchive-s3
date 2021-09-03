import type { Client as MinioClient } from "minio";

declare global {
    namespace NodeJS {
        // Extend process.env typing
        interface ProcessEnv {
            VERCEL_GIT_COMMIT_SHA?: string;
            S3_ENDPOINT?: string;
            S3_REGION?: string;
            S3_BUCKET?: string;
            S3_ACCESS_KEY_ID?: string;
            S3_SECRET_ACCESS_KEY?: string;
            S3_DOWNLOAD_LINK_BASE?: string;
            ENCRYPT_KEY?: string;
        }

        interface Global {
            s3?: MinioClient;
        }
    }
}
