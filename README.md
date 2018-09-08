# GBuild 2.2
> A simple front-end building tool

Licence: MIT

Portions Copyright (C) 2013-2018 ConsidoNet Solutions

Copyright (C) 2018 ConsidoNet Solutions

www.considonet.com

## What is GBuild?
GBuild is a front-end building automation tool build on top of `webpack` and `gulp`. It works in a similar way as scaffolds done with tools such as `@vue/cli`.

You might say that there is no need for such tool - we all can configure `webpack` on our own. This is true, but when you consider maintaining the developers team across several projects, some standardization had to be done. After several years our projects become more and more fragmented and we were unable to re-use common code across the projects due to configuration incompatibilities.

GBuild was created as an internal tool to be used in all the projects done by our software studio. The goal is to keep the configuration simple and unified across all projects without the need of copying-and-pasting the webpack and gulp config files. This approach allowed us to keep the same building environment in all our projects (PHP- and Microsoft .NET-based), support modern JavaScript and TypeScript and gradually introduce support for the cutting-edge front-end technologies.

GBuild considers your front-end solution to be organized into 3 directories:
- JS (files such as .js, .ts, .vue etc.)
- Styles (SCSS/CSS files)
- Misc (anything else stored in the assets directory - for example favicons)

Please refer to the configuration manual below for more details.

## Core features
- Cross platform (tested on Linux and Windows)
- 1-minute configuration
- ES6 to ES5 transpilation using `babel`
- JS modules support with highly optimized `webpack` configuration
- Microsoft TypeScript 2.x support
- Vue.js support (including TypeScript support and `vue-class-component` syntax)
- JS/TS code linting using `tslint`
- SCSS compilation with a custom smart module importer (more powerful than the default `node-sass` and `webpack` SCSS compilers - incl. support for `sass-eyeglass` module syntax).
- Pre-configured `browser-sync`-based live-reload HTTP server and proxy supporting both PHP and Microsoft .NET projects and allowing to do CORS calls (`Access-Control-Allow-Origin`)
- Integrated PHP server support (if `php-cli` available)

## Usage

### Command line
The following cli commands (tasks) are available and should be configured in your project `package.json` file:
- `gbuild build`
  Builds the solution using production settings
- `gbuild watch`
  Constantly watches your files and builds them using production settings
- `gbuild serve`
  Constantly watches your files, builds them using development settings and serves them with `browser-sync`
- `gbuild assets`
  Cleans up the assets directory and re-copies them. This command is also executed when running `build`, `watch` and `serve` tasks. However watching tasks do not clean up and re-copy the files during each change detected.
- `gbuild fontastic`
  Downloads the icons from Fontastic Cloud service and builds the CSS file with font assets
  
The following parameters are supported:
-c, --config \<configfile\> - (optional) specifies path to the main configuration file (default `./gbuildconfig.js`). The path is relative to directory where your `package.json` file is stored.  
  
### Configuration
The configuration is stored in the root directory where your project's `package.json` file is stored.  
Configuration consists of the following files:

#### Main configuration file (by default `gbuildconfig.js`)
The main GBuild configuration file exported as `cfg` - so everything has to be wrapped in `exports.cfg = {}` directive.

Please mind that some of the settings have their defaults (to keep things simple) and don't need to be configured - see details below:

##### `paths.projectRoot`
Your project (not just frontend) root directory. If you prefer to keep your frontend files (including `package.json` and all the `node_modules`) in a specific directory, please specify the path to your project root directory (in this case `../`). Defaults to `./`.

##### `paths.input`
GBuild keeps the input source files split into 3 directories - for JavaScript, styles and miscellaneous files. It is required to set `paths.input.js`, `paths.input.css` and `paths.input.misc` respectively using relative paths to the location of your project's `package.json` file (so sometimes not `projectRoot`). Default values:
```json
{
  "css": "./css",
  "js": "./js",
  "misc": "./misc"
}
```

##### `paths.output`
Required setting. The build output directories set relatively to the location of your project's `package.json` file. The syntax is similar to `paths.input` setting. 

For `projectRoot` set to `./` (default) example settings are:
```json
{
  "css": "./assets/css",
  "js": "./assets/js",
  "misc": "./assets/misc"
}
```

For `projectRoot` set to `../` example settings are:
```json
{
  "css": "../assets/css",
  "js": "../assets/js",
  "misc": "../assets/misc"
}
```

