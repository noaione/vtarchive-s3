import React from "react";
import Link from "next/link";

import Icon from "@mdi/react";
import { mdiHome } from "@mdi/js";
import { isNone, Nullable } from "@/lib/utils";

interface BreadcrumbsProps
    extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    path?: string;
}

function generateCrumbs(path?: Nullable<string>) {
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
        crumbList.push(<span>/</span>);
        crumbList.push(
            <Link href={crumbPath} key={`crumb-${crumb}`}>
                <a className="crumbs-link">{crumb}</a>
            </Link>
        );
    });

    return crumbList;
}

export default function Breadcrumbs(props: BreadcrumbsProps) {
    const { path, className, ...rest } = props;

    const crumbs = generateCrumbs(path);

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
