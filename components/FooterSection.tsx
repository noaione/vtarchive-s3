import Link from "next/link";
import Icon from "@mdi/react";

import { mdiGithub } from "@mdi/js";

interface FooterProps {
    count?: number;
}

export default function FooterSection(props: FooterProps) {
    const { count } = props;
    return (
        <footer className="mt-6">
            {typeof count === "number" ? (
                <div data-content={`Total ${count} items`} className="is-divider" />
            ) : (
                <hr />
            )}
            <div className="mt-6 flex flex-row gap-0 items-center justify-center">
                <div className="flex bg-gray-600 text-sm px-3 py-2 font-medium">
                    <Link href="https://github.com/noaione/vtarchive-s3">
                        <span className="hover:underline cursor-pointer">vtarchive-s3</span>
                    </Link>
                </div>
                <div className="flex flex-row items-center bg-gray-200 text-sm px-3 py-2 font-medium text-gray-700">
                    <span>MIT</span>
                    <Icon path={mdiGithub} size={0.7} className="ml-1" />
                </div>
            </div>
        </footer>
    );
}