##### `paths.public`
New setting introduced in 2.1. Used to configure HTTP requests for lazy loaded `import()` statements. This setting uses the same syntax as `paths.output` and `paths.input`. However only `js` key is supported at the moment.
Example: for `paths.public.js` set to `/assets/js/` (mind the trailing slash) `import(/* webpackChunkName: "vue" */"vue")` will request the JS file using the URL `/assets/js/async/async.vue.js`. See _core features_ section to learn more about lazy bundle importing.

##### `jsEntries`
Required setting. Defines entry points for your app. Can contain more than one JS entry point resulting in more generated bundle files. The key contains the input source file (with an extension) and the value contains the output file (__without the extension!__). Example setting resulting in compilation of `index.ts` (from the `paths.input.js` directory) to `app.js` (in the `paths.output.js` directory):
```json
{
  "index.ts": "app"
}
```

##### `targetBrowsers`
Required setting. Specifies the browser compatibility for `babel` and `autoprefixer` conforming with the standard configuration syntax. As of 2018, (in our opinion) the recommended setting is `["ie >= 9", "> 1%", "iOS 8"]`. Please refer to [BrowserList docs](https://github.com/browserslist/browserslist#queries) for more details.

##### `autoprefixer`
This key contains `autoprefixer` settings conforming with the standard configuration syntax. The default setting is `{}`. Please refer to [autoprefixer GitHub page](https://github.com/postcss/autoprefixer) for more details. Because of common `targetBrowsers` setting, GBuild automatically sets up `browsers` setting for Autoprefixer so usually no additional configuration is required.

##### `browsersync`
Specifies `browser-sync`-specific configuration. To make things really simple, this setting doesn't follow any standards for `browser-sync` config - the following keys are supported:
- `browsersync.spa` - determines whether `browser-sync-spa` plugin is used. Useful for developing SPA apps with a default `index.html` file and routing support. This setting works only if `browser-sync` runs in the server mode (not proxy).
- `browsersync.port` - determines the TCP port under which the `browser-sync` server is available. If a specific port is already in use, `browser-sync` will take the next available port. The ports are displayed in the console once `browser-sync` starts the HTTP server.
- `browsersync.openBrowser` - determines whether running `browser-sync` opens the page in your default browser.
- `browsersync.urlRewrites` - URL rewrites to handle better hybrid SPA apps with static URLs. Example setting: 
```
[ 
  { 
    src: /^\/[A-z]{2}\/store-locator/,
    dest: "/storelocator.html" 
  }
]
```
- `browsersync.proxiedUrl` - sets the URL for the proxy mode. Not needed when running in auto mode.
- `browsersync.mode` - determines in which mode GBuild should start the `browser-sync` service. The following settings are available:
  - `serve` - launches a static HTTP server with a root directory set in `paths.projectRoot`
  - `proxy` - launches a proxy server proxying requests to the URL set in `browsersync.proxiedUrl`. Useful for `docker`-based solutions or locally hosted projects using `apache` etc.
  - `auto` - detects the running environment in a smart way (detecting a Visual Studio solution, PHP solution or a static frontend package). When VS solution is detected, GBuild automatically configures the `browsersync.proxiedUrl` to the IIS Express URL and port set in the `.csproj` file. When a PHP solution is detected, GBuild runs a `php-cli` server and proxies it through `browser-sync`. If none of the above are detected, it runs in the static HTTP server mode.

The default `browsersync` configuration is sufficient for most of the projects and looks like this:
```json
{
  "spa": false,
  "port": 3000,
  "openBrowser": true,
  "urlRewrites": [],
  "mode": "auto"
}
```

##### `webpack`
Specifies `webpack`-specific configuration. Because GBuild automatically generates a pre-set `webpack` configuration, this setting doesn't follow any standards for `webpack` config - the following keys are supported:
- `hardSourceCache` (deprecated, will be removed in 3.x version) - determines whether to use `hard-source-webpack-plugin` to increase the performance of the build process. As of 2018 the performance of `webpack` 4 has been greatly improved and this setting is no longer required nor maintained.
- `enableBundleAnalyzerServer` - determines whether to run a diagnostic `webpack-bundle-analyzer` server to understand your JS bundle structure and sizes.
- `extractRuntime` (new in 2.1) - determines whether to extract the common part of your bundles (for now `babel-polyfill`) to an external file. Possible values: `false` - no extraction, `[filename]` - filename without extension. For example setting `extractRuntime` to `runtime` will result in an additional JS file with a name `runtime.js` located in your `paths.output.js` directory. This setting is useful when you have multiple bundles with a common part (such as `babel-polyfill`). This setting will be improved in future versions to allow more modules to be bundled in the runtime file.
- `extractModules` (new in 2.1) - determines whether to extract modules from `node_modules` to external files. If set to `true` there will be an additional bundle file created in your `paths.output.js` directory with a name `vendor.[yourInputJSEntryFileName].js`. When used with proper content hashing in the bundle file names, can speed up the page load as the user wil download only the updated bundle, not the runtime and the modules. `extractRuntime` can be used in conjunction with `extractModules` as well. __Important__: If `extractRuntime` is enabled and no files from `node_modules` are imported, the vendor JS file will not be created (only the runtime file).
- `modules`
  - `modules.externals` - specifies external modules available in the global JS namespace. Example usage scenario: assuming that `jquery` is included in the HTML file from the CDN, the module shouldn't be bundled any more. In this case we set up a key-value array where the key specifies the module name and the value specifies the global variable under which the module is available. In this case the setting should be set to:
  ```json
  {
    "jquery": "jQuery" // because window.jQuery will contain the imported "jquery" module
  }
  ```
  - `modules.alias` - specifies the module resolving aliases. This setting uses the offical `webpack` syntax specified in the [docs](https://webpack.js.org/configuration/resolve/#resolve-alias). 

The default `webpack` configuration looks like this:
```json
{
  "hardSourceCache": false,
  "enableBundleAnalyzerServer": false,
  "extractRuntime": false,
  "extractModules": false,
  "modules": {
    "externals": {},
    "alias": {}
  }
}
```
##### `fontastic`
Specifies configuration for the Fontastic Cloud support. The following settings are required if you would like to use this feature:
- `id` - ID taken from the Fontastic CSS. Example: for the URL `https://file.myfontastic.com/SomeCode123456/icons.css` just paste `SomeCode123456`.
- `fontsDir` - directory path relative to your project's `package.json` directory. Without trailing slash! Example: `./css/base/fonts`
- `scssFile` - generated SCSS file path, also relative to your project's `package.json` directory. Example: `./css/base/_fontastic.scss`

Each time the `fontastic` cli task is executed, the SCSS file will be replaced and the font file assets will be stored in the `fontsDir`.

##### `customWatchers`
Determines additional file paths (using glob syntax) triggering the `browser-sync` reload. The paths are relative to the project root specified in `paths.projectRoot`. Example usage: `["./Views/**/*.tpl"]`. Default is empty - `[]`.

##### `php`
Enables (`true`, using default settings), specifies non-standard settings (using the directives below) or disables (`false`) PHP server support. The non-standard settings can be defined using the following settings:
- `php.bin` - determines the `php` binary command. Default is `php`.
- `php.port` - determines the TCP port under which the PHP server will be available. Default is `9000`.

Default `php` setting is `false`. This setting can be overridden with `browsersync.mode` set to `auto` - when a PHP project is detected, GBuild will try to launch PHP server anyway. If the setting is `true`, PHP server will be launched always, regardless of the project type detection.

##### `logVerbosity`
Specifies the logging verbosity in the range of numbers 0 and 5 where 1 specifies minimal (but usually sufficient) logging and 5 very detailed messages. Setting to 0 disables the console messages completely. Default is `1`.

#### Configuration file: `tsconfig.json`
TypeScript compiler configuration file. The following settings are considered as recommended (due to the usage of `webpack` for module resolution and `babel` for ES6 to ES5 transpiling):
```json
{
   "compilerOptions": {
     "noImplicitAny": true,
     "removeComments": false,
     "target": "es6",
     "allowSyntheticDefaultImports": true,
     "moduleResolution": "node",
     "pretty": true,
     "sourceMap": true,
     "experimentalDecorators": true
   }
 }
```

#### Configuration file: `tslint.json`
`tslint` configuration file. Customized depending on your personal preferences. Please make sure to point this file in your IDE.

## FAQ

__Why is my WebStorm/PhpStorm/Rider not linting the code?__

This is because `tslint` package is included inside GBuild's `package.json` and is not detected by JetBrains' software by default. To use `tslint` inside your IDE, please set manually the path to `tslint` pointing to the proper directory inside your project's `node_modules` directory.

## Future plans
The following features are for now on our roadmap:
- Style linting
- React.js support
- Project scaffolding
- Support for `<style>` tags in SFCs (such as .vue files)
- Assets optimization

## Changelog
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
