import serveFav from 'serve-favicon';
import getOptions from '../../getOptions';

export default async function serveFavicon(app) {
    const {options} = await getOptions();
    if (options.favicon) {
        app.use(serveFav(options.favicon));
    }
}
