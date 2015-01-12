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

        test.expect(24);

        grunt.option('name', 'Test1');

        var actual = require('../tasks/produce'),
            ProduceModule = require('../lib/ProduceModule.js'),
            produce = null;

        test.deepEqual(typeof actual, 'function', 'Should export a function');

        var _options = {
            template : 'test/template/basic_template.tpl',
            variables: {
                name       : 'DefaultTest',
                description: 'Default description'
            },
            fileName : function (vars) {
                return 'tmp/' + vars.name + '.txt';
            },
            'fileOverwrite': 'block'
        };

        test.doesNotThrow(function(){
            produce = new ProduceModule(grunt);
        });

        test.doesNotThrow(function(){
            produce.setup(_options);
        });

        var gitUsername = produce._getGitConfig('user.name') || '';
        var gitEmail = produce._getGitConfig('user.email') || '';
        var template = grunt.file.read(_options.template).split(produce.NEW_LINE);

        test.strictEqual(produce.promptUser, false, 'produce.promptUser should set to false');

        test.strictEqual(produce.template[0], template[0]);
        test.strictEqual(produce.template[1], template[1]);
        test.strictEqual(produce.template[2], template[2]);
        test.strictEqual(produce.template[3], template[3]);

        test.strictEqual(produce.variables.username, gitUsername, 'produce.variables.username should be equal to git config');
        test.strictEqual(produce.variables.email, gitEmail, 'produce.variables.email should be equal to git config');
        test.strictEqual(produce.variables.name, 'Test1', 'produce.variables.name should be equal to passed argument');
        test.strictEqual(produce.variables.description, _options.variables.description, 'produce.variables.description should be default');

        test.doesNotThrow(function(){
            produce.expandTemplate();
        });

        template[0] = gitUsername;
        template[1] = gitEmail;
        template[2] = 'Test1';
        template[3] = _options.variables.description;

        test.strictEqual(produce.template[0], template[0]);
        test.strictEqual(produce.template[1], template[1]);
        test.strictEqual(produce.template[2], template[2]);
        test.strictEqual(produce.template[3], template[3]);

        test.doesNotThrow(function(){
            produce.saveFile();
        });

        var fileLines = grunt.file.read('tmp/Test1.txt').split(produce.NEW_LINE);

        test.ok(grunt.file.exists('tmp/Test1.txt'));
        test.equal(fileLines[0], gitUsername);
        test.equal(fileLines[1], gitEmail);
        test.equal(fileLines[2], 'Test1');
        test.equal(fileLines[3], _options.variables.description);

        test.throws(function(){
            produce.saveFile();
        });


        test.done();
    }
};
