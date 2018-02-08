import compression from 'compression';
import getOptions from '../../getOptions';

export default async function compress(app) {
    const options = await getOptions();

    if (options.compress) {
        const compressionOptions = typeof options.compress === 'object' ? options.compress : {};
        app.use(compression(compressionOptions));
    }
}
