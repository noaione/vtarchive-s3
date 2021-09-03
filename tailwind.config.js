module.exports = {
    mode: "jit",
    purge: [
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./styles/**/*.{css,pcss,postcss}",
    ],
    darkMode: "class", // or 'media' or 'class'
    theme: {},
    variants: {
        extend: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    plugins: [],
};
