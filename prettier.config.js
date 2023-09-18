module.exports = {
    plugins: [require('prettier-plugin-tailwindcss')],
    tailwindConfig: './tailwind.config.cjs',
    trailingComma: 'es5',
    semi: true,
    singleQuote: true,
    printWidth: 150,
    tabWidth: 2,
};
