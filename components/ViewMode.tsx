import { mdiViewGrid, mdiViewList } from "@mdi/js";
import Icon from "@mdi/react";
import React from "react";

import type { BucketViewMode } from "./Viewer";

interface ViewState {
    mode: BucketViewMode;
}

interface ViewProps {
    initial: BucketViewMode;
    onChange: (mode: BucketViewMode) => void;
}

export default class ViewModeChange extends React.Component<ViewProps> {
    constructor(props) {
        super(props);
        this.getMdiIcon = this.getMdiIcon.bind(this);
        this.toggleViewMode = this.toggleViewMode.bind(this);
    }

    getMdiIcon() {
        switch (this.props.initial) {
            case "grid":
                return mdiViewGrid;
            case "list":
                return mdiViewList;
            default:
                return mdiViewGrid;
        }
    }

    toggleViewMode() {
        const mode = this.props.initial === "grid" ? "list" : "grid";
        this.setState({ mode }, () => {
            this.props.onChange(mode);
            localStorage.setItem("s3ViewMode", mode);
        });
    }

    render() {
        const title = this.props.initial === "grid" ? "Grid" : "List";
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
