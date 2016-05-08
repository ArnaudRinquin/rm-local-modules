var fs = require('fs');
var path = require('path')
var rimraf = require('rimraf');

function isLocalModule(version) {
  return version.startsWith('file:')
}

function access(filePath) {
  return new Promise(function(resolve, reject){
    fs.access(filePath, function(err, res){
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
}

function rmdir(dirPath) {
  return new Promise(function(resolve, reject){
    rimraf(dirPath, function(err, res){
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

function processLocalModule(dir, moduleName) {
  var modulePath = path.join(dir, 'node_modules', moduleName)
  return access(modulePath)
    .then(rmdir.bind(null, modulePath))
    .then(function(){
      return {
        name: moduleName,
        success: true,
      };
    })
    .catch(function(err) {
      return {
        name: moduleName,
        success: false,
        error: err,
      };
    })
}

function filterLocalModules(deps) {
  return Object.keys(deps)
    .map(function(key) {
      return {
        name: key,
        version: deps[key],
      };
    })
    .filter(function(moduleDesc){
      return isLocalModule(moduleDesc.version);
    })
    .map(function(moduleDesc) {
      return moduleDesc.name;
    });
}

function filterLocalModulesNames(package) {
  return [
    package.dependencies,
    package.devDependencies,
  ].filter(function(x){ return x})
  .map(filterLocalModules)
  .reduce(function(localModules, otherLocalModules){
    return localModules.concat(otherLocalModules)
  }, []);
}

module.exports = function(opts) {

  var dir = opts.dir;
  if (typeof dir !== 'string') {
    callback(null, new Error('Missing mandatory option: dir'));
    return;
  }

  var packagePath = path.join(dir, 'package.json');

  try {
    fs.accessSync(packagePath);
  } catch(error) {
    callback(null, new Error('Can not access: ' + packagePath));
    return
  }

  try {
    var package = JSON.parse(fs.readFileSync(packagePath));
  } catch(error) {
    callback(null, new Error('Invalid JSON: ' + packagePath));
  }

  var localModules = filterLocalModulesNames(package);
  return Promise.all(
    localModules.map(processLocalModule.bind(null, opts.dir))
  )
}
