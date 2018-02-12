import ReactDOM from 'react-dom/server';

export default children => ({renderedCore: ReactDOM.renderToString(children)});
