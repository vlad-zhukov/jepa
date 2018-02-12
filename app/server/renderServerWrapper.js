import React from 'react';
import ReactDOM from 'react-dom/server';

export default (children) => {
    return {renderedCore: ReactDOM.renderToString(children)};
}
