import 'raf/polyfill';
import dotenv from 'dotenv';
import {Router} from 'express';
import createJepaApp from './createJepaApp';

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
            currentApp = await createJepaApp();
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    }

    return currentApp;
}
