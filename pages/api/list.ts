import { listObjectPaths } from "@/lib/s3";
import { selectFirst } from "@/lib/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function listingAPI(req: NextApiRequest, res: NextApiResponse) {
    const { path } = req.query;
    const [allContents, isFailed] = await listObjectPaths(selectFirst(path));
    res.json({ data: allContents, error: isFailed });
}
