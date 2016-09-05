# fis3-hook-npm
[![Build Status](https://travis-ci.org/qqiangwu/fis3-hook-npm.svg?branch=master)](https://travis-ci.org/qqiangwu/fis3-hook-npm)

Modularity is a big problem in web development. Now we have a great compiler for our front-end code, how do we achieve modularity?

+ Firstly, we must have a modularity standard.
+ Secondly, we have have a central module repository.

Creating a central repository is hard and a long-time job. But wait, we already have two great central repository: bower & npm.

I've writen a [fis3-hook-bower](https://www.npmjs.com/package/fis3-hook-bower). But the question is, bower components have no unified modularity standard. But npm do! So I come!

## Installation
```
npm install -g fis3-hook-npm
```
or

```
npm install fis3-hook-npm
```

## Usage
Note that this hook is only for reusing node_modules. If you want to develop your own local modules, use [fis3-hook-commonjs](https://github.com/fex-team/fis3-hook-commonjs).

Also note that DO REMEMBER TO EXCLUDE node_modules from your codebase, it might be too large to be processed by fis3. Luckily, this is done by fis3 already!

```js
// used to do node_modules lookup
fis.hook('npm');

// used to resolve dependencies and wrap your code with `define`.
fis.hook('commonjs');

// our module loader
fis.match('/node_modules/fis-mod/mod.js', {
    wrap: false
});

// !!REQUIRED
fis.match('/node_modules/**.js', {
    isMod: true
});

// DO NOT DO THIS! DO NOT EVER EXPLICITLY MENTION /node_modules
//fis.match('/node_modules/(**).js', {
//    id: '$1'
//});
```

In your code:
```html
<!-- index.html -->
<body>
    <script src="./boot?__inline"></script>
</body>
```

```js
// boot.js
// import modjs for module loading
// @require fis-mod
// if you want to refer to a css, DO REMEMBER TO ADD '.css'
// @require css-lib/xxx.css
(function(){
    'use strict';

    // coped by fis3-hook-commonjs
    var app = require('my-app-module');

    // coped by npm install react
    var react = require('react');
    var addons = require('react/addons');
})();
```

## Rules
+ For top level package, look into package.json and pick up the js file specified by the `main` attribute.
+ For sub packages, say, `foo`, try `foo/index.js` first, if no match found, search as the following
+ For others, say, `bar`, try `bar` first and then try `bar.js`

# Caveat
FIS3-HOOK-NPM MUST BE USED WITH FIS3-HOOK-COMMONJS TOGETHER! Since I don't want to duplicate the code.

FIS3-HOOK-NPM only support npm3, it cannot cope with nested modules.

## Configuration
The following configuration items are all optional.

+ `base`: default to 'node_modules', eg. where to find node modules installed by npm. **Note that, `base` must be inside the root folder or it will not work.**
+ `shim`: used to cope with unstandard node packages. (Not tested sufficiently)
```js
fis.hook('npm', {
    shim: {
        'angular-ui-router': {
            deps: {
                // moduleName: exportSymbol
                // eg. var exportSymbol = require(moduleName);
                'angular': 'angular'
            }
        },
        'angular-markdown-directive': {
            deps: {
                'angular': 'angular',
                // we don't need the symbol
                'angular-sanitize': null,
                'showdown': 'Showdown'
            },
            exports: '"btford.markdown"'
        }
});
```

# Demo
+ See the `demo/` foler.
+ [React Example](https://github.com/qqiangwu/site)
