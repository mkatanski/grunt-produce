/*
 * grunt-produce
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var ProduceModule = require('../lib/ProduceModule.js');

module.exports = function (grunt) {
    'use strict';

    var MODULE_NAME = 'produce';
    var MODULE_DESC = 'Automating the process of creating project files';

    grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function () {

        // Merge task-specific and/or target-specific options with these defaults.
        var _options = this.options({
            'fileName' : '{{name}}.ts',
            'template' : '',
            'variables': {name: 'MyFile'},
            'fileOverwrite': 'block'
            // TODO: Add validate functions to each variable and required option
        });
        // Create new ProduceModule instance
        var produce = new ProduceModule(grunt);

        // Prevent running multiple targets
        if (grunt.cli.tasks.toString() == MODULE_NAME) {
            // TODO: Display possible targets to run with variables
            grunt.fail.fatal('You have to specify target name!');
        }

        try {
            // setup ProduceModule
            produce.setup(_options);
        }
        catch(err) {
            grunt.fail.fatal(err);
        }

        // If prompting for variables is required
        if(produce.promptUser) {
            produce.promptUserAsync(this.async(), function(){
                try {
                    produce.saveFile();
                }
                catch(err) {
                    grunt.fail.fatal(err);
                }
            });
        } else {
            try {
                produce.saveFile();
            }
            catch(err) {
                grunt.fail.fatal(err);
            }
        }

    });
};
