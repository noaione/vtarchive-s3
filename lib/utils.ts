export type Nullable<T> = T | null;
export type NoneType = null | undefined;

export function isNone(value: any): value is NoneType {
    return value === undefined || value === null;
}

export function selectFirst(values: string | string[]): string {
    if (Array.isArray(values)) {
        return values[0];
    }
    return values;
}

export function decodeHTMLEntities(contents: string) {
    const mappings = { amp: "&", lt: "<", gt: ">", quot: `"`, "#039": "'", apos: "'" };
    return contents.replace(/&([^;]+);/g, (m, c) => mappings[c]);
}

export function humanizeBytes(bytes: number): string {
    const sizes = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"];
    if (bytes === 0) return "0 B";
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)) as unknown as string);
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}
