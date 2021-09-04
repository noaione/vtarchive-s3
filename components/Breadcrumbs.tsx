import React from "react";
import Link from "next/link";

import Icon from "@mdi/react";
import { mdiHome } from "@mdi/js";
import { isNone, Nullable } from "@/lib/utils";

interface BreadcrumbsProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    path?: string;
    isViewMode?: boolean;
}

function generateCrumbs(path?: Nullable<string>, ignoreLast = false) {
    if (isNone(path)) {
        return null;
    }
    if (path.startsWith("/")) {
        path = path.substring(1);
    }

    const crumbs = path.split("/");
    const crumbList: JSX.Element[] = [];

    crumbs.forEach((crumb, index) => {
        crumb = decodeURIComponent(crumb);
        const crumbPath = `/${crumbs.slice(0, index + 1).join("/")}`;
        crumbList.push(<span key={`crumb-sep-${index}`}>/</span>);
        if (index === crumbs.length - 1 && !ignoreLast) {
            crumbList.push(<span key={`crumb-${crumb}-${index}`}>{crumb}</span>);
        } else {
            crumbList.push(
                <Link href={crumbPath} key={`crumb-${crumb}-${index}`}>
                    <a className="crumbs-link">{crumb}</a>
                </Link>
            );
        }
    });

    return crumbList;
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
    const { path, className, isViewMode, ...rest } = props;

    const crumbs = generateCrumbs(path, isViewMode);

    return (
        <div {...rest} className={`flex flex-row gap-2 ${className ?? ""}`}>
            <Link href="/" passHref>
                <a className="crumbs-link">
                    <Icon path={mdiHome} size={1} />
                </a>
            </Link>
            <span>/</span>
            <Link href="/" key={`crumb-/`}>
                <a className="crumbs-link">Home</a>
            </Link>
            {!isNone(crumbs) && crumbs}
        </div>
    );
}
