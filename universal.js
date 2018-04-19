/* eslint-disable import/no-mutable-exports, global-require */

export {default as asyncComponent} from 'react-loadable';

let options;

if (__BROWSER__) {
    options = require('./src/client/clientOptions').default;
}
else {
    // eslint-disable-next-line prefer-destructuring
    options = require('./src/options').options;
}

export {options};
