# grunt-produce ![dev-version](https://img.shields.io/badge/version-beta-orange.svg?style=flat)
 [![Build Status](https://travis-ci.org/mkatanski/grunt-produce.svg)](https://travis-ci.org/mkatanski/grunt-produce) [![Codacy Badge](https://www.codacy.com/project/badge/32070d6b49da413bb52956347320baca)](https://www.codacy.com/public/mkatanski/grunt-produce) [![Dependency Status](https://gemnasium.com/mkatanski/grunt-produce.svg)](https://gemnasium.com/mkatanski/grunt-produce) [![Coverage Status](https://coveralls.io/repos/mkatanski/grunt-produce/badge.svg)](https://coveralls.io/r/mkatanski/grunt-produce) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/mkatanski/grunt-produce/master/LICENSE-MIT)

> Automating the process of creating project files.

This module will help you use the Grunt CLI as a tool to create project files from templates. Especially it is handy when your project is made up of multiple source files on a recurring scheme (eg. MVC applications).

After the implementation of the module to the project, the final effect should be like a Artisan tool from Laravel Framework. Although it depends on you how files will be created and what will they contain.

## Table of content

1. [Getting Started](#GettingStarted)
2. [The "produce" task](#Task)
	- [Overview](#Overview)
	- [Options](#Options)
3. [Templates](#Templates)
4. [Contributing](#Contributing)
	- [Commit Message Format](#MessageFormat) 
5. [Changelog](#Changelog)

## <a name="GettingStarted"></a> Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-produce --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-produce');
```

## <a name="Task"></a> The "produce" task

### <a name="Overview"></a> Overview
In your project's Gruntfile, add a section named `produce` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  produce: {
    target_name: {
        options: {
          // options
        }
     },
  },
});
```

This will allow you to use grunt cli to run this task for selected target. Name of the target is up to you however it should be short and unique.

For above example to run `target_name` type in console/terminal:

```shell
grunt produce:target_name
```

After doing this you should be prompted for all possible variables values. There is also possibility to pass variables values directly using flags. For more information about passing variable value go to variables section of this document.

**Note:** You can't run `grunt produce` task without providing a target name.

### <a name="Options"></a> Options

#### options.templateFile
Type: `String`
Default value: `''`
*Required*

Path to YAML template file for current target. For more information about templates and its usage go to project's [wiki](https://github.com/mkatanski/grunt-produce/wiki).

----------

#### options.outputFile
Type: `String` or `Function`
Default value: `''`
*Required*

Path to destination file. You can use variables in a string to customize destination path and/or file name each time you run this target. Remember that variables must be declared in YAML template file first.

For more advanced usage you can use function instead of string. Function must return a string with valid file path. Function takes one argument with object containing all available variables. For more information about variables and its usage go to project's [wiki](https://github.com/mkatanski/grunt-produce/wiki).

For example:
```js
fileName: function(locals) {
	return 'app/' + locals.variables.name + '.js';
},

```

----------

#### options.fileOverwrite
Type: `String`
Default value: `block`

Possible values: `block` or `warning`

If this variable is set to `block`, the module will throw an error when destination file exists. If this option is set to `warning`, it will overwrite destination file and display warning message instead of throwing an error.


----------


## <a name="Templates"></a> Templates

Templates are special files written in YAML which do most of the "Produce" target logic. More information about templates and how to create one is in project's [wiki](https://github.com/mkatanski/grunt-produce/wiki).




## <a name="Contributing"></a> Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

If you want to create new feature or fix bug, do following steps

- Create fork of grunt-produce repository
- Create new branch
- Submit a PR (Do not use `grunt release` command)

Also there is important that:

- When submitting an issue, please make sure the plugin is up-to-date, and provide the command(s) and/or configurations that cause the issue.
- When submitting a PR, make sure that the commit message matches the [AngularJS conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y) (see below).
- When submitting a new feature, add tests that cover the feature.

### <a name="MessageFormat"></a> Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
Any line of the commit message cannot be longer than 80 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

####Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)
- **refactor**: A code change that neither fixes a bug or adds a feature
- **test**: Adding missing tests
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope

The scope could be anything specifying place of the commit change. For example app, gen, docs, gen:view, gen:route, gen:service, etc.

####Subject

The subject contains succinct description of the change:

use the imperative, present tense: "change" not "changed" nor "changes"
don't capitalize first letter
no dot (.) at the end
Body

Just as in the subject, use the imperative, present tense: "change" not "changed" nor "changes". The body should include the motivation for the change and contrast this with previous behavior.

####Footer

The footer should contain any information about Breaking Changes and is also the place to reference GitHub issues that this commit Closes.

A detailed explanation can be found in this [document](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit).

## <a name="Changelog"></a> Changelog
Go to [CHANGELOG.md](CHANGELOG.md)
