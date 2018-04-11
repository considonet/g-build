#!/usr/bin/env node
'use strict';
const program = require('commander');
const gbuild = require('./api.js');

program.version(gbuild.getVersion());
program.alias('gbuild');

gbuild.splash();

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

program.command('assets')
  .description('Copies the assets files again (without rebuilding the scripts and styles)')
  .action(function() {

    gbuild.assets();

  });

program.parse(process.argv);
