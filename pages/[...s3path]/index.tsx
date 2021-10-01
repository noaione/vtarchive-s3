import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { fetchList } from "@/lib/api";
import { VTObject, VTPath } from "@/lib/s3";
import CocoHeader from "@/components/CocoHeader";
import BucketViewer, { BucketViewMode } from "@/components/Viewer";

import { GetServerSidePropsContext } from "next";
import { isNone } from "@/lib/utils";
import FooterSection from "@/components/FooterSection";
import ViewModeChange from "@/components/ViewMode";

interface IndexState {
    isLoading: boolean;
    paths: VTPath[];
    files: VTObject[];
    viewMode: BucketViewMode;
}

interface S3BucketProps {
    s3path: string;
}

class S3BucketPathViewer extends React.Component<S3BucketProps, IndexState> {
    constructor(props) {
        super(props);
        this.requestListing = this.requestListing.bind(this);
        this.changeViewModeFromClick = this.changeViewModeFromClick.bind(this);
        this.watchMode = this.watchMode.bind(this);
        this.state = {
            isLoading: true,
            paths: [],
            files: [],
            viewMode: "grid",
        };
    }

    async requestListing(s3path?: string) {
        this.setState({ isLoading: true, paths: [], files: [] });
        const paths = await fetchList(decodeURIComponent(s3path));
        const onlyPaths = paths.filter((path) => path.type === "FOLDER");
        const onlyFiles = paths.filter((path) => path.type === "FILE");
        this.setState({ isLoading: false, paths: onlyPaths as VTPath[], files: onlyFiles as VTObject[] });
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

        let { s3path } = this.props;
        if (s3path.startsWith("/")) {
            s3path = s3path.slice(1);
        }
        await this.requestListing(s3path);
    }

    async componentDidUpdate(prevProps: S3BucketProps) {
        if (prevProps.s3path !== this.props.s3path) {
            let { s3path } = this.props;
            if (s3path.startsWith("/")) {
                s3path = s3path.slice(1);
            }
            await this.requestListing(s3path);
        }
    }

    async componentWillUnmount() {
        window.removeEventListener("storage", this.watchMode);
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
                        crumbs={this.props.s3path}
                        isLoading={this.state.isLoading}
                        viewMode={this.state.viewMode}
                    />
                    <FooterSection count={itemCount} />
                </main>
            </React.Fragment>
        );
    }
}

export default withRouter(S3BucketPathViewer);

export async function getServerSideProps(context: GetServerSidePropsContext) {
    let { s3path } = context.query;
    if (isNone(s3path)) {
        return {
            notFound: true,
        };
    }

    if (typeof s3path === "string") {
        s3path = [s3path];
    }

    const joinPath = s3path.join("/");

    return {
        props: {
            s3path: joinPath,
        },
    };
}
