'use strict';

var grunt = require('grunt');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports.bump = {
  load:  function (test) {

    var actual = require('../tasks/produce'),
        ProduceModule = require('../lib/ProduceModule.js'),
        Git = require('../lib/Git.js'),
        produce = null,
        gitUsername,
        gitEmail;

    Git = new Git();
    gitUsername = Git.getUsername();
    gitEmail = Git.getEmail();

    /**
     * Tests:
     * outputFile as a function returning file name with variable defined in YAML
     * fileOverwrite block method
     * Default variables values
     * Variables values passed as an argument
     * Variable value as a function
     *
     * Result file should contain name pass through CLI, description with
     * default value, git username and git email
     *
     * @param test
     * @param grunt
     */
    function firstPass(test, grunt) {
      var template,
          fileLines,
          _options = {
            templateFile: 'test/test_template.yml',
            outputFile: function (locals) {
              return 'tmp/' + locals.variables.name + '.txt';
            },
            fileOverwrite: 'block'
          };

      grunt.option('name', 'Test1');
      // email variable is a function so passing it as CLI argument should not work
      grunt.option('email', 'fake email value');
      grunt.option('unusedVariable', 'unused value');
      grunt.option('incorrectVariable', 'jonh@doe.com');

      test.doesNotThrow(function () {
        produce = new ProduceModule(grunt);
      });
      test.doesNotThrow(function () {
        produce.setup(_options);
      });

      test.strictEqual(produce.promptUser, false,
          'produce.promptUser should set to false');
      test.strictEqual(produce.locals.variables.name, 'Test1',
          'produce.locals.variables.name should be equal to passed argument');
      test.strictEqual(produce.locals.variables.description, 'Default description',
          'produce.locals.variables.description should be default');
      test.notStrictEqual(produce.locals.variables.email, 'fake email value',
          'produce.locals.variables.email should not be "fake email value"');
      test.doesNotThrow(function () {
        produce.saveFile();
      });
      test.ok(grunt.file.exists('tmp/Test1.txt'), 'Output file should be created');
      template = 'Test1\nDefault description\n'+gitUsername+'\n'+gitEmail+'\n';
      fileLines = grunt.file.read('tmp/Test1.txt');
      test.equal(fileLines, template, 'Output file should be equal to: ' + template);

      // change variable values to test blocking overwriting of files
      produce.locals.variables.description = 'Fake description';
      test.throws(function () {
        produce.saveFile();
      });

      test.ok(grunt.file.exists('tmp/Test1.txt'), 'Output file should be created');
      fileLines = grunt.file.read('tmp/Test1.txt');
      // file should remain the same
      test.equal(fileLines, template, 'Output file should be equal to: ' + template);
    }

    /**
     * Tests:
     * fileOverwrite warning
     * outputFile as string with variable
     *
     * Output file should be the same as from first pass
     *
     * @param test
     * @param grunt
     */
    function secondPass(test, grunt) {
      var template,
          fileLines,
          _options = {
            templateFile: 'test/test_template.yml',
            outputFile: 'tmp/<%= variables.name %>.txt',
            fileOverwrite: 'warning'
          };

      grunt.option('name', 'Test1');

      test.doesNotThrow(function () {
        produce = new ProduceModule(grunt);
      });
      test.doesNotThrow(function () {
        produce.setup(_options);
      });
      test.doesNotThrow(function () {
        produce.saveFile();
      });
      test.ok(grunt.file.exists('tmp/Test1.txt'), 'Output file should be created');

      template = 'Test1\nDefault description\n'+gitUsername+'\n'+gitEmail+'\n';
      fileLines = grunt.file.read('tmp/Test1.txt');

      test.equal(fileLines, template, 'Output file should be equal to: ' + template);
    }

    /**
     * Tests:
     * Required variable
     *
     * @param test
     * @param grunt
     */
    function thirdPass(test, grunt) {
      var _options = {
            templateFile: 'test/test_template.yml',
            outputFile: 'tmp/<%= variables.name %>.txt',
            fileOverwrite: 'warning'
          };

      grunt.option('name', 'Test2');
      grunt.option('unusedVariable', null);

      test.doesNotThrow(function () {
        produce = new ProduceModule(grunt);
      });
      test.doesNotThrow(function () {
        produce.setup(_options);
      });
      test.throws(function () {
        produce.saveFile();
      }, 'Variable [unusedVariable] is required');
      test.ok(!grunt.file.exists('tmp/Test2.txt'),
          'Output file should not be created');
    }

    /**
     * Tests:
     * Validator
     *
     * @param test
     * @param grunt
     */
    function fourthPass(test, grunt) {
      var _options = {
        templateFile: 'test/test_template.yml',
        outputFile: 'tmp/<%= variables.name %>.txt',
        fileOverwrite: 'warning'
      };

      grunt.option('name', 'Test2');
      grunt.option('unusedVariable', 'unused value');
      grunt.option('incorrectVariable', 'jonhATdoe.com');

      test.doesNotThrow(function () {
        produce = new ProduceModule(grunt);
      });
      test.doesNotThrow(function () {
        produce.setup(_options);
      });
      test.throws(function () {
        produce.saveFile();
      }, 'incorrectVariable value is incorrect');
      test.ok(!grunt.file.exists('tmp/Test2.txt'),
          'Output file should not be created');
    }

    /*
    * Run tests
    * */

    test.expect(26);
    test.deepEqual(typeof actual, 'function', 'Should export a function');

    firstPass(test, grunt);
    secondPass(test, grunt);
    thirdPass(test, grunt);
    fourthPass(test, grunt);

    test.done();
  }
};
