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
    jshint: {
      all:     [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean:  {
      tests: ['tmp']
    },

    nodeunit: {
      default: ['test/_default.js']
    },

    // Sample configuration
    produce:  {
      jqplugin: {
        options: {
          templateFile: 'defaultTemplates/jq_plugin-coffee.yml',
          outputFile: 'tmp/<%= variables.name %>.coffee',
          fileOverwrite: 'warning'
        }
      }
    },

    changelog: {
      options: {}
    },

    bump: {
      options: {
        files:              ['package.json'],
        updateConfigs:      [],
        commit:             true,
        commitMessage:      'Release v%VERSION%',
        commitFiles:        ['-a'],
        createTag:          true,
        tagName:            '%VERSION%',
        tagMessage:         'Version %VERSION%',
        push:               true,
        pushTo:             'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace:      false
      }
    }

  });

  // Actually load this plugins task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');

  grunt.registerTask('test', 'Run all tests.', function () {
    grunt.task.run('clean');
    grunt.task.run('nodeunit:default');
  });

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
