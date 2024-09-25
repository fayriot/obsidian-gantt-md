module.exports = {
    printWidth: 200,
    tabWidth: 4,
    endOfLine: 'crlf',
    useTabs: false,
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    bracketSpacing: false,
    arrowParens: 'avoid',
    overrides: [
        {
            files: '*.js',
            options: {
                parser: 'babel',
            },
        },
        {
            files: '*.ts',
            options: {
                parser: 'typescript',
            },
        },
        {
            files: '*.md',
            options: {
                parser: 'markdown',
            },
        },
        {
            files: '*.json',
            options: {
                parser: 'json',
            },
        },
        {
            files: '.prettierrc',
            options: {
                parser: 'json',
            },
        },
        {
            files: '*.css',
            options: {
                parser: 'css',
            },
        },
    ],
};

