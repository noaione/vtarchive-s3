import React from "react";

export default function LoadingContainer() {
    return (
        <div className="flex flex-col w-full h-[240px] bg-gray-500 animate-pulse text-center justify-center">
            <div className="text-xl font-extrabold">Loading content...</div>
        </div>
    );
}
