import path from 'path';
import merge from 'lodash/merge';

const defaultConfig = {
    modifyWebpack: ({webpackConfig}) => webpackConfig,
};
let config = null;

export default async function getConfig() {
    if (config === null) {
        const jepaConfig = (await import(path.resolve(process.cwd(), './src/jepa.config.js'))).default;

        config = merge({}, defaultConfig, jepaConfig);
    }

    return config;
}
