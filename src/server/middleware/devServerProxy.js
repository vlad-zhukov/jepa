import proxy from 'http-proxy-middleware';
import getOptions from '../../getOptions';

export default async function devServerProxy(app) {
    const {options} = await getOptions();
    app.use(
        proxy(`${options.basePath}/__static`, {
            target: `http://${options.host}:${options.clientDevServerPort}/`,
            changeOrigin: true,
        })
    );
}
