module.exports = {
    productionBrowserSourceMaps: true,
    experimental: {
        // Replaces Babel (transforms ran against first-party code) with next-swc
        swcLoader: true,
        // Replaces Terser (minifier) with next-swc
        swcMinify: true,
        // Use ESM
        esmExternals: true,
    },
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    {
                        key: "Permissions-Policy",
                        value: "interest-cohort=()",
                    },
                ],
            },
        ];
    },
};
