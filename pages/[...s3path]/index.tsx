import Head from "next/head";
import { withRouter } from "next/router";
import React from "react";
import { fetchList } from "@/lib/api";
import { VTObject, VTPath } from "@/lib/s3";
import CocoHeader from "@/components/CocoHeader";
import BucketViewer from "@/components/Viewer";

import { GetServerSidePropsContext } from "next";
import { isNone } from "@/lib/utils";
import FooterSection from "@/components/FooterSection";
import ViewModeChange from "@/components/ViewMode";

interface IndexState {
    isLoading: boolean;
    paths: VTPath[];
    files: VTObject[];
}

interface S3BucketProps {
    s3path: string;
}

class S3BucketPathViewer extends React.Component<S3BucketProps, IndexState> {
    constructor(props) {
        super(props);
        this.requestListing = this.requestListing.bind(this);
        this.state = {
            isLoading: true,
            paths: [],
            files: [],
        };
    }

    async requestListing(s3path?: string) {
        this.setState({ isLoading: true, paths: [], files: [] });
        const paths = await fetchList(decodeURIComponent(s3path));
        const onlyPaths = paths.filter((path) => path.type === "FOLDER");
        const onlyFiles = paths.filter((path) => path.type === "FILE");
        this.setState({ isLoading: false, paths: onlyPaths as VTPath[], files: onlyFiles as VTObject[] });
    }

    async componentDidMount() {
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
                    <ViewModeChange />
                    <hr className="mt-4" />
                    <BucketViewer
                        files={this.state.files}
                        folders={this.state.paths}
                        crumbs={this.props.s3path}
                        isLoading={this.state.isLoading}
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
