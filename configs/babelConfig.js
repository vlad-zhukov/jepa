module.exports = function babelConfig(env) {
    const presets = ['@babel/preset-react', ['@babel/preset-stage-1', {decoratorsLegacy: true}]];
    const plugins = [];

    if (env === 'server') {
        presets.unshift([
            '@babel/preset-env',
            {
                targets: {node: '8.9'},
                useBuiltIns: false,
                modules: false,
                loose: false,
            },
        ]);

        plugins.push('dynamic-import-node', 'react-loadable/babel', [
            'transform-react-remove-prop-types',
            {mode: 'remove', removeImport: true},
        ]);
    }

    if (env === 'development') {
        presets.unshift([
            '@babel/preset-env',
            {
                targets: {browsers: 'last 2 versions'},
                useBuiltIns: 'entry',
                modules: false,
                loose: false,
            },
        ]);
    }

    if (env === 'production') {
        presets.unshift([
            '@babel/preset-env',
            {
                targets: {browsers: '> 1%'},
                useBuiltIns: 'entry',
                modules: false,
                loose: false,
            },
        ]);
        plugins.push(['transform-react-remove-prop-types', {mode: 'remove', removeImport: true}]);
    }

    if (env === 'test') {
        presets.unshift([
            '@babel/preset-env',
            {
                targets: {node: '8.9'},
                useBuiltIns: false,
                loose: false,
            },
        ]);

        plugins.push('dynamic-import-node');
    }

    return {presets, plugins, babelrc: false};
};
