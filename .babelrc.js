const env = process.env.NODE_ENV || process.env.BABEL_ENV;

module.exports = require('./config/babelConfig.js')(env);
