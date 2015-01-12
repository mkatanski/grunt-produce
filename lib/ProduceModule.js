/*
 * ProduceModule
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var ProduceModule = (function () {

    require('shelljs/global');

    function ProduceModule(grunt) {
        this.grunt = grunt;

        this.path = require('path');
        this.inquirer = require('inquirer');
        this._ = require('lodash');

        this.NEW_LINE = '\n';
        if(/^win/.test(process.platform)) {
            this.NEW_LINE = '\r\n';
        }

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
     * @returns {boolean} Return false if no variables were passed in via CLI
     */
    ProduceModule.prototype._prepareVariables = function () {
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
        return  (_variablesCount !== 0);
    };

    /**
     * Check if options are correct
     */
    ProduceModule.prototype._checkOptions = function () {
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

        if (this.options.fileOverwrite !== 'block' && this.options.fileOverwrite !== 'warning') {
            this.grunt.fail.fatal('options.fileOverwrite must be equal to "block" or "warning"!');
        }
    };

    /**
     * Save destination file as expanded template
     */
    ProduceModule.prototype.saveFile = function () {
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
            if (this.options.fileOverwrite === 'block') {
                this.grunt.fail.fatal('Destination file exists! [' + this.destinationFile + ']');
            }
            if (this.options.fileOverwrite === 'warning') {
                this.grunt.log.errorlns('Destination file will be overwriten! [' + this.destinationFile + ']');
            }
        }

        // Save file
        this.grunt.file.write(this.destinationFile, this.template.join(this.NEW_LINE));
        this.grunt.log.writeln('File saved as: ' + this.destinationFile);
    };

    /**
     * Get git config
     *
     * @param configName {string} git config name
     * @returns {string} Git config value
     * @private
     */
    ProduceModule.prototype._getGitConfig = function (configName) {
        return exec('git config ' + configName, {silent:true}).output.replace('\n', '');
    };

    /**
     * Asynchronously prompt user for variables values
     *
     * @param async {object} grunt async object
     * @param callback {function} callback function which is triggered after prompting is complete
     */
    ProduceModule.prototype.promptUserAsync = function(async, callback) {
        var _this = this;

        _this.inquirer.prompt(_this.getQuestions(), function (answers) {
            _this._(answers).forEach(function (answer, varName) {
                // assign user answers to variable
                _this.variables[varName] = answer;
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
     * @param options {object} Grunt options
     */
    ProduceModule.prototype.setup = function (options) {
        // assign options to class object
        this.options = options;

        // Get GIT config values for username and user e-mail
        // (empty string as default if loading data from git config was unsuccessful)
        this.options.username = this._getGitConfig('user.name') || '';
        this.options.email = this._getGitConfig('user.email') || '';

        // Prepare defined variables and check if prompting for variable values is required
        this.promptUser = !this._prepareVariables();

        this._checkOptions();

        // Read template file
        this.template = this.grunt.file.read(this.options.template).split(this.NEW_LINE);

    };

    return ProduceModule;
})();

module.exports = ProduceModule;
