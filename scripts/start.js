import webpack from 'webpack';
import {watchServer} from 'webpack-universal-helpers';
import DevServer from 'webpack-dev-server';
import {cleanDir, installDeps} from './_core';
import webpackConfig from '../configs/webpackConfig';
import getOptions from '../src/getOptions';

async function start() {
    const {options} = await getOptions();

    await cleanDir();
    await installDeps();

    watchServer({
        webpackConfig: await webpackConfig({target: 'node', env: 'dev'}),
        bundlePath: 'app.js',
        cwd: '.jepa/dev/',
    });

    console.log('Compiling client...');

    const clientConfig = await webpackConfig({target: 'web', env: 'dev'});
    const clientCompiler = webpack(clientConfig);
    const clientDevServer = new DevServer(clientCompiler, clientConfig.devServer);

    const server = clientDevServer.listen(options.clientDevServerPort, options.host, (error) => {
        if (error) {
            console.error(error);
        }
    });

    ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGQUIT', 'exit', 'uncaughtException'].forEach((sig) => {
        process.on(sig, () => {
            server.close(() => {
                process.exit();
            });
        });
    });
}

start().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
