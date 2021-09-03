import React from "react";
import Router from "next/router";
import ProgressBar from "@badrap/bar-of-progress";

import "../styles/global.css";
import type { AppProps } from "next/app";

const progress = new ProgressBar({
    size: 2,
    color: "#f78458",
    className: "z-[99]",
    delay: 80,
});

Router.events.on("routeChangeStart", () => {
    progress.start();
});
Router.events.on("routeChangeComplete", () => progress.finish());
Router.events.on("routeChangeError", () => progress.finish());

function VTArchiveApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default VTArchiveApp;
