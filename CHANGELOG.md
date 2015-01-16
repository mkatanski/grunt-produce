<a name="0.3.0"></a>
## 0.3.0 (2015-01-16)


#### Bug Fixes

* **app:** Remove displaying possible variables per target ([b61f97e7](http://github.com/mkatanski/grunt-produce/commit/b61f97e76db566c60760e4a74165e45fa89232e7))


#### Features

* **app:**
  * Templates variables value can be functions ([8a6f2119](http://github.com/mkatanski/grunt-produce/commit/8a6f2119c46b2123a42350b357964fdadd8f0f23))
  * Change template engine to _underscore ([8013325e](http://github.com/mkatanski/grunt-produce/commit/8013325e795d325c8b189ad56f173bece98c0c24))
  * Templates are now YAML files ([1ad0b249](http://github.com/mkatanski/grunt-produce/commit/1ad0b249a224b9dd214a62dd69f9a7bfa2f34a34))
  * Add validate functions to each variable and required option ([f275c6cd](http://github.com/mkatanski/grunt-produce/commit/f275c6cd3d3897b26bba10e104bb7a07ed724ad5))
  * Variables are now objects ([29917f15](http://github.com/mkatanski/grunt-produce/commit/29917f15e87cac7e23fe72c0d128a0e9dbba1ff3))


#### Breaking Changes

* Templates variable 'default' parameter are changed to 'value' and can be string or function
 ([8a6f2119](http://github.com/mkatanski/grunt-produce/commit/8a6f2119c46b2123a42350b357964fdadd8f0f23))
* Printing variables in template has to met _underscore specification
 ([8013325e](http://github.com/mkatanski/grunt-produce/commit/8013325e795d325c8b189ad56f173bece98c0c24))
* Templates variables and settings are defined in YAML files.
 ([1ad0b249](http://github.com/mkatanski/grunt-produce/commit/1ad0b249a224b9dd214a62dd69f9a7bfa2f34a34))


<a name="0.2.0"></a>
## 0.2.0 (2015-01-14)


#### Features

* **app:**
  * Change template engine to _underscore ([8013325e](http://github.com/mkatanski/grunt-produce/commit/8013325e795d325c8b189ad56f173bece98c0c24))
  * Templates are now YAML files ([1ad0b249](http://github.com/mkatanski/grunt-produce/commit/1ad0b249a224b9dd214a62dd69f9a7bfa2f34a34))
  * Add validate functions to each variable and required option ([f275c6cd](http://github.com/mkatanski/grunt-produce/commit/f275c6cd3d3897b26bba10e104bb7a07ed724ad5))
  * Variables are now objects ([29917f15](http://github.com/mkatanski/grunt-produce/commit/29917f15e87cac7e23fe72c0d128a0e9dbba1ff3))


#### Breaking Changes

* Printing variables in template has to met _underscore specification
 ([8013325e](http://github.com/mkatanski/grunt-produce/commit/8013325e795d325c8b189ad56f173bece98c0c24))
* Templates variables and settings are defined in YAML files.
 ([1ad0b249](http://github.com/mkatanski/grunt-produce/commit/1ad0b249a224b9dd214a62dd69f9a7bfa2f34a34))


<a name="0.2.0"></a>
## 0.2.0 (2015-01-12)


#### Bug Fixes

* **app:**
  * Default variables can be overwrite by arguments without defining them in gruntfi ([9b850b0b](http://github.com/mkatanski/grunt-produce/commit/9b850b0b7f4445f9783d1d00f218d06cca44385d))
  * Better error handling ([bf66961b](http://github.com/mkatanski/grunt-produce/commit/bf66961b57baad5eb1c00b80965338ee4d156b69))
* **test:** Better tests ([19a63100](http://github.com/mkatanski/grunt-produce/commit/19a631005d640a91ec8d900ecdf55e0b40a3dd23))


#### Features

* **app:**
  * Display possible targets to run with list of their variables ([3b976ab1](http://github.com/mkatanski/grunt-produce/commit/3b976ab123f6e1eeb0e96ff6c6ecfa2a44f4dbe2))
  * Template can be now file path or string in config ([5895f8c2](http://github.com/mkatanski/grunt-produce/commit/5895f8c2615f2af4c2dee3d0541af3260769fce0))
  * Add warning about non existing variables ([2f69b748](http://github.com/mkatanski/grunt-produce/commit/2f69b748b9d001e1f357559befedd2e954312274))
  * Add option to overwrite existing files ([5f1186af](http://github.com/mkatanski/grunt-produce/commit/5f1186af760e8b771e07555264d703c1b925f4ce))


<a name="0.1.2"></a>
### 0.1.2 (2015-01-10)


#### Features

* **app:** Add basic tests ([2941eace](http://github.com/mkatanski/grunt-produce/commit/2941eacea44e80698ac53435ee2ad3cdae0f7f8c))
* **grunt:**
  * add grunt-bump plugin ([a2600e4c](http://github.com/mkatanski/grunt-produce/commit/a2600e4cfc07c2877d4e32551907fc0be779980c))
  * add grunt-conventional-changelog plugin ([a97337bd](http://github.com/mkatanski/grunt-produce/commit/a97337bd145110e4f9016b6b334d4322a6b2d0b8))



<a name="0.1.1"></a>
### 0.1.1 (2015-01-06)
First release