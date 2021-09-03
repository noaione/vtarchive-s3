import React from "react";

export default function NoContent() {
    return (
        <div className="flex flex-col w-full h-[240px] text-center justify-center">
            <div className="flex items-center justify-center">
                <img src="https://cdn.discordapp.com/emojis/759030054583140394.png" className="w-auto h-20" />
            </div>
            <div className="flex flex-col mt-4">
                <div className="text-lg font-semibold">
                    Sorry, but we cannot find that /path/ in the bucket
                </div>
            </div>
        </div>
    );
}
