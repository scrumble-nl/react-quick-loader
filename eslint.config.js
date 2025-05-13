import js from '@eslint/js';
import {FlatCompat} from '@eslint/eslintrc';
import prettier from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import {defineConfig, globalIgnores} from 'eslint/config';
import {fixupConfigRules, fixupPluginRules} from '@eslint/compat';
import scrumbleNlScrumbleRules from '@scrumble-nl/eslint-plugin-scrumble-rules';

const compat = new FlatCompat({
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default defineConfig([
    {
        settings: {
            react: {
                version: 'detect',
            },
        },

        languageOptions: {
            parser: tsParser,

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        plugins: {
            'react-hooks': fixupPluginRules(reactHooks),
            prettier,
            '@scrumble-nl/scrumble-rules': scrumbleNlScrumbleRules,
        },

        extends: fixupConfigRules(
            compat.extends(
                'eslint:recommended',
                'plugin:@typescript-eslint/recommended',
                'prettier',
                'plugin:react/recommended',
                'plugin:react-hooks/recommended',
            ),
        ),

        rules: {
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            'no-console': 'warn',
            'no-useless-escape': 'off',
            '@scrumble-nl/scrumble-rules/sort-imports': 'error',
            'prettier/prettier': 'warn',
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'react/display-name': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'error',
        },
    },
    globalIgnores(['node_modules', 'public', 'vendor', 'lib']),
]);
