module.exports = {
    root: true,
    settings: {
        react: {
            version: 'detect',
        },
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks', 'prettier', '@scrumble-nl/scrumble-rules'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
    ],
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
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
};
