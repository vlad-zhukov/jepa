import _ from 'lodash';

const defaultOptions = {
    host: '0.0.0.0',
    port: 3000,
    clientDevServerPort: 3001,
    compress: !__DEV__,
};
const envOptions = {
    host: process.env.HOST,
    port: process.env.PORT,
};
let options = null;

export default async function () {
    if (options === null) {
        let jepaOptions;

        // eslint-disable-next-line camelcase
        if (typeof __webpack_require__ !== 'undefined') {
            jepaOptions = (await import('src/jepa.options.js')).default;
        }
        else {
            const path = await import('path');
            jepaOptions = (await import(path.resolve(process.cwd(), './src/jepa.options.js'))).default;
        }

        options = _.merge({}, defaultOptions, jepaOptions, envOptions);
    }

    return options;
}
