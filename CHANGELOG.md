## Changelog
__TBA__
* Dependencies upgrade, in particular `eslint` peer dependency now allows to use version 6

__4.0.0__ (2019/07/24)
* Potentially breaking change: TypeScript files compilation now done via `babel`. The transition should be as seamless as possible and no changes should be done to the existing projects.
* Breaking change: `typescript` now an optional peer dependency
* Breaking change: Babel configuration now moved to the official config file or section in package.json. Thanks to this it can be used with other tools relying on `@babel/*` packages (such as `jest`). To retain compatibility with previous G-Build versions, use our `@considonet/babel-preset-typescript` package as your Babel preset.
* Breaking change: Because of the above, `webpack.usagePolyfills` setting is dropped and no polyfills are added by default. If you would like to use the old, static polyfilling solution, import `core-js/stable` and `regenerator-runtime/runtime` to your main JS entry point.
* Breaking change: `webpack.extractRuntime` setting dropped. To mimic this behaviour a named chunk syntax has to be used in the polyfill/runtime imports (in case of not using Babel's usage-based polyfilling).
* Breaking change: Switch back to `eslint` for both JS and TS files.
* Potentially breaking change: Switch from `node-sass` to [now recommended](https://sass-lang.com/dart-sass) compiler of SCSS - Dart Sass ([`sass`](https://www.npmjs.com/package/sass))
* Breaking change: G-Build no-longer provides PostCSS plugins and no configuration is provided there. Please use official PostCSS config files to add your processors. To retain compatibility with previous G-Build versions, use `@considonet/postcss-config` with `normalize: false`.
* Breaking change: JS linting by default is now disabled to make the initial project setup easier
* Breaking change: `eslint`, `stylelint`, `@babel/core`, `postcss` are now peer dependencies and have to be installed manually. This solves a lot of issues with linters not being detected. Moreover package managers don't throw warnings when configs are installed.
* Breaking fix: `vue-template-compiler` now really a peer dependency (before it was mistakenly set to optional dep)
* SCSS update which allows to import JS and JSON files to SCSS. Because it's an external package, this update is also available for older versions of G-Build.
* Bugfixes
* Dependencies upgrade

__3.1.1__ (2019/06/24)
* Unused deprecated dependency removed (to silence the warnings during package installation) 

__3.1.0__ (2019/06/24)
* `targetBrowsers` deprecated in favor of official BrowsersList way of providing the config
* Static polyfill handling in a recommended Babel 7.4 way
* Docs update
* Dependencies upgrade

__3.0.0__ (2019/04/22)
* Breaking change: `vue-template-compiler` now a peer dependency (so there shouldn't be problems with incompatible `vue` versions anymore)
* Breaking change: `hard-source-webpack-plugin` removed
* Breaking change: deprecated JS entry points syntax not supported any more
* Potentially breaking change: `babel-polyfill` now by default is loaded selectively based on usage. Old setup can be retained via config file.
* Switched CSS processing to `postcss` which should increase CSS building performance
* Added support for `postcss-preset-env`
* Added support for `postcss-flexbugs-fixes`
* Now CSS is processed also for the development build and includes full source map support
* Optional WebP support: image recompression and CSS rewrites to support non-compatible browsers
* Configurable bubble notifications (before they were always on for `webpack` and TS compilation)
* `browser-sync` in-browser notifications can now be disabled
* Assets and style processing refactored
* Code cleanup

__2.4.3__ (2019/04/12)
* Hotfix: Unified line separators in `gbuild-cli.js` to LF. This should fix compatibility with `yarn` on *nixes. 

__2.4.2__ (2019/03/29)
* Hotfix: Autoprefixer couldn't be controlled with comments (because minification that stripped off the comments was done before autoprefixing). Now minification done by `cssnano`

__2.4.1__ (2019/02/12)
* Hotfix: EJS compilation doesn't break the watch/serve task
* Hotfix: Browsersync reload on assets/miscassets watcher trigger
* Hotfix: EJS comilation on watcher start

__2.4.0__ (2019/02/01)
* SCSS linting (using `stylelint`)
* EJS compilation support
* Assets optimization (using `imagemin`)
* Linting is now optional
* Each task is now optional and can be disabled by setting `false` to a relevant output path
* Directory cleaning can be disabled
* Assets and misc watchers finally fixed
* Webpack progress bar removed to improve readability
* Dependencies upgrade

__2.3.2__ (2018/12/04)
* Win32 path resolving with new gulp fixed (for file watchers as well)

__2.3.1__ (2018/12/03)
* Win32 path resolving with new gulp fixed

__2.3.0__ (2018/11/30)
* Basic React support (both JSX and TSX)
* TypeScript 3.x
* Dependencies upgrade (incl. babel 7.x packages)

__2.2.1__ (2018/11/25)
* Migration to git
* Published on npmjs.com

__2.2.0__ (2018/09/08)
* Optional command line config path parameter
* Better PHP detection (based on if composer.json file exists as well)
* Dependencies upgrade

__2.1.0__ (2018/08/02)
* JavaScript module splitting (vendor, common runtime files)
* Lazy `import()` statements support
* README.md file finally
* Dependencies upgrade

__2.0.2__ (2018/07/19)
* .vue JavaScript linting bugfix

__2.0.1__ (2018/07/19)
* .vue JavaScript linting fix

__2.0.0__ (2018/07/18)
* Fontastic Cloud bundling support
* Build performance dramatically increased due to node_modules transpiling dropped (requires all the packages to be already transpiled to ES5)
* Deprecated features dropped
* Migration to `vue-loader` 15.x
* Dependencies upgrade
* Less obtrusive splash screen
* Code refactor

__1.6.2__ (2018/05/19)
* Temporary release before 2.x
* `vue-loader` reverted to 14.x due to many bugs and incompatibilities

__1.6.1__ (2018/05/19)
* Migration to `vue-loader` 15.x

__1.6.0__ (2018/05/19)
* Switch to tslint for .js files
* `webpack` error and warning logging fixed with `logVerbosity` set to 1
* JSON5 file loader
* `webpack` popup notifications

__1.5.1__ (2018/05/05)
* Buggy TypeScript (`@types/node`) dependency reverted

__1.5.0__ (2018/04/23)
* PHP cli server support (incl. browser-sync proxying)  

__1.4.1__ (2018/04/22)
* Bugfix release

__1.4.0__ (2018/04/22)
* Custom file watch paths support (`customWatchers` config value)

__1.3.0__ (2018/04/16)
* .vue files linting with tslint
* TypeScript type checking config optimizations
* `webpack` progress bar for `logVerbosity` set to 1

__1.2.0__ (2018/04/11)
* .vue files TypeScript transpiling support
* Config path relocation, old path deprecated but still supported
* `webpack` externals and resolve aliases support
* Dependencies upgrade

__1.1.0__ (2018/03/14)
* WebpackBundleAnalyzer
* `assets` cli command
* Switch to semantic versioning

__1.0.7__ (2018/03/14)
* TypeScript type checking moved to an async thread using `fork-ts-checker-webpack-plugin`
* Dependencies upgrade

__1.0.6__ (2018/03/09)
* Custom `browser-sync` proxy mode possible

__1.0.5__ (2018/02/28)
* `json-loader` removed since it is now supported by `webpack` out of the box
* Dependencies cleanup

__1.0.4__ (2018/02/28)
* Switch to `webpack` 4.x
* Switch from `awesome-typescript-loader` to `ts-loader`
* Dependencies upgrade

__1.0.3__ (2018/02/28)
* Style watcher bugfix
* Dependencies and code cleanup

__1.0.2__ (2018/02/26)
* Support for URL rewriting in the server mode
* Dependencies cleanup

__1.0.1__ (2018/02/22)
* VS proxy mode bugfix

__1.0.0__ (2018/02/21)
* Initial version as a npm package
