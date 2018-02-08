import path from 'path';
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
import {parser, babel, thread} from 'webpack-blocks-more';
import {nodeExternals} from 'webpack-universal-helpers';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import babelConfig from './babelConfig';

export default async () => {
    const context = process.cwd();

    return createConfig([
        defineConstants({
            'process.env.NODE_ENV': 'production',
            __DEV__: false,
            __BROWSER__: false,
            __base: context,
        }),

        entryPoint({
            app: './app/server/index.js',
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
            externals: [
                nodeExternals({
                    pathToPackageJson: path.resolve(context, 'app/package.json'),
                }),
            ],
        }),

        resolve({
            mainFields: ['module', 'jsnext:main', 'main'],
            modules: [context, "node_modules"],
        }),

        parser({
            amd: false,
            browserify: false,
            requireJs: false,
            system: false,
            requireInclude: false,
            requireEnsure: false,
        }),

        match(['*.js', '*.mjs'], [
            thread(),
            babel({
                ...babelConfig('server'),
                cacheDirectory: true,
                compact: false,
            }),
        ]),

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

        addPlugins([
            new CircularDependencyPlugin({exclude: /node_modules\/(?!jepa).*/}),
        ]),
    ]);
}
