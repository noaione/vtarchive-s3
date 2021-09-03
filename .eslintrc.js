module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
    ],
    env: {
        node: true,
        es6: true,
        browser: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        quotes: [
            "error",
            "double",
            {
                allowTemplateLiterals: true,
            },
        ],
        semi: [
            "error",
            "always",
            {
                omitLastInOneLineBlock: true,
            },
        ],
        "no-trailing-spaces": "error",
        "max-len": [
            "error",
            {
                code: 110,
                tabWidth: 4,
                ignoreComments: true,
                ignoreUrls: true,
                ignoreRegExpLiterals: true,
                ignoreTemplateLiterals: true,
                ignoreStrings: true,
            },
        ],
        "comma-dangle": [
            "error",
            {
                arrays: "only-multiline",
                objects: "only-multiline",
                functions: "never",
                imports: "only-multiline",
                exports: "never",
            },
        ],
        "no-empty": ["error", { allowEmptyCatch: true }],
        "eol-last": ["warn", "always"],
        "no-constant-condition": ["error", { checkLoops: false }],
        "sort-imports": [
            "warn",
            {
                ignoreCase: true,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "single", "multiple"],
                allowSeparatedGroups: true,
            },
        ],
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-inferrable-types": ["warn", { ignoreParameters: true }],
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
            },
        ],
        radix: "off",
        "no-plusplus": "off",
        "no-await-in-loop": "off",
        camelcase: "off",
        "consistent-return": "off",
        "no-continue": "off",
        "no-underscore-dangle": ["warn", { allowFunctionParams: true }],
        "dot-notation": ["warn", { allowPattern: "^[a-z]+(_[a-z]+)+$" }],
        "react/react-in-jsx-scope": 0,
        "react/display-name": 0,
        "react/prop-types": 0,
    },
    overrides: [
        {
            files: ["**/*.js"],
            rules: {
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/": "off",
            },
        }
    ],
};
