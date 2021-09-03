import ky from "ky";
import { VTObjectOrPath } from "./s3";

interface ListApiResult {
    data: VTObjectOrPath[];
    error: boolean;
}

export async function fetchList(path?: string) {
    if (typeof path === "string") {
        path = path.trim();
        if (path == "") {
            path = undefined;
        }
    }

    let searchParams = undefined;
    if (typeof path === "string") {
        searchParams = {
            path,
        };
    }

    const result = await ky
        .get("/api/list", {
            searchParams,
            throwHttpErrors: false,
        })
        .json<ListApiResult>();

    if (result.error) {
        throw new Error("An error occured while trying to fetch the list!");
    }
    return result.data;
}
