# rm-local-modules

[![Build Status](https://travis-ci.org/ArnaudRinquin/rm-local-modules.svg?branch=master)](https://travis-ci.org/ArnaudRinquin/rm-local-modules)

Removes your locally installed modules.

Use case:

* Make sure you always have latest version of your locally installed modules using it in `preinstall`. [Example](https://github.com/ArnaudRinquin/local_modules_poc). There is a caveat though, as [npm@3 preinstall is broken](https://github.com/npm/npm/issues/10379). Works fine with npm@2

## CLI Options

`-verbose, -v`: outputs which modules where detected and if they were successfully removed:

> ```
Tried to remove 2 local module(s):
local ✔
sublocal ✔
> ```

`-dir, -d <path>`: the path were to run the tool, defaults to current dir.

## Programmatically

```js
var rmLocalModules = require('.');

var opts = {
  log: console.log.bind(console), // optional
  dir: '.', // mandatory
};

rmLocalModules(opts).then(function(results){
  // results is like [
  //   {name: 'local', success: true},
  //   {name: 'local', success: false, error: ... }
  // ]
});
```

## Example

```js

// package.json
{
  // ...
  "scripts": {
    "preinstall": "rm-local-modules"
  },
  "dependencies": {
    "local": "file:local",
    "sublocal": "file:sub/local"
  },
  "devDependencies": {
    "rm-local-modules": "^0.0.0"
  }
}
```
