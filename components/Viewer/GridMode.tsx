import { VTPath } from "@/lib/s3";
import React from "react";
import Link from "next/link";

import mime from "mime-types";

import Icon from "@mdi/react";
import { mdiFile, mdiFileDocument, mdiFileImage, mdiFileMusic, mdiFileVideo, mdiFolder } from "@mdi/js";
import { ViewerProps } from "./types";

function FolderRender(props: VTPath) {
    let { prefix } = props;
    if (prefix.endsWith("/")) {
        prefix = prefix.slice(0, -1);
    }
    return (
        <Link href={`/${props.base}${prefix}`} passHref>
            <div className="flex flex-row px-4 py-3 bg-gray-600 rounded-md transition hover:bg-gray-500 cursor-pointer shadow-md">
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

interface SimpleObject {
    prefix: string;
    file: string;
    hash: string;
}

function FilesRender(props: SimpleObject) {
    const realName = props.file.replace(props.prefix, "");
    return (
        <Link href={`/view/${props.hash}`}>
            <a>
                <div className="flex flex-row px-4 py-3 bg-gray-600 rounded-md transition hover:bg-gray-500 cursor-pointer shadow-md">
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
            </a>
        </Link>
    );
}

function BucketGridViewer(props: Pick<ViewerProps, "folders" | "files">) {
    const { folders, files } = props;

    return (
        <div className="grid grid-cols-4 gap-2">
            {folders.map((folder) => {
                return <FolderRender key={`folder-${folder.base}-${folder.prefix}`} {...folder} />;
            })}
            {files.map((file) => {
                return (
                    <FilesRender
                        key={`file-${file.key}-${file.prefix}`}
                        prefix={file.prefix}
                        file={file.key}
                        hash={file.hash}
                    />
                );
            })}
        </div>
    );
}

export default BucketGridViewer;
