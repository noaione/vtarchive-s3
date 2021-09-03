import { VTObject, VTPath } from "@/lib/s3";
import React from "react";
import Link from "next/link";

import mime from "mime-types";

import Breadcrumbs from "./Breadcrumbs";
import LoadingContainer from "./LoadContainer";
import NoContent from "./NoContent";

import Icon from "@mdi/react";
import { mdiFile, mdiFileDocument, mdiFileImage, mdiFileMusic, mdiFileVideo, mdiFolder } from "@mdi/js";

interface ViewerProps {
    folders: VTPath[];
    files: VTObject[];
    crumbs?: string;
    isLoading: boolean;
}

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
                    <div
                        className="font-medium whitespace-nowrap overflow-x-hidden overflow-ellipsis"
                        title={prefix}
                        aria-label={prefix}
                    >
                        {prefix}
                    </div>
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
                        <div
                            className="font-medium whitespace-nowrap overflow-x-hidden overflow-ellipsis"
                            title={realName}
                            aria-label={realName}
                        >
                            {realName}
                        </div>
                    </td>
                </div>
            </a>
        </Link>
    );
}

function RenderContainer(props: Pick<ViewerProps, "folders" | "files">) {
    const { folders, files } = props;
    if (folders.length < 1 && files.length < 1) {
        return <NoContent />;
    }

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

class BucketViewer extends React.Component<ViewerProps> {
    render() {
        const { crumbs, files, folders, isLoading } = this.props;
        return (
            <div className="flex flex-col">
                <Breadcrumbs path={crumbs} className="my-4" />
                {isLoading ? <LoadingContainer /> : <RenderContainer files={files} folders={folders} />}
            </div>
        );
    }
}

export default BucketViewer;
