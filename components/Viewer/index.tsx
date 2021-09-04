import { isNone } from "@/lib/utils";
import React from "react";
import Breadcrumbs from "../Breadcrumbs";
import LoadingContainer from "../LoadContainer";
import NoContent from "../NoContent";

import GridViewer from "./GridMode";
import ListViewer, { ViewerProps } from "./ListMode";

export type BucketViewMode = "grid" | "list";

interface BucketState {
    mode: BucketViewMode;
}

export default class BucketViewer extends React.Component<ViewerProps, BucketState> {
    constructor(props) {
        super(props);
        this.watchMode = this.watchMode.bind(this);
        this.renderContentMode = this.renderContentMode.bind(this);
        this.state = {
            mode: "grid",
        };
    }

    watchMode(ev: StorageEvent) {
        if (ev.key === "s3ViewMode") {
            const mode = (ev.newValue as string) || "grid";
            if (["grid", "list"].includes(mode.toLowerCase())) {
                console.info("VIEWER WATCH MODE, CHANGE TO", mode);
                this.setState({ mode: mode as BucketViewMode });
            }
        }
    }

    componentDidMount() {
        const s3Options = localStorage.getItem("s3ViewMode");
        if (isNone(s3Options)) {
            localStorage.setItem("s3ViewMode", "grid");
            return;
        }
        const mode = (s3Options as string) || "grid";
        if (["grid", "list"].includes(mode.toLowerCase())) {
            this.setState({ mode: mode as BucketViewMode });
        }
        window.addEventListener("storage", this.watchMode);
    }

    componentWillUnmount() {
        window.removeEventListener("storage", this.watchMode);
    }

    renderContentMode() {
        const { files, folders } = this.props;
        if (this.state.mode === "grid") {
            return <GridViewer files={files} folders={folders} />;
        }
        return <ListViewer files={files} folders={folders} />;
    }

    render() {
        const { crumbs, isLoading, folders, files } = this.props;

        const isContentEmpty = files.length < 1 && folders.length < 1;
        console.info(`RENDERING WITH`, this.state.mode);

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
