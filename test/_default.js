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

    test.expect(9);

    grunt.option('name', 'Test1');


    var actual = require('../tasks/produce'),
        ProduceModule = require('../lib/ProduceModule.js'),
        Git = require('../lib/Git.js'),
        produce = null,
        _options = {
          templateFile: 'test/test_template.yml',
          outputFile: function (locals) {
            return 'tmp/' + locals.variables.name + '.txt';
          },
          fileOverwrite: 'block'

        };

    Git = new Git();

    test.deepEqual(typeof actual, 'function', 'Should export a function');

    test.doesNotThrow(function () {
      produce = new ProduceModule(grunt);
    });

    test.doesNotThrow(function () {
      produce.setup(_options);
    });

    test.strictEqual(produce.promptUser, false,
        'produce.promptUser should set to false');

    test.strictEqual(produce.locals.variables.name, 'Test1',
        'produce.locals.name should be equal to passed argument');
    test.strictEqual(produce.locals.variables.description, 'Default description',
        'produce.locals.description should be default');

    test.doesNotThrow(function () {
      produce.saveFile();
    });

    test.ok(grunt.file.exists('tmp/Test1.txt'));
    var template = 'Test1\nDefault description\n',
        fileLines = grunt.file.read('tmp/Test1.txt');

    //test.equal(fileLines, template);

    test.throws(function () {
      produce.saveFile();
    });


    test.done();
  }
};
