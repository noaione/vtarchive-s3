import React from "react";
import Document, { DocumentContext, Head, Html, Main, NextScript } from "next/document";

import { InlineJs } from "@kachkaev/react-inline-js";

const THEME_CHECKER_JS = `
// Helper
const isNullified = function(data) {
    return typeof data === "undefined" || data === null;
}

// Check for first user preferences.
let userPreferDark;
let systemPreferDark = false;
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    systemPreferDark = true;
}
try {
    const themeStorage = localStorage.getItem("theme");
    if (!isNullified(themeStorage)) {
        userPreferDark = themeStorage === "dark" ? true : false;
    }
} catch (e) {};
if (isNullified(userPreferDark)) {
    if (systemPreferDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
} else {
    if (userPreferDark) {
        document.documentElement.classList.add("dark");
    }
}

// Theme toggler
const toggleTheme = function() {
    try {
        const isDark = document.documentElement.classList.contains("dark");
        isDark ? document.documentElement.classList.remove("dark") : document.documentElement.classList.add("dark");
        localStorage.setItem("theme", isDark ? "light" : "dark");
    } catch (e) {};
};
`;

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html>
                <Head>
                    <InlineJs code={THEME_CHECKER_JS} />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
