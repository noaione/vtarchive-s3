import { createS3Client } from "@/lib/s3";
import { isNone } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

interface ExtendedError extends Error {
    code: string;
    key: string;
    requestid: string;
    hostid: string;
}

export default async function downloadAPI(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    if (!Array.isArray(path)) {
        res.status(400).json({ error: "path must be an array" });
        return;
    }
    const realPath = path.join("/");
    const s3 = createS3Client();
    const BUCKET = process.env.S3_BUCKET;
    if (isNone(BUCKET)) {
        res.status(500).json({
            error: "Bucket is not set",
        });
        return;
    }
    console.info(`Resolving ${realPath}`);
    s3.getObject(BUCKET, realPath, (err: ExtendedError, data) => {
        if (err) {
            res.status(500).send(
                `An error occured trying to get the bucket path: ${err.code} [${err.requestid}]`
            );
        } else {
            const theRealItem = realPath.substring(realPath.lastIndexOf("/") + 1);
            console.info(`Downloading: ${theRealItem}`);
            // @ts-ignore
            const headersBase = data.headers as { [key: string]: string };
            res.writeHead(200, {
                "Content-Type": headersBase["content-type"],
                "Content-Length": headersBase["content-length"],
            });

            console.info("Piping result...");
            data.pipe(res);
            data.on("end", () => {
                res.end();
            });
            data.on("error", (err) => {
                console.error("Error while piping");
                console.error(err);
                res.status(500).end();
            });
        }
    });
}
