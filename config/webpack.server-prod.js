import path from 'path';
import fs from 'fs-extra';
import {
    createConfig,
    entryPoint,
    setOutput,
    defineConstants,
    customConfig,
    addPlugins,
    match,
    resolve,
} from '@webpack-blocks/webpack';
import uglify from '@webpack-blocks/uglify';
import {css} from '@webpack-blocks/assets';
import {parser, babel, thread, postcss} from 'webpack-blocks-more';
import extractText from '@webpack-blocks/extract-text';
import {nodeExternals} from 'webpack-universal-helpers';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import babelConfig from './babelConfig';
import getConfig from './getConfig';
import getOptions from '../src/getOptions';

export default async () => {
    const config = await getConfig();
    const {options} = await getOptions();

    const context = process.cwd();
    const jepaRoot = path.resolve(__dirname, '..');

    let basePath = options.basePath.substr(1);
    if (basePath.length > 0) {
        basePath += '/';
    }

    const pathToPackageJson = path.resolve(context, 'src/package.json');
    const hasPackageJson = await fs.pathExists(pathToPackageJson);
    const externals = hasPackageJson ? [nodeExternals({pathToPackageJson})] : [];

    return createConfig([
        defineConstants({
            'process.env.NODE_ENV': 'production',
            __DEV__: false,
            __BROWSER__: false,
            __base: context,
        }),

        entryPoint({
            app: 'src/server/index.js',
        }),

        setOutput({
            filename: '[name].js',
            path: path.resolve(context, '.jepa/prod/'),
            pathinfo: true,
        }),

        customConfig({
            context,
            target: 'node',
            module: {
                strictExportPresence: true,
            },
            externals,
        }),

        resolve({
            mainFields: ['module', 'jsnext:main', 'main'],
            modules: [context, jepaRoot, 'node_modules'],
        }),

        parser({
            amd: false,
            browserify: false,
            requireJs: false,
            system: false,
            requireInclude: false,
            requireEnsure: false,
        }),

        match(
            ['*.js', '*.mjs'],
            [
                thread(),
                babel({
                    ...babelConfig('server'),
                    cacheDirectory: true,
                    compact: false,
                }),
            ]
        ),

        match(
            '*.css',
            [
                css({
                    styleLoader: false,
                    minimize: true,
                }),
                config.postcss && postcss(config.postcss),
                extractText({
                    filename: `${basePath}__static/css/[contenthash:20].css`,
                    allChunks: true,
                    ignoreOrder: true,
                    disable: true,
                }),
            ].filter(Boolean)
        ),

        uglify({
            uglifyOptions: {
                ecma: 7,
                ie8: false,
                mangle: false,
                compress: {
                    sequences: false,
                    dead_code: true,
                    properties: true,
                    comparisons: false,
                    typeofs: false,
                    keep_infinity: true,
                },
                output: {
                    beautify: true,
                },
                warnings: true,
            },
        }),

        addPlugins([new CircularDependencyPlugin({exclude: /node_modules\/(?!jepa).*/})]),
    ]);
};
