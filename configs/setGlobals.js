const babelConfig = require('./babelConfig');

const registerOptions = Object.assign({}, babelConfig('test'), {
    ignore: [/node_modules\/(?!jepa).*/],
});

require('@babel/register')(registerOptions);

global.__DEV__ = process.env.NODE_ENV !== 'production';
global.__BROWSER = false;
