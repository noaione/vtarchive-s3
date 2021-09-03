const colors = require("tailwindcss/colors");

module.exports = {
    mode: "jit",
    purge: [
        "./components/**/*.{js,ts,jsx,tsx}",
        "./lib/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                gray: colors.trueGray,
            },
        },
    },
    variants: {
        extend: {},
    },
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    plugins: [],
};
