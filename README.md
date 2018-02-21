# jepa · [![npm](https://img.shields.io/npm/v/jepa.svg)](https://npm.im/jepa)

> A ~~highly~~ customizable React framework for painless SPAs.

## Getting Started

```sh
yarn add jepa react react-dom
  # or
npm install --save jepa react react-dom
```

## Table of Contents

* [Customization](#customization)
    * [Files](#files)
    * [`jepa.options.js`](#jepaoptionsjs)
    * [Environment Variables](#environment-variables)
    * [`jepa.config.js`](#jepaconfigjs)
    * [Runtime Dependencies](#runtime-dependencies)

## Customization

### Files

You can optionally replace the following files:

* `src/server/index.js`: The server entrypoint.
* `src/server/renderServerWrapper.js`: A function that takes a
  `React.Component` and return an object of shape:

    ```
    {
      renderedRoot: React.Component,

      // HTML string that will be placed after other styles in the head.
      style: String,

      // HTML string that will be placed before other scripts in the end
      // of the body, useful for providing SSRed stores, for example
      // Redux or Apollo stores.
      script: String
    }
    ```

* `src/client/renderClientWrapper.js`: A function that takes a
  `React.Component` and returns a React component.
* `src/universal/Root.js`: The root of the universal app.

### `jepa.options.js`

* `name` _(String)_: The name of the project.
* `host` _(String)_: Defaults to `0.0.0.0`.
* `port` _(Number)_: Defaults to `3000`.
* `clientDevServerPort` _(Number)_: Default to `3001`.
* `routes` _(AsyncFunction)_: An async function that returns a function
  that takes an `express` instance as argument.
* `compress` _(Boolean|Object)_: Set this to `true` or object with
  [`compression`](https://github.com/expressjs/compression) options
  to enable HTTP compression. Defaults to `!__DEV__`.
* `favicon`
* `robotsTxt` _(String)_
* `manifestJson` _(Object)_

TODO:

* `staticDir` _(String)_
* `bodyParser` _(Boolean|Object)_
* `logger`
* `forceSsl`
* `sslPort`
* `securityTxt` _(String)_: (https://securitytxt.org/)

### Environment Variables

Environmental variables can be used to override options that were set in
`jepa.options.js` during startup time. You can place a `.env` file in
`src/` folder.

The following variables are currently supported:

* `process.env.HOST`
* `process.env.PORT`

### `jepa.config.js`

* `webpackModify` _(AsyncFunction)_: A function that takes an object
  argument of shape `{webpackConfig, target: 'web' || 'node', env: 'dev' || 'prod'}`,
  and should return a webpack config object.
* `postcss` _(Object)_: [`postcss-loader`](https://github.com/postcss/postcss-loader) options.

### Runtime Dependencies

By default both client and server are bundled with Webpack, which means
there is no use of `node_modules` during runtime. Most of the time this
works perfectly fine however there are cases when certain dependencies
can't be bundled (usually these are native dependencies).

You can create a `package.json` file and optionally `package-lock.json`
or `yarn.lock` files and specify dependencies there that shouldn't be
bundled with Webpack and installed to `node_modules`.
