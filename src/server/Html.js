import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';

const prefix = __DEV__ ? '/build/' : '/';

const Html = ({options, styles, scripts}) => (
    <Helmet>
        <html lang="ru" />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {options.manifestJson && <link rel="manifest" type="application/manifest+json" href="/manifest.json" />}
        {styles.map(style => <link rel="stylesheet" type="text/css" href={`${prefix}${style}`} key={style} />)}
        {scripts.map(script => <script defer src={`${prefix}${script}`} key={script} />)}
    </Helmet>
);

Html.propTypes = {
    options: PropTypes.object().isRequired, // eslint-disable-line react/forbid-prop-types
    styles: PropTypes.arrayOf(PropTypes.string).isRequired,
    scripts: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Html;
