#!/usr/bin/env node

var rmLocalModules = require('.');
var argv = require('minimist')(process.argv.slice(2), {
  string: ['dir'],
  boolean: ['verbose'],
  alias: {
    dir: ['d'],
    verbose: ['v'],
  }
});
var clc = require('cli-color')

var opts = {
  dir: argv.dir || process.cwd(),
  log: argv.verbose ? console.log.bind(console) : null
}

rmLocalModules(opts).then(function(results){
  if (argv.verbose) {
    console.log('Tried to remove ' + results.length + ' local module(s):')
    results.forEach(function(result) {
      console.log(result.name, result.success ?
        clc.green('✔') :
        clc.red('✘')
      )
    })
  }
});
