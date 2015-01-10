/*
 * grunt-create
 * https://github.com/mkatanski/grunt-create
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var eachAsync = require('each-async'),
    path      = require('path'),
    inquirer  = require('inquirer'),
    _         = require('lodash');

module.exports = function (grunt) {

    'use strict';

    var MODULE_NAME     = 'produce',
        MODULE_DESC     = 'Automating the process of creating project files',
        NEW_LINE        = '\n',
        options         = {},
        variables       = {},
        destinationFile = '',
        template        = [];

    /**
     * Replace variables in string
     *
     * @param str {string} String to search for variables
     * @returns {string} Expanded string
     */
    function expandString(str) {
        for (var varName in variables) {
            if (variables.hasOwnProperty(varName)) {
                // TODO: Add warning about non existing variables with optional line number
                str = str.replace('{{' + varName + '}}', variables[varName]);
            }
        }
        return str;
    }

    /**
     * Replace variables in template file
     */
    function expandTemplate() {
        template.forEach(function (line, lineIndex) {
            template[lineIndex] = expandString(line);
        });
    }

    /**
     * Get array of questions for user
     */
    function getQuestions() {
        var questions = [],
            i = 0;

        for (var varName in variables) {
            if (variables.hasOwnProperty(varName)) {
                questions[i] = {
                    name   : varName,
                    message: varName,
                    default: variables[varName]
                };
                i++;
            }
        }

        return questions;
    }

    /**
     * Create variables to use in template
     * @returns {number} Number of collected variables via CLI
     */
    function prepareVariables() {
        // number of collected variables via CLI
        var variablesCount = 0;

        // Assign to variables object initial values
        variables['username'] = options.username;
        variables['email'] = options.email;
        // TODO: FIX default variables can be overwrite by arguments without defining them in gruntfile

        if (grunt.util.kindOf(options.variables) === 'object') {
            // for each defined variable collect variable value
            for (var varName in options.variables) {
                if (options.variables.hasOwnProperty(varName)) {
                    if (grunt.option(varName)) {
                        variablesCount++;
                    }
                    variables[varName] = grunt.option(varName) || options.variables[varName];
                }
            }
        }
        return variablesCount;
    }

    /**
     * Check if options are correct
     */
    function checkOptions() {
        if (grunt.util.kindOf(options.fileName) !== 'function' && grunt.util.kindOf(options.fileName) !== 'string') {
            grunt.fail.fatal('fileName is required and must be a string or function');
        }

        if (grunt.util.kindOf(options.template) !== 'string') {
            grunt.fail.fatal('template is required and must be a string');
        }

        // Check if template file exists
        // TODO: Template can be also a regular string, not file path
        if (!grunt.file.exists(options.template)) {
            grunt.fail.fatal('Template doesn\'t exists! [' + options.template + ']');
        }
    }

    /**
     * Do final steps to finish current task
     */
    function finalizeTask() {
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
        if (grunt.file.exists(destinationFile)) {

            // TODO: Add option to overwrite existing files

            grunt.fail.fatal('Destination file exists! [' + destinationFile + ']');
        }

        // Save file
        grunt.file.write(destinationFile, template.join(NEW_LINE));
        grunt.log.writeln('File saved as: ' + destinationFile);
    }

    /**
     * Main grunt module function
     */
    grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function () {
        var async       = this.async(),
            _this       = this,
            _gitConfig  = {};

        // Prevent running multiple targets
        if (grunt.cli.tasks.toString() == MODULE_NAME) {
            // TODO: Display possible targets to run with variables
            grunt.fail.fatal('You have to specify target name!');
        }

        // Get GIT config values for username and user e-mail
        eachAsync(['user.name', 'user.email'], function (item, index, done) {
            grunt.util.spawn({cmd: 'git', args: ['config', item]}, function (error, result) {
                // If result is stdout append git config value to gitConfig object
                if (result.stdout) {
                    _gitConfig[item] = String(result);
                }
                // Set current async process as finished
                done();
            });
        }, function () {
            // Merge task-specific and/or target-specific options with these defaults.
            options = _this.options({
                'fileName' : '{{name}}.ts',
                'template' : '',
                'variables': {name: 'MyFile'}
                // TODO: Add validate functions to each variable and required option
            });

            // Prepare use name and email
            options.username = _gitConfig['user.name'] || '';
            options.email = _gitConfig['user.email'] || '';

            checkOptions();

            // Read template file
            template = grunt.file.read(options.template).split(NEW_LINE);

            // Prepare defined variables and get count of passed variables via CLI
            var varNum = prepareVariables();

            if (varNum === 0) {
                // if no vars has been passed, prompt user for every variable
                inquirer.prompt(getQuestions(), function (answers) {
                    _(answers).forEach(function (answer, varName) {
                        // assign user answers to variable
                        variables[varName] = answer;
                    });
                    // finish async mode
                    async();
                    // finalize task
                    finalizeTask();
                });

            } else {
                // use passed values
                // finish async mode
                async();
                // finalize task
                finalizeTask();
            }
        });
    });

};
