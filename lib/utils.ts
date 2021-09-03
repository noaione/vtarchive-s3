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
