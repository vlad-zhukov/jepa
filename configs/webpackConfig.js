import getConfig from './getConfig';
import getOptions from '../src/getOptions';

export default async function webpackConfig({target, env}) {
    const {modifyWebpack} = await getConfig();
    const {options} = await getOptions();

    if (target === 'node') {
        if (env === 'dev') {
            const config = (await import('./webpack.server-dev.js')).default;
            return modifyWebpack({webpackConfig: await config(), target, env, options});
        }

        if (env === 'prod') {
            const config = (await import('./webpack.server-prod.js')).default;
            return modifyWebpack({webpackConfig: await config(), target, env, options});
        }

        throw new Error('Unknown env', env);
    }

    if (target === 'web') {
        if (env === 'dev') {
            const config = (await import('./webpack.client-dev.js')).default;
            return modifyWebpack({webpackConfig: await config(), target, env, options});
        }

        if (env === 'prod') {
            const config = (await import('./webpack.client-prod.js')).default;
            return modifyWebpack({webpackConfig: await config(), target, env, options});
        }

        throw new Error('Unknown env', env);
    }

    throw new Error('Unknown target', target);
}
