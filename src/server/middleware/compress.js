import compression from 'compression';
import {options} from '../../options';

export default async function compress(app) {
    if (options.compress) {
        const compressionOptions = typeof options.compress === 'object' ? options.compress : {};
        app.use(compression(compressionOptions));
    }
}
