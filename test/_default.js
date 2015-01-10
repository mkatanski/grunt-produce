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
        var isWin = /^win/.test(process.platform);
        var NEW_LINE = '\n';
        if(isWin) {
            NEW_LINE = '\r\n';
        }

        test.expect(6);

        var actual = require('../tasks/produce');
        var expected = 'function';
        test.equal(typeof actual, expected, 'Should export a function');

        test.ok(grunt.file.exists('tmp/Test1.txt'));

        var template = grunt.file.read('tmp/Test1.txt').split(NEW_LINE);

        test.equal(template[0], 'John Doe', 'Should be "John Doe"');
        test.equal(template[1], 'jdoe@example.com', 'Should be "jdoe@example.com"');
        test.equal(template[2], 'Test1', 'Should be "Test1"');
        test.equal(template[3], 'Default description', 'Should be "Default description"');


        test.done();
    }
};