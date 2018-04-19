import {options} from '../../options';

export default async function robotsTxt(app) {
    if (options.robotsTxt) {
        app.use(`${options.basePath}/robots.txt`, (req, res) => {
            res.type('text/plain').send(options.robotsTxt);
        });
    }
}
