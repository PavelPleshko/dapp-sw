const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
    syntax: 'postcss-scss',
    parser: 'postcss-scss',
    plugins: {
        'tailwindcss/nesting': {},
        tailwindcss: {},
        autoprefixer: {},
    }
}
