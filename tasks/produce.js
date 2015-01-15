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

    var MODULE_NAME = 'produce',
        MODULE_DESC = 'Automating the process of creating project files';

    grunt.registerMultiTask(MODULE_NAME, MODULE_DESC, function () {

        // Merge task-specific and/or target-specific template with these defaults.
        var _options = this.options({
            'templateFile' : ''
            }),
            // Create new ProduceModule instance
            produce = new ProduceModule(grunt);

        // Prevent running multiple targets
        if (grunt.cli.tasks.toString() === MODULE_NAME) {
            grunt.log.writeln(
                'You have to specify your target. Possible locals for ');

            // stop grunt task
            return true;
        }

        try {
            // setup ProduceModule
            produce.setup(_options);

            // If prompting for locals is required
            if(produce.promptUser) {
                produce.promptUserAsync(this.async(), function(){
                    produce.saveFile();
                });
            } else {
                produce.saveFile();
            }
        }
        catch(err) {
            grunt.fail.fatal(err);
        }
    });
};
