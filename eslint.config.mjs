import { defineConfig } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-plugin-prettier";
import scrumbleNlScrumbleRules from "@scrumble-nl/eslint-plugin-scrumble-rules";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: fixupConfigRules(compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
    )),

    plugins: {
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        prettier,
        "@scrumble-nl/scrumble-rules": scrumbleNlScrumbleRules,
    },

    languageOptions: {
        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-inferrable-types": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "no-console": "warn",
        "no-useless-escape": "off",
        "@scrumble-nl/scrumble-rules/sort-imports": "error",
        "prettier/prettier": "warn",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/display-name": "off",
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
    },
}]);