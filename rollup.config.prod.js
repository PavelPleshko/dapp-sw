import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import sourcemaps from 'rollup-plugin-sourcemaps';
import summary from 'rollup-plugin-summary';
import { terser } from 'rollup-plugin-terser';
import baseConfig from './rollup.config';

export default {
    ...baseConfig,
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
        minifyHTML(),
        terser(),
        sourcemaps(),
        copy({
            patterns: [
                'index.html',
            ],
            rootDir: './src',
        }),
        summary(),
    ],
}
