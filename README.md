# G-Build 3.1
> A simple front-end building tool built on top of gulp and webpack

Licence: MIT

Copyright (C) 2017-2019 ConsidoNet Solutions

www.considonet.com

## What is G-Build?
G-Build is a front-end building automation tool build on top of `webpack` and `gulp`. It works in a similar way to scaffolds done with tools such as `@vue/cli`.

You might say that there is no need for such tool - we all can configure `webpack`, `npm` and/or `gulp` on our own. This is true, but when you consider maintaining the developers team across several projects, some standardization had to be done. After several years our projects become more and more fragmented and we were unable to re-use common code across the projects due to configuration incompatibilities.

G-Build was created as an internal tool to be used in all the projects done by our software studio. The goal is to keep the configuration simple and unified across all projects without the need of copying-and-pasting the webpack and gulp config files. This approach allowed us to keep the same building environment in all our projects (PHP- and Microsoft .NET-based), support modern JavaScript and TypeScript and gradually introduce support for the cutting-edge front-end technologies. You are also welcome to contribute in this project (since version 2.2.1 G-Build is available on GitHub).

G-Build considers your front-end solution to be organized into several directories:
- JS (files such as .js, .ts, .jsx, .vue etc.)
- Styles (SCSS/CSS files)
- Misc (anything else stored in the assets directory - for example favicons)
- EJS (for EJS templates)

Please refer to the configuration manual below for more details. Each of these 4 primary tasks is optional (disabling can be achieved by specifying `false` as output path).

## Core features

### General
- Cross platform (tested and actively used on Windows, Mac and Linux)
- 1-minute configuration

### JavaScript and related tasks
- ES6 to ES5 transpilation using `babel`
- JS modules support with highly optimized `webpack` configuration
- Microsoft TypeScript 3.x support
- React.js support (supporting JSX and TSX)
- Vue.js support (including TypeScript support and `vue-class-component` syntax)
- JS/TS code linting using `tslint`

### CSS, image assets and related tasks
- SCSS compilation with a custom smart module importer (more powerful than the default `node-sass` and `webpack` SCSS compilers - incl. support for `sass-eyeglass` module syntax).
- CSS autoprefixing and next-generation features polyfills using `postcss-preset-env` (which itself includes `autoprefixer`)
- Smart CSS minification using `cssnano`
- Optional seamless WebP image assets conversion (including CSS rewrites and non-compatible browsers support)
- Assets optimization (using `imagemin`)
- SCSS code linting using `stylelint`

### Misc features
- EJS template compilation
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
The main G-Build configuration file exported as `cfg` - so everything has to be wrapped in `exports.cfg = {}` directive.

Please mind that some of the settings have their defaults (to keep things simple) and don't need to be configured - see details below:

##### `paths.projectRoot`
Your project (not just frontend) root directory. If you prefer to keep your frontend files (including `package.json` and all the `node_modules`) in a specific directory, please specify the path to your project root directory (in this case `../`). Defaults to `./`.

##### `paths.input`
G-Build keeps the input source files split into several directories - for JavaScript, styles, miscellaneous and EJS files. It is required to set them using relative paths to the location of your project's `package.json` file (so sometimes not `projectRoot`). Default values:
```json
{
  "css": "./css",
  "js": "./js",
  "misc": "./misc",
  "ejs": "./ejs"
}
```

##### `paths.output`
Required setting. The build output directories set relatively to the location of your project's `package.json` file. The syntax is similar to `paths.input` setting. 

For `projectRoot` set to `./` (default) example settings are:
```json
{
  "css": "./assets/css",
  "js": "./assets/js",
  "misc": "./assets/misc",
  "ejs": false
}
```

For `projectRoot` set to `../` example settings are:
```json
{
  "css": "../assets/css",
  "js": "../assets/js",
  "misc": "../assets/misc",
  "ejs": "../ejs"
}
```

