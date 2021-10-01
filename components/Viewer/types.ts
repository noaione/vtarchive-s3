import { VTObject, VTPath } from "@/lib/s3";

export interface ViewerProps {
    folders: VTPath[];
    files: VTObject[];
    crumbs?: string;
    isLoading: boolean;
    viewMode: BucketViewMode;
}

export type BucketViewMode = "grid" | "list";
