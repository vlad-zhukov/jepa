import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import {options, optionsJson} from '../options';

const Html = ({styles, scripts}) => {
    const prefix = __DEV__ ? `${options.basePath}/__static` : '';
    const jepaOptions = `window.__JEPA_OPTIONS__ = ${optionsJson};`;

    return (
        <Helmet>
            <html lang="ru" />
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            {options.manifestJson && (
                <link rel="manifest" type="application/manifest+json" href={`${options.basePath}/manifest.json`} />
            )}
            <script id="jepa-options">{jepaOptions}</script>
            {styles.map(style => <link rel="stylesheet" type="text/css" href={`${prefix}/${style}`} key={style} />)}
            {scripts.map(script => <script defer src={`${prefix}/${script}`} key={script} />)}
        </Helmet>
    );
};

Html.propTypes = {
    styles: PropTypes.arrayOf(PropTypes.string).isRequired,
    scripts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Html;
