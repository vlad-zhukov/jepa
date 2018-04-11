import getOptions from '../../getOptions';

export default async function manifestJson(app) {
    const {options} = await getOptions();
    if (options.manifestJson) {
        const manifest = {
            name: options.name,
            ...options.manifestJson,
        };

        app.use('/manifest.json', (req, res) => {
            res.json(manifest);
        });
    }
}
