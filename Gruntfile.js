/*
 * grunt-create
 * https://github.com/mkatanski/grunt-create
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Configuration to be run (and then tested).
    create: {
      test: {
        options: {
          template: 'templates/template.tpl',
          variables: {
            name: 'TestController',
            description: 'Default Description'
          },
          fileName: 'tmp/test/{{name}}.js',
        }
      },
      another: {
        options: {
          template: 'templates/template.tpl',
          variables:   [
            'name',
            'description'
          ],
          fileName: function(params){
            return 'tmp/another/' + params.name + '.css';
          }
        }
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');

};
