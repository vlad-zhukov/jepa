import path from 'path';

export default async ({target, env}) => {
    const modifyWebpack = await (await import('./getConfig.js')).default;

    if (target === 'node') {
        if (env === 'dev') {
            const webpackConfig = (await import('./webpack.server-dev.js')).default;
            return await modifyWebpack({webpackConfig: await webpackConfig(), target, env})
        }

        if (env === 'prod') {
            const webpackConfig = (await import('./webpack.server-prod.js')).default;
            return await modifyWebpack({webpackConfig: await webpackConfig(), target, env})
        }

        throw new Error('Unknown env', env)
    }

    if (target === 'web') {
        if (env === 'dev') {
            const webpackConfig = (await import('./webpack.client-dev.js')).default;
            return await modifyWebpack({webpackConfig: await webpackConfig(), target, env})
        }

        if (env === 'prod') {
            const webpackConfig = (await import('./webpack.client-prod.js')).default;
            return await modifyWebpack({webpackConfig: await webpackConfig(), target, env})
        }

        throw new Error('Unknown env', env)
    }

    throw new Error('Unknown target', target);
};
