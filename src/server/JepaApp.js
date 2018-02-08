import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import sslRedirect from './middleware/sslRedirect';
import compress from './middleware/compress';
import serveFavicon from './middleware/serveFavicon';
import robotsTxt from './middleware/robotsTxt';
import manifestJson from './middleware/manifestJson';
import renderApp from './middleware/renderApp';
import getOptions from '../getOptions'

export default class JepaApp {
    async init() {
        const app = this.app = express().disable('x-powered-by');

        await sslRedirect(app);

        app.use(morgan(':method :url :status :response-time ms'));

        app.use(helmet({noCache: !__DEV__}));

        await compress(app);

        if (__DEV__) {
            const devServerProxy = (await import('./middleware/devServerProxy')).default;
            await devServerProxy(app);
        }
        else {
            app.use('/static', express.static('static/', {index: false}));
            await serveFavicon(app);
        }

        await robotsTxt(app);
        await manifestJson(app);

        app.use(bodyParser.json({}));
        app.use(bodyParser.urlencoded({extended: true}));
    }

    async start() {
        const options = await getOptions();

        const routes = await options.routes();
        routes(this.app);
        renderApp(this.app);

        this.app.listen(options.port, options.host, (err) => {
            if (err) {
                console.error(err);
            }
            else {
                const msg = ` ${options.name} on ${options.port} `;
                const line = '='.repeat(msg.length);
                console.log(`\n\t${line}\n\t${msg}\n\t${line}\n`);
            }
        });
    }
}
