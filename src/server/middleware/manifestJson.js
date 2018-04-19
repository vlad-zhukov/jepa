import {options} from '../../options';

export default async function manifestJson(app) {
    if (options.manifestJson) {
        const manifest = {
            name: options.name,
            ...options.manifestJson,
        };

        app.use(`${options.basePath}/manifest.json`, (req, res) => {
            res.json(manifest);
        });
    }
}
