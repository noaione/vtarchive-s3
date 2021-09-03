import type { S3Client } from "@aws-sdk/client-s3";

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
        }

        interface Global {
            s3?: S3Client;
        }
    }
}
