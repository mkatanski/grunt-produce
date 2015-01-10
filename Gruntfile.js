/*
 * grunt-produce
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint : {
            all    : [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },

        // Sample configuration
        produce: {
            jqplugin: {
                options: {
                    template : 'templates/jq_template.tpl',
                    variables: {
                        name       : 'MyPlugin',
                        description: 'Default description'
                    },
                    fileName : 'tmp/test/{{name}}.coffee'
                }
            },
            another : {
                options: {
                    template : 'templates/jq_template.tpl',
                    variables: {
                        name       : 'MyPlugin',
                        description: 'Default description'
                    },
                    fileName : function (vars) {
                        return 'tmp/another/' + vars.name + '.coffee';
                    }
                }
            }
        },

        changelog: {
            options: {}
        },

        bump: {
            options: {
                files             : ['package.json'],
                updateConfigs     : [],
                commit            : true,
                commitMessage     : 'Release v%VERSION%',
                commitFiles       : ['-a'],
                createTag         : true,
                tagName           : '%VERSION%',
                tagMessage        : 'Version %VERSION%',
                push              : true,
                pushTo            : 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace     : false
            }
        }

    });

    // Actually load this plugins task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-conventional-changelog');
    grunt.loadNpmTasks('grunt-bump');

    grunt.registerTask('release', 'Create new release.', function (arg) {
        if (arguments.length === 0) {
            grunt.task.run('bump-only');
        } else {
            grunt.task.run('bump-only:' + arg);
        }

        grunt.task.run('changelog');
        grunt.task.run('bump-commit');
    });

};
