import Head from "next/head";
import React from "react";
import { fetchList } from "@/lib/api";
import { VTObject, VTPath } from "@/lib/s3";
import CocoHeader from "@/components/CocoHeader";
import BucketViewer from "@/components/Viewer";
import FooterSection from "@/components/FooterSection";
import ViewModeChange from "@/components/ViewMode";

interface IndexState {
    isLoading: boolean;
    paths: VTPath[];
    files: VTObject[];
}

class S3BucketMainViewer extends React.Component<{}, IndexState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            paths: [],
            files: [],
        };
    }

    async componentDidMount() {
        const paths = await fetchList();
        const onlyPaths = paths.filter((path) => path.type === "FOLDER");
        const onlyFiles = paths.filter((path) => path.type === "FILE");
        this.setState({ isLoading: false, paths: onlyPaths as VTPath[], files: onlyFiles as VTObject[] });
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
                        isLoading={this.state.isLoading}
                    />
                    <FooterSection count={itemCount} />
                </main>
            </React.Fragment>
        );
    }
}

export default S3BucketMainViewer;
