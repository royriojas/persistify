[![NPM Version](http://img.shields.io/npm/v/persistify.svg?style=flat)](https://npmjs.org/package/persistify)

# persistify
`persistify` is a wrapper over watchify and browserify to make it easy to make incremental builds without having to rely on the `watch` mode for scenarios where a watch mode is not available. It reduces the build time from several seconds to milliseconds, without relying on a watch mode :)

## Motivation
Just wanted to have a good wrapper over browserify/watchify that allow me to make incremental builds even when not using the watch mode.

**DISCLAIMER**: this is done persisting the watchify arguments to disk using the [flat-cache](https://npmjs.org/package/flat-cache) and [file-entry-cache](https://npmjs.org/package/file-entry-cache) modules. The best results happen when only a few files were modified. Worse case scenario is when all the files are modified. In average you should experience a very noticeable reduction. As always keep in mind that your mileage may vary.

## TODO

Add unit tests

## Install

```bash
npm i -g persistify
```

## CLI options

Apart from all the browserify and watchify options the following are also available:

```bash
Standard Options:

  --outfile=FILE, -o FILE

    This option is required. Write the browserify bundle to this file. If
    the file contains the operators `|` or `>`, it will be treated as a
    shell command, and the output will be piped to it (not available on
    Windows).

  --verbose, -v                    [default: false]

    Show when a file was written and how long the bundling took (in
    seconds).

  --version

    Show the persistify, watchify and browserify versions with their module paths.

  --watch                          [default: false]

    if true will use watchify instead of browserify

  --recreate                       [default: false]

    if set will recreate the cache. Useful when transforms and cached files refuse to cooperate

  --never-cache, -n                [default: null]

    a string that will be converted to a regula expression. If a file matches the returned regExp
    will never be saved in the cache. Even if the file is in the cache already it will be ignored.

    More than one pattern to be ignored can be specified by repeating this option with other regex
    value to ignore

  --cache-id                       [default: null]

    If you're running multiple persistify instances from the same directory, use this to
    differentiate them.

  --cache-dir                      [default: node_modules/flat-cache/.cache]

    By default, the cache is saved to the default directory that flat-cache sets. This sets a custom directory for the cache files.

```

## Examples

```bash
# this will browserify src/foo.js and move it to dist/foo.js
# the cache is constructed the first time the command is run so this might take a few
# seconds depending on the complexity of the files you want to browserify
persistify src/foo.js -o dist/foo.js

# next builds will be benefited by the cache
# noticeable reducing the building time
persistify src/foo.js -o dist/foo.js

# reconstruct the cache, this useful when a transform file has changed or
# the cache just started to behave like a spoiled child
persistify src/foo.js -o dist/foo.js --recreate

# this will use the cache and watchify to provide faster startup times on watch mode
persistify src/foo.js -o dist/foo.js --watch

# this will just use the cache and use a transform
# (all the parameters are just passed to browserify
# so it should work with any transform)
persistify src/foo.js -t babelify -o dist/foo.js --watch

# this will just use the cache and use two transforms
# but will never add to the cache any files that match the `m.less` extension
# since those files can also require files and those files won't be cached
# this is the safer way to prevent those changes to be skipped because of the cache
persistify src/foo.js -t babelify -t simpless -o dist/foo.js -n '\.less$'
```

## As a node module

```javascript
var persistify = require( 'persistify' );

var b = persistify( {
  //browserify options here. e.g
  // debug: true
  }, { watch: true } );

b.add( './demo/dep1.js' );

b.on( 'bundle:done', function ( time ) {
  console.log( 'time', time );
} );

b.on( 'error', function ( err ) {
  console.log( 'error', err );
} );

function doBundle() {
  b.bundle( function ( err, buff ) {
    if ( err ) {
      throw err;
    }
    require( 'fs' ).writeFileSync( './dist/bundle.js', buff.toString() );
  } );

}

doBundle();

b.on( 'update', function () {
  doBundle();
} );

```

## FAQ

### My less files are not detected as changed when using a transformation like `lessify`. Why?

Because those files are not loaded thru browserify so the cache will ignore them. use `-n, --never-cache` to specify certain files (or file types) to never be cached.

**Example: Using the cli**

```bash
# the following will exclude files ending in `.less` from being kept in the cache
persistify src/foo.js -t lessify -o dist/foo.js -n '\.less$'
```

**Example: Using the node api**
```javascript
var persistify = require( 'persistify' );

var b = persistify( {
  //browserify options here. e.g
  // debug: true
  }, {
    neverCache: [/\.less$/] // using the node api
  } );

b.add( './demo/dep1.js' );

// when a file is ignored from the cache
// a skip:cache event is fired on the bundle instance
b.on('skip:cache', function (file) {
  console.log( 'skipping the cache for', file);
});

b.on( 'error', function ( err ) {
  console.log( 'error', err );
} );

function doBundle() {
  b.bundle( function ( err, buff ) {
    if ( err ) {
      throw err;
    }
    require( 'fs' ).writeFileSync( './dist/bundle.js', buff.toString() );
  } );
}

doBundle();
```

### My build does not include the latest changes to my files! not detecting changed files?

Mmm... that's weird, but the option `--recreate` should destroy the cache and create it again which most of the times should fix your issue.

### I have added a new transform and the build is not using its magic!

~Since persistify will only work on the files that have changed, and adding a transform
does not cause a file change it is better to just use `--recreate` after adding a new trasform or plugin~

Latest version of `persistify` will ignore the cache if the command used to execute it changes.

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
