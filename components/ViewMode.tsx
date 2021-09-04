import { isNone } from "@/lib/utils";
import { mdiViewGrid, mdiViewList } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

import { BucketViewMode } from "./Viewer";

interface ViewState {
    mode: BucketViewMode;
}

export default class ViewModeChange extends React.Component<{}, ViewState> {
    constructor(props) {
        super(props);
        this.getMdiIcon = this.getMdiIcon.bind(this);
        this.watchMode = this.watchMode.bind(this);
        this.toggleViewMode = this.toggleViewMode.bind(this);
        this.state = {
            mode: "grid",
        };
    }

    watchMode(ev: StorageEvent) {
        if (ev.key === "s3ViewMode") {
            const mode = (ev.newValue as string) || "grid";
            if (["grid", "list"].includes(mode.toLowerCase())) {
                console.info("VIEWMODE WATCH MODE, CHANGE TO", mode);
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

    getMdiIcon() {
        switch (this.state.mode) {
            case "grid":
                return mdiViewGrid;
            case "list":
                return mdiViewList;
            default:
                return mdiViewGrid;
        }
    }

    toggleViewMode() {
        const mode = this.state.mode === "grid" ? "list" : "grid";
        localStorage.setItem("s3ViewMode", mode);
        this.setState({ mode });
    }

    render() {
        const title = this.state.mode === "grid" ? "Grid" : "List";
        const titleProper = `Change view mode (Currently using ${title} mode)`;
        return (
            <div className="flex flex-row justify-end mt-2">
                <button
                    className="flex crumbs-link"
                    aria-label="Change View Mode"
                    title={titleProper}
                    onClick={() => this.toggleViewMode()}
                >
                    <Icon path={this.getMdiIcon()} size={0.9} />
                </button>
            </div>
        );
    }
}
