import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import sslRedirect from './middleware/sslRedirect';
import compress from './middleware/compress';
import serveFavicon from './middleware/serveFavicon';
import robotsTxt from './middleware/robotsTxt';
import manifestJson from './middleware/manifestJson';
import render from './render';
import getOptions from '../getOptions';

export default async function createJepaApp() {
    const {options} = await getOptions();

    // init

    const app = express().disable('x-powered-by');

    await sslRedirect(app);

    app.use(morgan(':method :url :status :response-time ms'));

    app.use(helmet({noCache: !__DEV__}));

    await compress(app);

    if (__DEV__) {
        const devServerProxy = (await import('./middleware/devServerProxy')).default;
        await devServerProxy(app);
    }
    else {
        app.use(`${options.basePath}/__static`, express.static(`${options.basePathRel}__static/`, {index: false}));
        await serveFavicon(app);
    }

    await robotsTxt(app);
    await manifestJson(app);

    app.use(bodyParser.json({}));
    app.use(bodyParser.urlencoded({extended: true}));

    // start

    const appRouter = new express.Router();
    // Игнорируем всё, что начинается на __static или содержит точку
    appRouter.route(/^\/(?!__static|.*\.).*$/i).get(async (req, res, next) => {
        res.locals.location = req.url;

        try {
            // Render the view
            const result = await render(res.locals);
            res
                .type('html')
                .status(200)
                .send(result);
        }
        catch (e) {
            console.error(e);
            next();
        }
    });

    const routerUseArgs = [options.basePath];
    if (typeof options.getRouter === 'function') {
        routerUseArgs.push(await options.getRouter());
    }
    routerUseArgs.push(appRouter);

    app.use(...routerUseArgs);

    app.listen(options.port, options.host, (error) => {
        if (error) {
            console.error(error);
        }
        else {
            const msg = ` ${options.name} on ${options.port} `;
            const line = '='.repeat(msg.length);
            console.log(`\n\t${line}\n\t${msg}\n\t${line}\n`);
        }
    });

    return app;
}
