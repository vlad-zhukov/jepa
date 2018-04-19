import serveFav from 'serve-favicon';
import {options} from '../../options';

export default async function serveFavicon(app) {
    if (options.favicon) {
        app.use(serveFav(options.favicon));
    }
}
