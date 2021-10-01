import Head from "next/head";
import React from "react";
import { fetchList } from "@/lib/api";
import { VTObject, VTPath } from "@/lib/s3";
import CocoHeader from "@/components/CocoHeader";
import BucketViewer, { BucketViewMode } from "@/components/Viewer";
import FooterSection from "@/components/FooterSection";
import ViewModeChange from "@/components/ViewMode";
import { isNone } from "@/lib/utils";

interface IndexState {
    isLoading: boolean;
    paths: VTPath[];
    files: VTObject[];
    viewMode: BucketViewMode;
}

class S3BucketMainViewer extends React.Component<{}, IndexState> {
    constructor(props) {
        super(props);
        this.watchMode = this.watchMode.bind(this);
        this.changeViewModeFromClick = this.changeViewModeFromClick.bind(this);
        this.state = {
            isLoading: true,
            paths: [],
            files: [],
            viewMode: "grid",
        };
    }

    watchMode(ev: StorageEvent) {
        if (ev.key === "s3ViewMode") {
            const mode = (ev.newValue as string) || "grid";
            if (["grid", "list"].includes(mode.toLowerCase())) {
                console.info("VIEWER WATCH MODE, CHANGE TO", mode);
                this.setState({ viewMode: mode as BucketViewMode });
            }
        }
    }

    async componentDidMount() {
        const s3Options = localStorage.getItem("s3ViewMode");
        if (isNone(s3Options)) {
            localStorage.setItem("s3ViewMode", "grid");
        } else {
            const mode = (s3Options as string) || "grid";
            if (["grid", "list"].includes(mode.toLowerCase())) {
                this.setState({ viewMode: mode as BucketViewMode });
            }
        }
        window.addEventListener("storage", this.watchMode);

        const paths = await fetchList();
        const onlyPaths = paths.filter((path) => path.type === "FOLDER");
        const onlyFiles = paths.filter((path) => path.type === "FILE");
        this.setState({ isLoading: false, paths: onlyPaths as VTPath[], files: onlyFiles as VTObject[] });
    }

    changeViewModeFromClick(mode: BucketViewMode) {
        console.info("Called?", mode);
        this.setState({ viewMode: mode });
    }

    render() {
        const itemCount = this.state.paths.length + this.state.files.length;
        return (
            <React.Fragment>
                <Head>
                    <title>VTHell Archive</title>
                    <meta name="description" content="An archive of VTuber stuff" />
                </Head>
                <main className="py-8 quick-container">
                    <CocoHeader />
                    <ViewModeChange initial={this.state.viewMode} onChange={this.changeViewModeFromClick} />
                    <hr className="mt-4" />
                    <BucketViewer
                        files={this.state.files}
                        folders={this.state.paths}
                        isLoading={this.state.isLoading}
                        viewMode={this.state.viewMode}
                    />
                    <FooterSection count={itemCount} />
                </main>
            </React.Fragment>
        );
    }
}

export default S3BucketMainViewer;
