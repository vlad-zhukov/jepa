import _ from 'lodash';
import devalue from 'devalue';

const defaultOptions = {
    host: '0.0.0.0',
    port: 3000,
    clientDevServerPort: 3001,
    compress: !__DEV__,
    basePath: '/',
};

let options = null;
let optionsJson = null;

export default async function getOptions() {
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

        options = _.merge({}, defaultOptions, jepaOptions);
        options.basePathRel = options.basePath.substr(1);
        if (options.basePathRel.length > 0) {
            options.basePathRel += '/';
        }
        optionsJson = devalue(_.pick(options, ['name', 'basePath', 'basePathRel']));
    }

    return {options, optionsJson};
}
