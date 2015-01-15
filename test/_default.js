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
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    load: function (test) {

        test.expect(12);

        grunt.option('name', 'Test1');
        grunt.option('email', 'john@example.com');

        var actual = require('../tasks/produce'),
            ProduceModule = require('../lib/ProduceModule.js'),
            produce = null;

        test.deepEqual(typeof actual, 'function', 'Should export a function');

        var _options = {
            templateFile : 'test/test_template.yml'
        };

        test.doesNotThrow(function(){
            produce = new ProduceModule(grunt);
        });

        test.doesNotThrow(function(){
            produce.setup(_options);
        });

        var gitUsername = produce._getGitConfig('user.name') || '';

        test.strictEqual(produce.promptUser, false,
            'produce.promptUser should set to false');

        test.strictEqual(produce.locals.username, gitUsername,
            'produce.locals.username should be equal to git config');
        test.strictEqual(produce.locals.email, 'john@example.com',
            'produce.locals.email should be equal to passed argument');
        test.strictEqual(produce.locals.name, 'Test1',
            'produce.locals.name should be equal to passed argument');
        test.strictEqual(produce.locals.description, 'Default description',
            'produce.locals.description should be default');

        test.doesNotThrow(function(){
            produce.saveFile();
        });

        test.ok(grunt.file.exists('tmp/Test1.txt'));
        var template = gitUsername +
                '\njohn@example.com\nTest1\nDefault description\n',
            fileLines = grunt.file.read('tmp/Test1.txt');

        test.equal(fileLines, template);

        test.throws(function(){
            produce.saveFile();
        });


        test.done();
    }
};
