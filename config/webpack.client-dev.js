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
import devServer from '@webpack-blocks/dev-server';
import {parser, babel, thread} from 'webpack-blocks-more';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import babelConfig from './babelConfig';
import getOptions from '../src/getOptions';

export default async () => {
    const context = process.cwd();
    const options = await getOptions();

    return createConfig([
        defineConstants({
            'process.env.NODE_ENV': 'development',
            __DEV__: true,
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
            app: [
                'jepa/src/client/index.js',
                'webpack/hot/dev-server',
                `webpack-dev-server/client?http://${options.host}:${options.clientDevServerPort}/`,
            ],
        }),

        setOutput({
            filename: 'js/[name].js',
            chunkFilename: 'js/chunk.[name].js',
            publicPath: '/build/',
            pathinfo: true,
        }),

        customConfig({
            target: 'web',
            devtool: 'eval',
            module: {
                strictExportPresence: true,
            },
        }),

        resolve({
            mainFields: ['module', 'jsnext:main', 'main'],
            // mainFields: ['module', 'jsnext:main', 'browser', 'main'],
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
            babel({...babelConfig('development'), cacheDirectory: true}),
        ]),

        devServer({
            publicPath: '/build/',
            disableHostCheck: true,
            clientLogLevel: 'error',
            // Enable gzip compression of generated files.
            compress: true,
            // watchContentBase: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            historyApiFallback: {
                // Paths with dots should still use the history fallback.
                // See https://github.com/facebookincubator/create-react-app/issues/387.
                disableDotRule: true,
            },
            host: options.host,
            noInfo: true,
            overlay: true,
            port: options.clientDevServerPort,
            //quiet: true,
            watchOptions: {
                ignored: /node_modules/,
            },
        }),

        addPlugins([
            new webpack.NoEmitOnErrorsPlugin(),

            new webpack.optimize.CommonsChunkPlugin({
                chunks: ['vendor'],
                async: 'js/[name].js',
                minChunks: Infinity,
            }),

            new CircularDependencyPlugin({exclude: /node_modules\/(?!jepa).*/}),
        ]),
    ]);

}

