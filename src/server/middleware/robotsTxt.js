import getOptions from '../../getOptions';

export default async function robotsTxt(app) {
    const {options} = await getOptions();
    if (options.robotsTxt) {
        app.use(`${options.basePath}/robots.txt`, (req, res) => {
            res.type('text/plain').send(options.robotsTxt);
        });
    }
}
