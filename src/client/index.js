/* eslint-disable import/first */

import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import clientOptions from './clientOptions';
import renderClientWrapper from 'src/client/renderClientWrapper';
import App from 'src/universal/App';

const renderOrHydrate = __DEV__ ? ReactDOM.render : ReactDOM.hydrate;

function renderApp() {
    renderOrHydrate(
        renderClientWrapper(
            <BrowserRouter basename={clientOptions.basePath}>
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
