import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import renderClientWrapper from 'src/client/renderClientWrapper';
import App from 'src/universal/App';

const jepaOptions = window.__JEPA_OPTIONS__;
delete window.__JEPA_OPTIONS__;
const jepaOptionsContainer = document.getElementById('jepa-options');
if (jepaOptionsContainer) jepaOptionsContainer.outerHTML = '';

const renderOrHydrate = __DEV__ ? ReactDOM.render : ReactDOM.hydrate;

function renderApp() {
    renderOrHydrate(
        renderClientWrapper(
            <BrowserRouter basename={jepaOptions.basePath}>
                <App />
            </BrowserRouter>
        ),
        document.getElementById('react-app')
    );
}

if (__DEV__ && module.hot) {
    module.hot.accept('src/universal/App', renderApp);
}

renderApp();
