/* eslint-disable import/no-mutable-exports, global-require */

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

if (options === null) {
    let jepaOptions;

    // eslint-disable-next-line camelcase
    if (typeof __webpack_require__ !== 'undefined') {
        jepaOptions = require('src/jepa.options.js').default;
    }
    else {
        const path = require('path');
        // eslint-disable-next-line import/no-dynamic-require
        jepaOptions = require(path.resolve(process.cwd(), './src/jepa.options.js')).default;
    }

    options = _.merge({}, defaultOptions, jepaOptions);
    options.basePathRel = options.basePath.substr(1);
    if (options.basePathRel.length > 0) {
        options.basePathRel += '/';
    }
    optionsJson = devalue(_.pick(options, ['name', 'basePath', 'basePathRel']));
}

export {options, optionsJson};
