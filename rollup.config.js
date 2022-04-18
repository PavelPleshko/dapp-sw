import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { copy } from '@web/rollup-plugin-copy';

export default {
    input: './dist/main.js',
    output: {
        file: './dist/main.bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        resolve({
            browser: true,
        }),
        commonjs(),
        copy({
            patterns: [
                'index.html',
            ],
            rootDir: './src',
        }),
    ],
    onwarn (warning, warn) {

        // skip certain warnings
        if (warning.code === 'THIS_IS_UNDEFINED') return;

        // Use default for everything else
        warn(warning);
    },
};
