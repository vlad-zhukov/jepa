import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import renderClientWrapper from 'app/client/index';
import renderRoot from 'app/universal/index';

const renderOrHydrate = __DEV__ ? ReactDOM.render : ReactDOM.hydrate;

function renderApp() {
    renderOrHydrate(
        renderClientWrapper(<BrowserRouter>{renderRoot()}</BrowserRouter>),
        document.getElementById('react-app')
    );
}

if (__DEV__ && module.hot) {
    module.hot.accept('app/universal/index', () => {
        renderApp();
    });
}

renderApp();
