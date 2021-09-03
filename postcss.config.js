const isProd = process.env.NODE_ENV === "production";

const usePlugins = [
    "postcss-import",
    "tailwindcss",
    "postcss-extend",
    "postcss-flexbugs-fixes",
    [
        "postcss-preset-env",
        {
            autoprefixer: {
                flexbox: "no-2009",
            },
            stage: 3,
            features: {
                "custom-properties": false,
                "nesting-rules": true,
            },
        },
    ],
    "autoprefixer",
];

if (isProd) {
    usePlugins.push("cssnano");
}

module.exports = {
    plugins: usePlugins,
};
