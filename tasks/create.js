/*
 * grunt-create
 * https://github.com/mkatanski/grunt-create
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var eachAsync = require('each-async'),
    path      = require('path');

module.exports = function(grunt) {

  'use strict';

  var MODULE_NAME       = 'create',
      MODULE_DESC       = 'Automating the process of creating project files',
      NEW_LINE          = '\n',
      options           = {},
      variables         = {},
      destinationFile   = '',
      template          = [];


  /**
   * Replace variables in string
   *
   * @param str {string} String to search for variables
   * @returns {string} Expanded string
   */
  function expandString(str) {
    for (var varName in variables) {
      // TODO: Add warning about non existing variables with optional line number
      str = str.replace('{{'+varName+'}}', variables[varName]);
    }
    return str;
  }

  /**
   * Replace variables in template file
   */
  function expandTemplate() {
    template.forEach(function(line, lineIndex){
      template[lineIndex] = expandString(line);
    });
  }

  /**
   * Create variables to use in template
   */
  function prepareVariables() {

    // Assign to variables object initial values
    variables['username']        = options.username;
    variables['email']           = options.email;

    if (grunt.util.kindOf(options.variables) === 'object') {

      // TODO: Add warning about declared but unused (empty) variables
      // for each defined variable collect variable value
      for (var varName in options.variables) {
        variables[varName] = grunt.option(varName) || options.variables[varName];
      }
    }
  }

  /**
   * Main grunt module function
   */
  grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function() {
    var async       = this.async(),
        _this       = this,
        _gitConfig  = {};

    // Prevent running multiple targets
    if (grunt.cli.tasks.toString() == MODULE_NAME) {
      // TODO: Display possible targets to run with variables
      grunt.fail.fatal('You have to specify target name!');
    }

    // Get git config values for username and user e-mail
    eachAsync(['user.name', 'user.email'], function (item, index, done) {
      grunt.util.spawn({ cmd: 'git', args: ['config', item]}, function(error, result){
        // If result is stdout append git config value to gitConfig object
        if (result.stdout) {
          _gitConfig[item] = String(result);
        }
        // Set current async process as finished
        done();
      });
    }, function () {
      // All async processes are finished
      async();

      // Merge task-specific and/or target-specific options with these defaults.
      options = _this.options({
        'fileName'        : '{{name}}.ts',
        'template'        : '',
        'variables'       : {name: 'MyFile'}
      });

      options.username = _gitConfig['user.name'] || '';
      options.email = _gitConfig['user.email'] || '';

      // TODO: Check for required options [fileName, template]

      // Check if template file exists
      // TODO: Template can be also a string
      if(!grunt.file.exists(options.template)) {
        grunt.fail.fatal('Template doesn\'t exists! [' + options.template + ']');
      }

      // Read template file
      template  = grunt.file.read(options.template).split(NEW_LINE);

      // Collect all defined variables
      prepareVariables();

      // TODO: Add step-by-step functionality to collect variables

      // if fileName is a function, run it passing variables as an argument
      if (grunt.util.kindOf(options.fileName) === 'function') {
        options.fileName = options.fileName(variables);
      }

      // Replace variables in file name
      options.fileName = expandString(options.fileName);
      // Create destination path
      destinationFile = path.join(options.fileName);

      // Replace variables in template file
      expandTemplate();

      // Check if destination file exists
      if(grunt.file.exists(destinationFile)) {

        // TODO: Add option to overwrite existing files

        grunt.fail.fatal('Destination file exists! [' + destinationFile + ']');
      }

      // Save file
      grunt.file.write(destinationFile, template.join(NEW_LINE));
      grunt.log.writeln('File saved as: ' + destinationFile);

    });
  });

};
