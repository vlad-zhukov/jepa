import proxy from 'http-proxy-middleware';
import {options} from '../../options';

export default async function devServerProxy(app) {
    app.use(
        proxy(`${options.basePath}/__static`, {
            target: `http://${options.host}:${options.clientDevServerPort}/`,
            changeOrigin: true,
            pathRewrite: {
                [`${options.basePath}/__static`]: '/__static',
            },
        })
    );
}
