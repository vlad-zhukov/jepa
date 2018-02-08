# jepa · [![npm](https://img.shields.io/npm/v/jepa.svg)](https://npm.im/jepa)

A ~~highly~~ customizable React framework for painless SPAs.

## Table of Contents

* [Getting Started](#getting-started)
* [Customization](#customization)
  * [`jepa.options.js`](#jepaoptionsjs)
  * [Environment Variables](#environment-variables)
  * [`jepa.config.js`](#jepaconfigjs)

## Getting Started

```sh
yarn add jepa react react-dom react-helmet react-router-dom
  # or
npm install --save jepa react react-dom react-helmet react-router-dom
```

## Customization

### `jepa.options.js`

* `name` _(String)_: The name of the project.
* `host` _(String)_: Defaults to `localhost`.
* `port` _(Number)_: Defaults to `3000`.
* `clientDevServerPort` _(Number)_
* `compress` _(Boolean|Object)_: Set this to `true` or object with
[`compression`](https://github.com/expressjs/compression) options
to enable HTTP compression. Defaults to `!__DEV__`.
* `favicon`
* `robotsTxt` _(String)_
* `manifestJson` _(Object)_

todo:

* `staticDir` _(String)_
* `bodyParser` _(Boolean|Object)_
* `logger`
* `forceSsl`
* `sslPort`
* `securityTxt` _(String)_: (https://securitytxt.org/)

### Environment Variables

Environmental variables can be used to change options that were set in
`jepa.options.js` during startup time. You can use `.env` file.

The following variables are currently supported:
* `process.env.HOST`
* `process.env.PORT`

### `jepa.config.js`

* `webpackModify`
