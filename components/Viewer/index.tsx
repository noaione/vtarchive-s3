import React from "react";
import Breadcrumbs from "../Breadcrumbs";
import LoadingContainer from "../LoadContainer";
import NoContent from "../NoContent";

import GridViewer from "./GridMode";
import ListViewer from "./ListMode";
import { BucketViewMode, ViewerProps } from "./types";

export default class BucketViewer extends React.Component<ViewerProps> {
    constructor(props) {
        super(props);
        this.renderContentMode = this.renderContentMode.bind(this);
    }

    renderContentMode() {
        const { files, folders } = this.props;
        if (this.props.viewMode === "grid") {
            return <GridViewer files={files} folders={folders} />;
        }
        return <ListViewer files={files} folders={folders} />;
    }

    render() {
        const { crumbs, isLoading, folders, files } = this.props;

        const isContentEmpty = files.length < 1 && folders.length < 1;
        console.info(`RENDERING WITH`, this.props.viewMode);

        return (
            <div className="flex flex-col">
                <Breadcrumbs path={crumbs} className="my-4" />
                {isLoading ? (
                    <LoadingContainer />
                ) : (
                    <>{isContentEmpty ? <NoContent /> : <>{this.renderContentMode()}</>}</>
                )}
            </div>
        );
    }
}

export type { BucketViewMode, ViewerProps };
