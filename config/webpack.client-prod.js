import path from 'path';
import webpack from 'webpack';
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
import CopyPlugin from 'copy-webpack-plugin';
import {StatsWriterPlugin} from 'webpack-stats-plugin';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import ReactLoadablePlugin from './reactLoadableWebpack';
import babelConfig from './babelConfig';

export default async () => {
    const context = process.cwd();

    return createConfig([
        defineConstants({
            'process.env.NODE_ENV': 'production',
            __DEV__: false,
            __BROWSER__: true,
            __base: context,
        }),

        entryPoint({
            vendor: [
                '@babel/polyfill',
                'react',
                'react-dom',
                'react-redux',
                'redux',
            ],
            app: 'jepa/src/client/index.js',
        }),

        setOutput({
            filename: 'useless/[name].js',
            chunkFilename: 'static/js/chunk.[chunkhash].js',
            path: path.resolve(context, '.jepa/prod/'),
            pathinfo: false,
        }),

        customConfig({
            context,
            target: 'web',
            module: {
                strictExportPresence: true,
            },
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
                ...babelConfig('production'),
                cacheDirectory: true,
                compact: false,
            }),
        ]),

        uglify({
            uglifyOptions: {
                ie8: false,
                ecma: 5,
                mangle: true,
                compress: {
                    drop_console: true,
                    dead_code: true,
                },
                output: {
                    comments: false,
                    beautify: false,
                },
                warnings: false,
            },
        }),

        addPlugins([
            new CopyPlugin([{
                context,
                from: './app/client/static/',
                to: './static/',
            }]),

            new webpack.optimize.CommonsChunkPlugin({
                names: ['app', 'vendor'],
                chunks: ['app'],
                filename: 'static/js/[name].[chunkhash].js',
                minChunks: Infinity,
            }),

            new ReactLoadablePlugin({
                filename: './.jepa/prod/react-loadable.json',
            }),

            new StatsWriterPlugin({
                filename: 'meta.json',
                fields: ['chunks', 'modules'],
                transform: (data) => {
                    const result = {
                        __css: [],
                        __fonts: [],
                    };

                    for (const module of data.modules) {
                        if (!/(node_modules|webpack|multi)/.test(module.name) && module.assets.length > 0) {
                            result.__css.push(...module.assets.filter(filename => /\.css$/.test(filename)));
                            result.__fonts.push(...module.assets.filter(filename => /\.woff2?$/.test(filename)));
                        }
                    }

                    for (const chunk of data.chunks) {
                        const name = chunk.names.join(' ');

                        if (chunk.id in result) {
                            result[chunk.id] = chunk.files;
                            if (name) {
                                result[name] = result[chunk.id];
                                delete result[chunk.id];
                            }
                        }
                        else if (name && name !== '_rest') {
                            result[name] = chunk.files;
                        }
                    }

                    return JSON.stringify(result, null, 2);
                },
            }),

            new CircularDependencyPlugin({exclude: /node_modules\/(?!jepa).*/}),
        ]),
    ]);
}
