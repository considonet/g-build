#!/usr/bin/env node
'use strict';

const program = require('commander');
const gbuild = require('./api.js');

gbuild.splash();

program.version('1.0.3');
program.alias('gbuild');

program.command('build')
  .description('Builds the solution')
  .action(function() {

    gbuild.build();

  });

program.command('serve')
  .description('Serves the solution with file watchers in development mode')
  .action(function() {

    gbuild.serve();

  });

program.command('watch')
  .description('Runs the file watchers in a production mode')
  .action(function() {

    gbuild.watch();

  });

program.parse(process.argv);