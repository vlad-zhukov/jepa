import 'raf/polyfill';
import dotenv from 'dotenv';
import {Router} from 'express';
import JepaApp from './src/server/JepaApp';

const env = dotenv.config();

if (env.error) {
    throw env.error;
}

export function createRouter(options) {
    return new Router(options);
}

let currentApp = null;

export default async function jepa() {
    if (!currentApp) {
        try {
            currentApp = new JepaApp();
            await currentApp.init();
            await currentApp.start();
        }
        catch (err) {
            console.error(err);
        }
    }

    return currentApp;
};
