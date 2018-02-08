import fs from 'fs';
import path from 'path';

function buildManifest(compiler, compilation) {
    const context = compiler.options.context;
    const manifest = {};

    compilation.chunks.forEach(chunk => {
        chunk.files.forEach(file => {
            chunk.forEachModule(module => {
                const id = module.id;
                const name = typeof module.libIdent === 'function' ? module.libIdent({context}) : null;
                if (name && !/(node_modules|webpack|multi)/.test(name) && /.js$/.test(name)) {
                    // console.log(Object.keys(module))
                    manifest[module.rawRequest] = {id, name, file};
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
            } catch (err) {
                if (err.code !== 'EEXIST') {
                    throw err;
                }
            }
            fs.writeFileSync(this.filename, json);
            callback();
        });
    }
}
