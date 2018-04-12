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
import {parser, babel} from 'webpack-blocks-more';
import {nodeExternals} from 'webpack-universal-helpers';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import babelConfig from './babelConfig';

export default async () => {
    const context = process.cwd();
    const jepaRoot = path.resolve(__dirname, '..');

    const pathToPackageJson = path.resolve(context, 'src/package.json');
    const hasPackageJson = await fs.pathExists(pathToPackageJson);
    const externals = hasPackageJson ? [nodeExternals({pathToPackageJson})] : [];

    return createConfig([
        defineConstants({
            'process.env.NODE_ENV': 'development',
            __DEV__: true,
            __BROWSER__: false,
            __base: context,
        }),

        entryPoint({
            app: 'src/server/index.js',
        }),

        setOutput({
            filename: '[name].js',
            path: path.resolve(context, '.jepa/dev/'),
            pathinfo: true,
        }),

        customConfig({
            context,
            target: 'node',
            watch: true,
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

        match(['*.js', '*.mjs'], [babel({...babelConfig('server'), cacheDirectory: true})]),

        addPlugins([new CircularDependencyPlugin({exclude: /node_modules\/(?!jepa).*/})]),
    ]);
};
