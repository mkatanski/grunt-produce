# grunt-produce

> Automating the process of creating project files.

This module will help you use the Grunt CLI as a tool to create project files from templates. Especially it is handy when your project is made up of multiple source files on a recurring scheme (eg. MVC applications).

After the implementation of the module to the project, the final effect should be like a Artisan tool from Laravel Framework. Although it depends on you how files will be created and what will they contain.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-produce--save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-produce');
```

## The "produce" task

### Overview
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

### Options

#### options.template 
Type: `String`
Default value: `''`
*Required*

Path to template file for current target. You can use variables in template. For more information about variables and its usage go to variables section of this document.

If the path doesn't exists, module will take this option as a template.

----------

#### options.fileName
Type: `String` or `Function`
Default value: `{{name}}.ts`
*Required*

Path to destination file. You can use variables in a string to customize destination path and/or file name each time you run this target. Remember that variables must be declared in `options.parameters` first.

For more advanced usage you can use function instead of string. Function must return a string with valid file path. Function takes one argument with object containing all available variables. For more information about variables and its usage go to variables section of this document.

For example:
```js
fileName: function(vars) {
	return 'app/' + vars.name + '.js';
},

```

----------

#### options.fileOverwrite
Type: `String`
Default value: `block`

Possible values: `block` or `warning`

If this variable is set to `block`, the module will throw an error when destination file exists. If this option is set to `warning`, it will overwrite destination file and display warning message.


----------

#### options.variables
Type: `Object`
Default value: `{name: 'MyFile'}`

Object containing custom variables than can be passed into module while creating new file from template. 

Each object item contains variable name and its default value, ie:
```js
options.variables: {
	my_var: 'val'
}
```
where `my_var` is custom variable name and `'val'` is its default value which will be used if this variable will be omitted.

Those variables can be used in template file or in destination file path. For more information go to variables section of this document.

### Variables

You can use variables to modify template file and/or destination file name. Except default variables, each new has to be defined first in `options.parameters` array. To use variable place it within double brackets tag anywhere in your template file or destination file path, ie.:

`{{variable_name}}`

#### Passing data to variables

By default, running
```shell
grunt produce:target
```

grunt will prompt for all defined variables including default ones. This grunt plugin is using `inquire` module to do prompts. Reffering to its documentation it should well support following OS terminals:

 - Mac OS: 
	 - Terminal.app 
	 - iTerm 
 - Windows: 
	 - cmd.exe 
	 - Powershell 
	 - Cygwin 
 - Ubuntu:
	 - Terminal

If you prefer you can pass variables data directly using flags. This way prompting will be omitted, however variables that will not get their data will use default one defined in Gruntfile.

To pass value to defined variable directly while running `grunt produce:target` task use following format:
```shell
grunt produce:target --variable_name="variable value"
```

This way you can pass value to multiple variables, ie:
```shell
--var1=value1 --var2=value2
```

#### Default variables

There are two default variables: `username` and `email`

By default, module will try to get username and user email from git config and store its values in default variables. Usage of default variables are the same as any other defined by you.

### Usage Example

In this example, there is a `jqplugin` target defined. Its purpose is creating new jQuery plugin from template using few custom variables and default ones for author name and author e-mail. It is assumed that git is installed on system and git `user.name` and `user.email` are set to:
```
user.name = John Doe
user.email = jdoe@example.com
```

#### Inside grunt config

```js
grunt.initConfig({
  produce: {
    jqplugin: {
        options: {
          template: 'templates/jq_plugin.tpl',
          variables:   {
              name: 'MyPlugin',
              description: 'Default description'
          },
          fileName: 'scripts/{{name}}.coffee'
        }
     },
  },
});
```

#### Inside jq_plugin.tpl

```coffee
#
# {{description}}
#
# @author   {{username}} ({{email}})
do ($ = jQuery, window, document) ->

	# Create the defaults once
	pluginName = "{{name}}"
	defaults =
		property: "value"

	# The actual plugin constructor
	class Plugin
		constructor: (@element, options) ->
			@settings = $.extend {}, defaults, options
			@_defaults = defaults
			@_name = pluginName
			@init()

		init: ->
			# Place initialization logic here
			console.log "xD"
			
		yourOtherFunction: ->
			# some logic

	$.fn[pluginName] = (options) ->
		@each ->
			unless $.data @, "plugin_#{pluginName}"
				$.data @, "plugin_#{pluginName}", new Plugin @, options
```

#### Running

To create new plugin type in console/terminal:

```shell
grunt produce:jqplugin --name=BestPluginEver --description="This is my best plugin"
```

After executing above command, there should be new file:
`scripts/BestPluginEver.coffee`

with content of `templates/jq_plugin.tpl` and variables changed to

```coffee
#
# This is my best plugin
#
# @author   John Doe (jdoe@example.com)
do ($ = jQuery, window, document) ->

	# Create the defaults once
	pluginName = "BestPluginEver"
...
```

You can also override default variables:
```shell
grunt produce:jqplugin --name=BestPluginEver --description="A Plugin" --username="Bugs Bunny" --email=bbunny@example.com
```

in this case output file will contain:

```coffee
#
# A Plugin
#
# @author   Bugs Bunny (bbunny@example.com)
do ($ = jQuery, window, document) ->

	# Create the defaults once
	pluginName = "BestPluginEver"
...
```


## Contributing
In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality.

If you want to create new feature or fix bug, do following steps

- Create fork of grunt-produce repository
- Create new branch
- Submit a PR (Do not use `grunt release` command)

Also there is important that:

- When submitting an issue, please make sure the plugin is up-to-date, and provide the command(s) and/or configurations that cause the issue.
- When submitting a PR, make sure that the commit message matches the [AngularJS conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y) (see below).
- When submitting a bugfix, write a test that exposes the bug and fails before applying your fix. Submit the test alongside the fix.
- When submitting a new feature, add tests that cover the feature.

###Commit Message Format

Each commit message consists of a header, a body and a footer. The header has a special format that includes a type, a scope and a subject:
```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```
Any line of the commit message cannot be longer than 100 characters! This allows the message to be easier to read on GitHub as well as in various git tools.

####Type

Must be one of the following:

**feat**: A new feature

**fix**: A bug fix

**docs**: Documentation only changes

**style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semicolons, etc.)

**refactor**: A code change that neither fixes a bug or adds a feature

**test**: Adding missing tests

**chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation
Scope

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

## Changelog
Go to [CHANGELOG.md](CHANGELOG.md)
