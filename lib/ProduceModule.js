/*
 * ProduceModule
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var ProduceModule = (function () {

    function ProduceModule(grunt) {
        this.grunt = grunt;

        this.path = require('path');
        this.inquirer = require('inquirer');
        this.eachAsync = require('each-async');
        this._ = require('lodash');

        this.NEW_LINE = '\n';
        this.options = {};
        this.variables = {};
        this.destinationFile = '';
        this.template = [];
    }

    /**
     * Replace variables in string
     *
     * @param str {string} String to search for variables
     * @returns {string} Expanded string
     */
    ProduceModule.prototype.expandString = function (str) {
        for (var varName in this.variables) {
            if (!this.variables.hasOwnProperty(varName)) {
                continue;
            }
            // TODO: Add warning about non existing variables with optional line number
            str = str.replace('{{' + varName + '}}', this.variables[varName]);
        }
        return str;
    };

    /**
     * Replace variables in template file
     */
    ProduceModule.prototype.expandTemplate = function () {
        var _this = this;
        // for each line in template
        this.template.forEach(function (line, lineIndex) {
            // expand template line
            _this.template[lineIndex] = _this.expandString(line);
        });
    };

    /**
     * Get array of questions for user
     */
    ProduceModule.prototype.getQuestions = function () {
        var _questions = [],
            i = 0;
        // for each available variable
        for (var varName in this.variables) {
            if (!this.variables.hasOwnProperty(varName)) {
                continue;
            }
            // create new question object
            _questions[i] = {
                name   : varName,
                message: varName,
                default: this.variables[varName]
            };
            i++;
        }
        return _questions;
    };

    /**
     * Create variables to use in template
     * @returns {number} Number of collected variables via CLI
     */
    ProduceModule.prototype.prepareVariables = function () {
        // number of collected variables via CLI
        var _variablesCount = 0;

        // Assign to variables object initial values
        this.variables['username'] = this.options.username;
        this.variables['email'] = this.options.email;
        // TODO: FIX default variables can be overwrite by arguments without defining them in gruntfile

        if (this.grunt.util.kindOf(this.options.variables) === 'object') {
            // for each defined variable collect variable value
            for (var varName in this.options.variables) {
                if (!this.options.variables.hasOwnProperty(varName)) {
                    continue;
                }
                // if variable is passed in via CLI
                if (this.grunt.option(varName)) {
                    // increment counter
                    _variablesCount++;
                }
                // assign variable value
                this.variables[varName] = this.grunt.option(varName) || this.options.variables[varName];
            }
        }
        return _variablesCount;
    };

    /**
     * Check if options are correct
     */
    ProduceModule.prototype.checkOptions = function () {
        if (this.grunt.util.kindOf(this.options.fileName) !== 'function' &&
            this.grunt.util.kindOf(this.options.fileName) !== 'string') {
            this.grunt.fail.fatal('fileName is required and must be a string or function');
        }

        if (this.grunt.util.kindOf(this.options.template) !== 'string') {
            this.grunt.fail.fatal('template is required and must be a string');
        }

        // Check if template file exists
        // TODO: Template can be also a regular string, not file path
        if (!this.grunt.file.exists(this.options.template)) {
            this.grunt.fail.fatal('Template doesn\'t exists! [' + this.options.template + ']');
        }
    };

    /**
     * Do final steps to finish current task
     */
    ProduceModule.prototype.finalizeTask = function () {
        // if fileName is a function, run it passing variables as an argument
        if (this.grunt.util.kindOf(this.options.fileName) === 'function') {
            this.options.fileName = this.options.fileName(this.variables);
        }

        // Replace variables in file name
        this.options.fileName = this.expandString(this.options.fileName);
        // Create destination path
        this.destinationFile = this.path.join(this.options.fileName);

        // Replace variables in template file
        this.expandTemplate();

        // Check if destination file exists
        if (this.grunt.file.exists(this.destinationFile)) {

            // TODO: Add option to overwrite existing files

            this.grunt.fail.fatal('Destination file exists! [' + this.destinationFile + ']');
        }

        // Save file
        this.grunt.file.write(this.destinationFile, this.template.join(this.NEW_LINE));
        this.grunt.log.writeln('File saved as: ' + this.destinationFile);
    };

    ProduceModule.prototype.runTask = function (options, async) {
        var _gitConfig = {},
            _this = this;

        this.options = options;

        // Get GIT config values for username and user e-mail
        this.eachAsync(['user.name', 'user.email'], function (item, index, done) {
            _this.grunt.util.spawn({cmd: 'git', args: ['config', item]}, function (error, result) {
                // If result is stdout append git config value to gitConfig object
                if (result.stdout) {
                    _gitConfig[item] = String(result);
                }
                // Set current async process as finished
                done();
            });
        }, function () {

            // Assign user name and email
            // (empty string as default if loading data from git config was unsuccessful)
            _this.options.username = _gitConfig['user.name'] || '';
            _this.options.email = _gitConfig['user.email'] || '';

            _this.checkOptions();

            // Read template file
            _this.template = _this.grunt.file.read(_this.options.template).split(_this.NEW_LINE);

            // Prepare defined variables and get count of variables collected via CLI
            var varNum = _this.prepareVariables();

            if (varNum === 0) {
                // if no vars has been passed, prompt user for every variable
                _this.inquirer.prompt(_this.getQuestions(), function (answers) {
                    _this._(answers).forEach(function (answer, varName) {
                        // assign user answers to variable
                        _this.variables[varName] = answer;
                    });
                    // finish async mode
                    async();
                    // finalize task
                    _this.finalizeTask();
                });
            } else {
                // use passed values
                // finish async mode
                async();
                // finalize task
                _this.finalizeTask();
            }
        });
    };

    return ProduceModule;
})();

module.exports = ProduceModule;