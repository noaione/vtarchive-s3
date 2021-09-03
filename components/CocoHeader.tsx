/**
 * Sadge :(
 *
 * This component will show Coco banging a clock waking you up
 * basically the header of the page.
 */

import Link from "next/link";

export default function CocoHeader() {
    return (
        <div className="flex flex-col items-center">
            <div className="flex">
                <img
                    src="https://media.discordapp.net/attachments/558322816995426305/687238504190574598/CocoOkite.gif"
                    className="w-auto h-60"
                />
            </div>
            <div className="flex flex-col items-center mt-4 text-gray-200">
                <h1 className="font-bold text-2xl">N4O VTuber Recorded Streams</h1>
                <p className="mt-1">All recorded stream in here are saved on a S3 bucket</p>
                <p className="mt-1">
                    Recorded/Archived with{" "}
                    <Link href="https://github.com/noaione/vthell">
                        <span className="coco-link">VTHell</span>
                    </Link>
                </p>
                <div className="flex flex-row gap-2 items-center">
                    <Link href="https://vthui.n4o.xyz">
                        <span className="coco-link">WebUI</span>
                    </Link>
                    <span className="text-lg text-gray-300">|</span>
                    <Link href="https://vthui.n4o.xyz/records">
                        <span className="coco-link">Listing</span>
                    </Link>
                </div>
                <small>Site managed and run by N4O#8868</small>
            </div>
        </div>
    );
}