If any of the `paths.output` paths are set to `false`, the relevant task will not be executed. So if you want to disable JS compilation, just set `paths.output.js` to `false` (feature available from version 2.4).

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
*Deprecated starting from 4.x. Please use official [BrowsersList query methods](https://github.com/browserslist/browserslist#queries) instead!* Required setting if no BrowsersList config key/file present. Specifies the browser compatibility for `babel` and `autoprefixer`/`postcss` conforming with the standard configuration syntax. As of 2018, (in our opinion) the recommended setting is `["ie >= 9", "> 1%", "iOS 8"]`. Please refer to [BrowsersList docs](https://github.com/browserslist/browserslist#queries) for more details.

##### `autoprefixer`
This key contains `autoprefixer` settings conforming with the standard configuration syntax. The default setting is `{}`. Please refer to [autoprefixer GitHub page](https://github.com/postcss/autoprefixer) for more details. Do not set up `browsers` key, it will be taken from `BrowsersList` config.

##### `postcssPresetEnv`
This key contains `postcss-preset-env` settings conforming with the standard configuration syntax. The default setting is `{}` which basically loads *stage 2* polyfills. Please refer to [postcss-preset-env GitHub page](https://github.com/csstools/postcss-preset-env) for more details. Do not set up `browsers` key, it will be taken from `BrowsersList` config. If `autoprefixer` settings are set using the key above, they will be included into this config (because starting from version 3.0 `autoprefixer` is loaded via this plugin). If `stage` is set to 0, no polyfills are added.

##### `flexbugs`
This key contains `postcss-flexbugs-fixed` settings conforming with the standard configuration syntax. The default setting is `{}` which means that all flexbox polyfills are supported. Please refer to [PostCSS Flexbugs Fixes GitHub page](https://github.com/luisrudge/postcss-flexbugs-fixes) for more details.

#### `webpSupport`
This key enables [WebP](https://developers.google.com/speed/webp/) support in your project. This can dramatically increase your website performance on Chrome, Firefox and Android devices. The feature includes automatic image conversion and CSS rewriting to support older browsers. The goal is to keep it seamless - the developer has to prepare image assets like before. Then they'll get converted and a corresponding CSS syntax will be generated during the build and serve processes.

Default: `false` (feature disabled). If changed to anything else (for example to `{}`, the following default settings are respected and can be overridden:

```json5
{
    extensions: [ "png" ], // specifies file extensions to convert and rewrite
    parentElement: "body", // specifies which selector will contain feature detection classes
    noSupportClass: "no-webp", // feature detection class: no webp support
    noJsClass: null, // feature detection class: no javascript support
    supportClass: "webp", // feature detection class: webp support
    replaceExtension: true, // replace original file extension instead of appending .webp
    codecConfig: {
      lossless: true
    }
}
```

For `codecConfig` see [imagemin-webp GitHub page](https://github.com/imagemin/imagemin-webp).

If `noSupportClass` and `noJsClass` are `null` the ruleset will be appended, not replaced.

Example usage:
```css
.myimage { background-image: url('./img/image.png'); }
```

will be replaced with a new ruleset:
```css
body.no-js .myimage { background-image: url('./img/image.png'); }
body.no-webp .myimage { background-image: url('./img/image.png'); }
body.webp .myimage { background-image: url('./img/image.webp'); }
```

To disable the rewrite in a specific ruleset, add a comment `/* no-webp */` inside.
As this is quite a new feature, it is recommended to experiment, which setup works best for your project.

Because of a spotty browser support, the CSS rulesets rely on browser feature detection. This can be achieved easily using our package: [@considonet/support-classes](https://www.npmjs.com/package/@considonet/support-classes). If you don't like it, you can also use [Modernizr](https://modernizr.com/) or [supports-webp](https://www.npmjs.com/package/supports-webp) npm package. The `noJsClass` is by default set to `null` so the website doesn't force the device to download non-webp contents (to save the amount of data transferred). However, no image will be displayed until JS code gets executed. If it's crucial to serve the contents for JS-disabled browsers, this setting might be useful.

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
- `browsersync.mode` - determines in which mode G-Build should start the `browser-sync` service. The following settings are available:
  - `serve` - launches a static HTTP server with a root directory set in `paths.projectRoot`
  - `proxy` - launches a proxy server proxying requests to the URL set in `browsersync.proxiedUrl`. Useful for `docker`-based solutions or locally hosted projects using `apache` etc.
  - `auto` - detects the running environment in a smart way (detecting a Visual Studio solution, PHP solution or a static frontend package). When VS solution is detected, G-Build automatically configures the `browsersync.proxiedUrl` to the IIS Express URL and port set in the `.csproj` file. When a PHP solution is detected, G-Build runs a `php-cli` server and proxies it through `browser-sync`. If none of the above are detected, it runs in the static HTTP server mode.
- `browsersync.notify` - determines whether `browser-sync` should display in-browser notifications (usually about content reload).

The default `browsersync` configuration is sufficient for most of the projects and looks like this:
```json
{
  "spa": false,
  "port": 3000,
  "openBrowser": true,
  "urlRewrites": [],
  "mode": "auto",
  "notify": true
}
```

##### `webpack`
Specifies `webpack`-specific configuration. Because G-Build automatically generates a pre-set `webpack` configuration, this setting doesn't follow any standards for `webpack` config - the following keys are supported:
- `enableBundleAnalyzerServer` - determines whether to run a diagnostic `webpack-bundle-analyzer` server to understand your JS bundle structure and sizes.
- `extractRuntime` (new in 2.1) - determines whether to extract the common part of your bundles (for now `@babel/polyfill`) to an external file. Possible values: `false` - no extraction, `[filename]` - filename without extension. For example setting `extractRuntime` to `runtime` will result in an additional JS file with a name `runtime.js` located in your `paths.output.js` directory. This setting is useful when you have multiple bundles with a common part (such as `@babel/polyfill`). This setting will be improved in future versions to allow more modules to be bundled in the runtime file.
- `extractModules` (new in 2.1) - determines whether to extract modules from `node_modules` to external files. If set to `true` there will be an additional bundle file created in your `paths.output.js` directory with a name `vendor.[yourInputJSEntryFileName].js`. When used with proper content hashing in the bundle file names, can speed up the page load as the user wil download only the updated bundle, not the runtime and the modules. `extractRuntime` can be used in conjunction with `extractModules` as well. __Important__: If `extractRuntime` is enabled and no files from `node_modules` are imported, the vendor JS file will not be created (only the runtime file). If there are multiple entry points, `webpack` considers all the modules as shared and prepares the bundles in an alphabetical order. So if two of the entry points are using `package1` but only the second one uses `package2`, the first vendor bundle will contain `package1` and the latter will contain `package2`. So basically the second entry point will also need a vendor bundle for the first entry point. To have two completely separated vendor bundles, you need to run G-Build (and `webpack`) twice, with separate setups. This can be achieved using `-c` command line parameter.
- `usagePolyfills` (new in 3.0) - when `true` enables usage-based polyfills (new `babel` feature, quite stable starting from Babel 7.4). When `false` adds standard `core-js/stable` and `regenerator-runtime/runtime` (before Babel 7.4.0 `@babel/polyfill`) (using `@babel/preset-env`) to all JS scripts (default behavior for G-Build <3.0). This setting can dramatically decrease vendor modules overhead and overall JS file size. For more information: [an article regarding core-js 3](https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md) and [babel-preset-env documentation](https://babeljs.io/docs/en/babel-preset-env).
- `coreJsVersion` (new in 3.0) - used only in conjunction with `usagePolyfills` set to `true`. Specifies which version of `core-js` has to be used for polyfills. The package itself (with a corresponding version) has to be installed manually as a dependency to your project (optional peer dependency).
- `modules`
  - `modules.externals` - specifies external modules available in the global JS namespace. Example usage scenario: assuming that `jquery` is included in the HTML file from the CDN, the module shouldn't be bundled any more. In this case we set up a key-value array where the key specifies the module name and the value specifies the global variable under which the module is available. In this case the setting should be set to:
  ```json5
  {
    "jquery": "jQuery" // because window.jQuery will contain the imported "jquery" module
  }
  ```
  - `modules.alias` - specifies the module resolving aliases. This setting uses the offical `webpack` syntax specified in the [docs](https://webpack.js.org/configuration/resolve/#resolve-alias). 

The default `webpack` configuration looks like this:
```json5
{
  "hardSourceCache": false,
  "enableBundleAnalyzerServer": false,
  "extractRuntime": false,
  "extractModules": false,
  "usagePolyfills": true,
  "coreJsVersion": 3,
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

Default `php` setting is `false`. This setting can be overridden with `browsersync.mode` set to `auto` - when a PHP project is detected, G-Build will try to launch PHP server anyway. If the setting is `true`, PHP server will be launched always, regardless of the project type detection.

##### `lint`
Specifies whether the code should be linted. This supports the following settings:
- `js` - if set to `true` `tslint` will run to check compiled `.ts` and `.js` files. These also include all the variants such as `.vue` or `.jsx` files. `tslint.json` config file has to be placed in the same directory as `package.json`. Default: `true` (it was not possible to disable it before version 2.4).
- `scss` - if set to `true` `stylelint` will run to check your SCSS files. The rules for `stylelint` should be defined in `.stylelintrc` file (all formats are supported) in the same directory as `package.json` file, according to the [documentation](https://stylelint.io/user-guide/configuration/). If the linting fails, the code still remains compiled. For compatibility reasons the default for version 2.x and 3.x is `false`. It will be `true` by default starting from G-Build 4.0.

##### `optimizeAssets`
Feature since 2.4. Specifies whether during the production build the image assets should be optimized (losslessly compressed). This is should be harmless for any files. Optimization is done using `imagemin` and applies to GIF, JPEG, PNG and SVG files. Default is `true`.

##### `logVerbosity`
Specifies the logging verbosity in the range of numbers 0 and 5 where 1 specifies minimal (but usually sufficient) logging and 5 very detailed messages. Setting to 0 disables the console messages completely. Default is `1`.

##### `cleanDirectories`
Specifies whether to purge the output directories before compilation - specified for the same keys as for `paths.output` - boolean value per each directory type. Defaults:
 
 ```json
 {
   "css": true,
   "js": true,
   "misc": true,
   "ejs": false
 }
 ```
Prior to version 2.4 it was not possible to disable directory cleaning.
 
##### `ejsVars`
Specifies variables passed to the EJS templates. You can put here any object to be accessed from `ejs` files. 

Example usage:
```json
{
  "someVar": "hello"
}
````

The variable will be accessible in EJS file using `<%= someVar %>`.

Default setting is `{}`.

##### `bubbleNotifications`
Specifies which system notifications should be displayed when G-Build is compiling. Default settings:
```json
{
  "js": true,
  "styles": true,
  "ejs": true
}
```

- `js` notifications are displayed when JavaScript/TypeScript errors happen, linting fails or first successful compilation occured
- `styles` notifications are displayed if SCSS compilation and style linting fail
- `ejs` notifications deal with EJS compilation failures

The notifications might be helpful when G-Build runs in a minimized console window.

#### Configuration file: `tsconfig.json`
TypeScript compiler configuration file. The following settings are considered as recommended (due to the usage of `webpack` for module resolution and `babel` for ES6 to ES5 transpiling):
```json5
{
   "compilerOptions": {
     "noImplicitAny": true,
     "removeComments": false,
     "target": "es6",
     "allowSyntheticDefaultImports": true,
     "moduleResolution": "node",
     "pretty": true,
     "sourceMap": true,
     "experimentalDecorators": true,
     "jsx": "preserve",
     "resolveJsonModule": true
   }
 }
```

#### BrowsersList configuration

Starting from G-Build 3.1 replaces `targetBrowsers` config key. Please follow [BrowsersList docs](https://github.com/browserslist/browserslist#queries) for more details. You can use package.json `browsersList` key or a dedicated config file.

#### Optional configuration file: `tslint.json`
`tslint` configuration file. Customized depending on your personal preferences. Please make sure to point this file in your IDE. Not required when `lint.js` is set to `false`. 

#### Optional configuration file: `.stylelintrc`
`stylelint` configuration file. Customized depending on your personal preferences. Not required when `lint.scss` is set to `false`.

## FAQ

__Why is my WebStorm/PhpStorm/Rider not linting the code?__

This is because `tslint` package is included inside G-Build's `package.json` and is not detected by JetBrains' software by default. To use `tslint` inside your IDE, please set manually the path to `tslint` pointing to the proper directory inside your project's `node_modules` directory.

__How to be able to import .vue files into TypeScript files?__

TypeScript needs to be informed that exports from .vue files are of type `Vue`. Because .vue files are imported and transpiled using `vue-loader`, the type declarations don't exist in the transpiled .js file. In this case please create a so-called shim file (usually we keep it in `/shims/vue.d.ts`) containing:
```typescript
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
```

## Future plans
The following features are for now on our roadmap:
- Project scaffolding
- Support for `<style>` tags in SFCs (such as .vue files)
