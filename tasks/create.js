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
      parameters        = {},
      destinationFile   = '',
      template          = [];


  /**
   * Replace parameters in string
   *
   * @param str {string} String to search for parameters
   * @returns {string} Expanded string
   */
  function expandString(str) {
    for (var paramName in parameters) {
      // TODO: Add warning about non existing parameters with optional line number
      str = str.replace('{{'+paramName+'}}', parameters[paramName]);
    }
    return str;
  }

  /**
   * Replace paramaters in template file
   */
  function expandTemplate() {
    template.forEach(function(line, lineIndex){
      template[lineIndex] = expandString(line);
    });
  }

  /**
   * Create parameters to use in template
   */
  function prepareParameters() {

    // Assign to paramaters object initial values
    parameters['username']        = options.username;
    parameters['email']           = options.email;
    parameters['version']         = options.version;

    if (grunt.util.kindOf(options.parameters) === 'array') {

      // TODO: Add warning about declared but unused (empty) parameters
      // for each defined paramater collect param value
      options.parameters.forEach(function (paramName) {
        // Assign param value to parameters object
        parameters[paramName] = grunt.option(paramName) || '';
      });
    }
  }

  /**
   * Main grunt module function
   */
  grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function() {
    var async       = this.async(),
        _this       = this,
        _gitConfig  = {};

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
        'username'        : _gitConfig['user.name'] || '',
        'email'           : _gitConfig['user.email'] || '',
        'version'         : '0.1.0',
        'fileName'        : '{{name}}.ts',
        'cwd'             : '',
        'template'        : '',
        'parameters'      : []
        // TODO: Change parameters option to object with name and default value
      });

      // TODO: Check for required options [fileName, template]

      // Check if template file exists
      // TODO: Template can be also a string
      if(!grunt.file.exists(options.template)) {
        grunt.fail.fatal('Template doesn\'t exists! [' + options.template + ']');
      }

      // Read template file
      template  = grunt.file.read(options.template).split(NEW_LINE);

      // Collect all defined parameters
      prepareParameters();

      // TODO: Add step-by-step functionality to collect parameters

      // if fileName is a function, run it passing parameters as an argument
      if (grunt.util.kindOf(options.fileName) === 'function') {
        options.fileName = options.fileName(parameters);
      }

      // Replace parameters in file name
      options.fileName = expandString(options.fileName);
      // Create destination path
      destinationFile = path.join(options.cwd, options.fileName);

      // Replace parameters in template file
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
