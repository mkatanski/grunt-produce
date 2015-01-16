/*
 * ProduceModule
 * https://github.com/mkatanski/grunt-produce
 *
 * Copyright (c) 2015 Michał Katański
 * Licensed under the MIT license.
 */

var Git = (function () {
  'use strict';

  var shell = require('shelljs');

  function Git() { }

  /**
   * Get Git username
   *
   * @returns {string} username
   */
  Git.prototype.getUsername = function() {
    return this.getGitConfig('user.name');
  };

  /**
   * Get Git email
   *
   * @returns {string} email
   */
  Git.prototype.getEmail = function() {
    return this.getGitConfig('user.email');
  };

  /**
   * Get git config
   *
   * @param configName {string} git config name
   * @returns {string} Git config value
   * @private
   */
  Git.prototype.getGitConfig = function (configName) {
    return shell.exec('git config ' + configName,
        {silent: true}).output.replace('\n', '').trim();
  };

  return Git;
}());

module.exports = Git;
