import path from 'path'
import _ from 'lodash';

const defaultConfig = {
    modifyWebpack: ({webpackConfig}) => webpackConfig,
};
let config = null;

export default async function () {
    if (config === null) {
        const jepaConfig = (await import(path.resolve(process.cwd(), './app/jepa.config.js'))).default;

        config = _.merge(
            {},
            defaultConfig,
            jepaConfig,
        )
    }

    return config;
};