## Changelog
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
