#!/usr/bin/env node
'use strict';
const program = require('commander');
const gbuild = require('./api.js');

program.version(gbuild.getVersion());
program.alias('gbuild');

gbuild.splash();

program.option('-c, --config <configfile>', 'load a specific config file', './gbuildconfig.js');

program.command('build')
  .description('Builds the solution')
  .action(function(cmd) {

    gbuild.build(cmd.parent.config);

  });

program.command('serve')
  .description('Serves the solution with file watchers in development mode')
  .action(function(cmd) {

    gbuild.serve(cmd.parent.config);

  });

program.command('watch')
  .description('Runs the file watchers in a production mode')
  .action(function(cmd) {

    gbuild.watch(cmd.parent.config);

  });

program.command('assets')
  .description('Copies the assets files again (without rebuilding the scripts and styles)')
  .action(function(cmd) {

    gbuild.assets(cmd.parent.config);

  });

program.command('fontastic')
  .description('Downloads, extracts and converts a Fontastic Icon Cloud hosted webfont package. See http://fontastic.me for more details.')
  .action(function(cmd) {

    gbuild.fontastic(cmd.parent.config);

  });

program.parse(process.argv);
