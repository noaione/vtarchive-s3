import { getAllObjects, VTObjectOrPath } from "@/lib/s3";
import { isNone, selectFirst } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";
import mime from "mime-types";
import { DateTime } from "luxon";

interface NodeRecord {
    id?: string | number;
    type?: "file" | "folder";
    size?: number;
    mimetype?: string;
    modtime?: number;
    name: string;
    toggled?: boolean;
    active?: boolean;
    loading?: boolean;
    children?: NodeRecord[];
}

function determineMimeType(filename: string) {
    const mimeType = mime.lookup(filename);
    if (mimeType) {
        return mimeType;
    }
    return "application/octet-stream";
}

function findNode(dataset: NodeRecord[], name: string) {
    for (let i = 0; i < dataset.length; i++) {
        if (dataset[i].name === name) {
            return i;
        }
    }
    return -1;
}

function etagToID(etag: string, mode: "path" | "file" = "path") {
    // convert etag to base64 and cut to the first 10 characters
    const base64 = Buffer.from(etag, "utf8").toString("base64");
    return `${mode}-${base64.slice(0, 10)}`;
}

function parseTimeToUnix(timestamp: string): number {
    const parsed = DateTime.fromISO(timestamp, { zone: "UTC" });
    return parsed.toSeconds();
}

function parseDataIntoNodeTree(records: VTObjectOrPath[]): [NodeRecord, number] {
    const root: NodeRecord = {
        id: "root",
        name: "Root",
        children: [],
        type: "folder",
        toggled: true,
    };
    const foldersOnly = records.filter((record) => record.type === "FOLDER");
    const filesOnly = records.filter((record) => record.type === "FILE");
    const refittedData = [...foldersOnly, ...filesOnly];
    let totalSize = 0;
    refittedData.forEach((record) => {
        let fullSplitPath: string[] = [];
        if (record.type === "FILE") {
            let fullPath = record.prefix;
            if (fullPath.endsWith("/")) {
                fullPath = fullPath.slice(0, -1);
            }
            fullSplitPath = fullPath.split("/");
            fullSplitPath.push(record.key);
        } else {
            const baseFolder = record.base;
            const anotherPrefix = record.prefix;
            let joinedPath = baseFolder + "/" + anotherPrefix;
            if (joinedPath.endsWith("/")) {
                joinedPath = joinedPath.slice(0, joinedPath.length - 1);
            }
            fullSplitPath = joinedPath.split("/");
        }
        const isDir = record.type === "FOLDER";
        if (isDir && fullSplitPath.length === 1) {
            root.children.push({
                id: etagToID(record.etag, "path"),
                name: fullSplitPath[0],
                type: "folder",
                toggled: true,
                children: [],
            });
            return;
        }

        const folders = fullSplitPath.slice(0, fullSplitPath.length - 1);
        const files = fullSplitPath[fullSplitPath.length - 1];
        console.info(folders, files, isDir);

        let use_root = root;
        folders.forEach((folder) => {
            let node_idx = findNode(use_root.children, folder);
            if (node_idx === -1) {
                use_root.children.push({
                    id: etagToID(record.etag, "path"),
                    name: folder,
                    type: "folder",
                    children: [],
                });
                node_idx = findNode(use_root.children, folder);
                use_root = use_root.children[node_idx];
            } else {
                use_root = use_root.children[node_idx];
            }
        });
        if (isDir) {
            use_root.children.push({
                id: etagToID(record.etag, "path"),
                name: files,
                type: "folder",
                children: [],
            });
        } else {
            totalSize += record.size;
            const sub_data: NodeRecord = {
                id: etagToID(record.etag, "file"),
                name: files,
                type: "file",
                size: record.size,
                modtime: parseTimeToUnix(record.lastMod),
                mimetype: determineMimeType(files),
            };
            use_root.children.push(sub_data);
        }
    });
    return [root, totalSize];
}

export default async function listingAllAPI(req: NextApiRequest, res: NextApiResponse) {
    const { bucket } = req.query;
    let realBucket: string | undefined = undefined;
    if (!isNone(bucket)) {
        realBucket = selectFirst(bucket);
    }
    const [allContents, isFailed] = await getAllObjects(realBucket);
    const [parsedContents, totalSize] = parseDataIntoNodeTree(allContents);
    res.json({ data: parsedContents, sizes: totalSize, error: isFailed });
}
