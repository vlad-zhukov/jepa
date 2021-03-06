import React from 'react';
import ReactDOM from 'react-dom/server';
import {StaticRouter} from 'react-router-dom';
import Loadable from 'react-loadable';
import Helmet from 'react-helmet';
import Html from './Html';
import {options} from '../options';

function helmetToString(value) {
    return value.toString().replace(/data-react-helmet="true" /g, '');
}

function renderDocument({renderedCore = '', style = '', stylePaths = [], script = '', scriptPaths = []}) {
    ReactDOM.renderToStaticMarkup(<Html styles={stylePaths} scripts={scriptPaths} />);
    const helmet = Helmet.renderStatic();

    const head = helmet.title.toString() + helmetToString(helmet.meta) + helmetToString(helmet.link) + style;
    const body = `<div id="react-app">${renderedCore}</div>${script}${helmetToString(helmet.script)}`;

    return `<!DOCTYPE html><html ${helmet.htmlAttributes.toString()}><head>${head}</head><body>${body}</body></html>`;
}

let loadablePreloaded = false;

export default async function render(locals) {
    if (!__DEV__) {
        const renderServerWrapper = (await import('src/server/renderServerWrapper')).default;
        const App = (await import('src/universal/App')).default;
        const meta = await import('.jepa/prod/meta.json');
        const stats = await import('.jepa/prod/react-loadable.json');

        if (loadablePreloaded === false) {
            await Loadable.preloadAll();
            loadablePreloaded = true;
        }

        // SSR
        const modules = [];

        const {renderedCore, style, script} = renderServerWrapper(
            <StaticRouter basename={options.basePath} location={locals.location} context={{}}>
                <Loadable.Capture report={moduleName => modules.push(moduleName)}>
                    <App />
                </Loadable.Capture>
            </StaticRouter>
        );

        const chunkScripts = modules.map(moduleId => stats[moduleId].file);
        const scriptPaths = [...meta.vendor, ...chunkScripts, ...meta.app.filter(file => file.endsWith('.js'))];
        const stylePaths = meta.app.filter(file => file.endsWith('.css'));

        return renderDocument({renderedCore, style, stylePaths, script, scriptPaths});
    }

    const scriptPaths = ['js/vendor.js', 'js/app.js'];
    return renderDocument({scriptPaths});
}
