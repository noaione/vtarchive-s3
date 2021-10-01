import { VTObject, VTPath } from "@/lib/s3";
import React from "react";
import Link from "next/link";

import mime from "mime-types";

import Icon from "@mdi/react";
import { mdiFile, mdiFileDocument, mdiFileImage, mdiFileMusic, mdiFileVideo, mdiFolder } from "@mdi/js";
import { decodeHTMLEntities, humanizeBytes } from "@/lib/utils";
import { ViewerProps } from "./types";

function FolderRender(props: VTPath) {
    let { prefix } = props;
    if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
    }
    return (
        <Link href={`/${props.base}${prefix}`} passHref>
            <div className="flex flex-row px-4 py-3 w-full rounded-md transition hover:bg-gray-700 cursor-pointer">
                <div className="flex mr-1.5">
                    <Icon path={mdiFolder} size={1} className="text-yellow-300" />
                </div>
                <td className="overflow-x-hidden">
                    <span
                        className="font-medium whitespace-nowrap overflow-hidden block overflow-ellipsis"
                        title={prefix}
                        aria-label={prefix}
                    >
                        {prefix}
                    </span>
                </td>
            </div>
        </Link>
    );
}

function determineIcon(filename: string) {
    const mimeType = mime.lookup(filename);
    if (!mimeType) {
        return mdiFile;
    }

    if (mimeType.startsWith("video/")) {
        return mdiFileVideo;
    }
    if (mimeType.startsWith("image/")) {
        return mdiFileImage;
    }
    if (mimeType.startsWith("audio/")) {
        return mdiFileMusic;
    }
    if (mimeType.startsWith("text/")) {
        return mdiFileDocument;
    }
    return mdiFile;
}

interface SimpleObject extends Omit<VTObject, "key"> {
    file: string;
}

function FilesRender(props: SimpleObject) {
    let realName = props.file.replace(props.prefix, "");
    realName = decodeHTMLEntities(realName);

    return (
        <Link href={`/view/${props.hash}`}>
            <a>
                <div className="grid grid-cols-12 px-4 py-3 w-full rounded-md transition hover:bg-gray-700 cursor-pointer">
                    <div className="flex flex-row col-span-11">
                        <div className="flex mr-1.5">
                            <Icon path={determineIcon(realName)} size={1} className="text-blue-300" />
                        </div>
                        <td className="overflow-x-hidden">
                            <span
                                className="font-medium whitespace-nowrap overflow-hidden block overflow-ellipsis"
                                title={realName}
                                aria-label={realName}
                            >
                                {realName}
                            </span>
                        </td>
                    </div>
                    <div className="flex flex-row col-span-1 justify-end">{humanizeBytes(props.size)}</div>
                </div>
            </a>
        </Link>
    );
}

function BucketListViewer(props: Pick<ViewerProps, "folders" | "files">) {
    const { folders, files } = props;
    return (
        <div className="flex flex-col gap-2">
            {folders.map((folder) => {
                return <FolderRender key={`folder-${folder.base}-${folder.prefix}`} {...folder} />;
            })}
            {files.map((file) => {
                const { key, ...fs } = file;
                return <FilesRender key={`file-${key}-${fs.prefix}`} file={key} {...fs} />;
            })}
        </div>
    );
}

export default BucketListViewer;
