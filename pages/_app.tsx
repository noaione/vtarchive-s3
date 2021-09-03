import React from "react";

import "../styles/global.css";
import type { AppProps } from "next/app";

function VTArchiveApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default VTArchiveApp;
