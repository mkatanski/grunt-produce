/*
 * ProduceModule
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var ProduceModule = (function () {
  'use strict';

  var path = require('path'),
      inquirer = require('inquirer'),
      _ = require('underscore'),
      yaml = require('js-yaml'),
      validator = require('validator'),
      fs = require('fs'),
      Git = require('./Git.js');

  /**
   * Create ProduceModule instance
   *
   * @param grunt {Class} Grunt class
   * @constructor
   */
  function ProduceModule(grunt) {
    this.grunt = grunt;
    this.template = {};
    this.destinationFile = '';

    this.locals = {
      core: {},
      variables: {}
    };

    // Create core classes element
    this.locals.core.git = new Git();

    this.template.fileOverwrite = undefined;
    this.template.templateName = undefined;
  }

  /**
   * Validate locals variables
   */
  ProduceModule.prototype.validate = function () {
    _.each(this.locals.variables, function (value, varName) {
      var _variable = this.template.variables[varName];

      // check if non-function variable is required
      if (!_.isFunction(value)) {
        if ((_.isNaN(value) || value.trim() === '') && _variable.required === true) {
          throw 'Variable [' + varName + '] is required';
        }
      }

      // validate variable
      if (_.isFunction(_variable.validate) && !_variable.validate(value, validator)) {
        throw 'Variable [' + varName + '] value is incorrect';
      }
    }, this);
  };

  /**
   * Get array of questions for user
   */
  ProduceModule.prototype.getQuestions = function () {
    var _questions = [];
    // for each available variable
    _.each(this.locals.variables, function (value, varName) {
      // create new question object and append to list if value is not a function
      if (!_.isFunction(value)) {
        _questions.push({
          name:    varName,
          message: varName,
          default: value
        });
      }
    }, this);
    return _questions;
  };

  /**
   * Create locals to use in template
   * @returns {boolean} Return false if no locals were passed in via CLI
   */
  ProduceModule.prototype._prepareVariables = function () {
    // number of collected locals via CLI
    var _variablesCount = 0;

    if (_.isObject(this.template.variables)) {
      // for each defined variable collect variable value
      _.each(this.template.variables, function (variable, varName) {
        // check if variable value is a function
        if (_.isFunction(variable.value)) {
          this.locals.variables[varName] = variable.value;
        } else {
          // if variable is passed in via CLI
          if (this.grunt.option(varName)) {
            // increment counter
            _variablesCount++;
          }
          // assign variable value
          this.locals.variables[varName] =
              this.grunt.option(varName) || variable.value;
        }
      }, this);
    }
    return (_variablesCount !== 0);
  };

  /**
   * Check if template are correct
   */
  ProduceModule.prototype._checkOptions = function () {
    if (!_.isFunction(this.template.fileName) &&
          !_.isString(this.template.fileName)) {
      throw 'fileName is required and must be a string or function';
    }

    if (!_.isString(this.template.template)) {
      throw 'template is required and must be a string';
    }

    if (this.template.fileOverwrite !== 'block' &&
        this.template.fileOverwrite !== 'warning') {
      throw 'options.fileOverwrite must be equal to "block" or "warning"!';
    }
  };

  /**
   * Save destination file as expanded template
   */
  ProduceModule.prototype.saveFile = function () {
    // validate locals
    this.validate();

    // if fileName is a function, run it passing locals as an argument
    if (_.isFunction(this.template.fileName)) {
      this.template.fileName = this.template.fileName(this.locals);
    }

    // Replace locals in file name
    this.template.fileName = _.template(this.template.fileName)(this.locals);
    // Create destination path
    this.destinationFile = path.join(this.template.fileName);

    // Replace locals in template file
    this.template.template = _.template(this.template.template)(this.locals);

    // Check if destination file exists
    if (this.grunt.file.exists(this.destinationFile)) {
      if (this.template.fileOverwrite === 'block') {
        throw 'Destination file exists! [' + this.destinationFile + ']';
      }
      if (this.template.fileOverwrite === 'warning') {
        this.grunt.log.errorlns('Destination file will be overwriten! [' +
        this.destinationFile + ']');
      }
    }

    var _templateName = this.template.templateName || this.template.templateFile,
        _description = this.template.description || '';

    console.log('\n\nSaving new file [' + this.destinationFile + '] based on:\n' +
        _templateName + ': ' + _description + '\n'
    );

    // Save file
    this.grunt.file.write(this.destinationFile, this.template.template);
    this.grunt.log.writeln('File saved as: ' + this.destinationFile);
  };

  /**
   * Asynchronously prompt user for locals values
   *
   * @param async {function} grunt async object
   * @param callback {function} callback function which is triggered
   * after prompting is complete
   */
  ProduceModule.prototype.promptUserAsync = function (async, callback) {
    var _this = this;
    inquirer.prompt(this.getQuestions(), function (answers) {
      _.each(answers, function (answer, varName) {
        // assign user answers to variable
        _this.locals.variables[varName] = answer;
      });
      // finish async mode
      async();
      // run callback function
      callback();
    });
  };

  /**
   * Setup module, collect all required data and load template file
   *
   * @param options {object} Module options
   */
  ProduceModule.prototype.setup = function (options) {
    // load template from YAML file
    /*jslint node: true, stupid: true */
    this.template = yaml.load(fs.readFileSync(options.templateFile, 'utf8'));
    this.template.templateFile = options.templateFile;

    // Add fileName to template object
    this.template.fileName = options.outputFile;
    this.template.fileOverwrite = options.fileOverwrite;

    // Prepare defined locals and check if prompting for variable
    // values is required
    this.promptUser = !this._prepareVariables();

    this._checkOptions();

    // Check if template file exists
    if (this.grunt.file.exists(this.template.template)) {
      // Read template file
      this.template.template = this.grunt.file.read(this.template.template);
    }
  };

  return ProduceModule;
}());

module.exports = ProduceModule;
