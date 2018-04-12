/* eslint-disable promise/prefer-await-to-callbacks */

import fs from 'fs';
import path from 'path';

function buildManifest(compiler, compilation) {
    const {context} = compiler.options;
    const manifest = {};

    compilation.chunks.forEach((chunk) => {
        chunk.files.forEach((file) => {
            chunk.forEachModule(({id, libIdent, rawRequest}) => {
                const name = typeof libIdent === 'function' ? libIdent({context}) : null;
                if (name && !/(node_modules|webpack|multi)/.test(name) && /.js$/.test(name)) {
                    // console.log(Object.keys(module))
                    manifest[rawRequest] = {id, name, file};
                }
            });
        });
    });

    return manifest;
}

export default class ReactLoadablePlugin {
    constructor(opts = {}) {
        this.filename = opts.filename;
    }

    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            const manifest = buildManifest(compiler, compilation);
            const json = JSON.stringify(manifest, null, 2);
            const outputDirectory = path.dirname(this.filename);
            try {
                fs.mkdirSync(outputDirectory);
            }
            catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            fs.writeFileSync(this.filename, json);
            callback();
        });
    }
}
