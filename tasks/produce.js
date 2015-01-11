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
            'variables': {name: 'MyFile'}
            // TODO: Add validate functions to each variable and required option
        });

        // Prevent running multiple targets
        if (grunt.cli.tasks.toString() == MODULE_NAME) {
            // TODO: Display possible targets to run with variables
            grunt.fail.fatal('You have to specify target name!');
        }

        var produce = new ProduceModule(grunt);
        produce.runTask(_options, this.async());

    });
};
