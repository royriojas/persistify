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
```

## as a node module

```javascript
var persistify = require( 'persistify' );

var b = persistify( { }, { watch: true } );

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

### your build does not include the latest changes to your files.

Mmm... that's weird, but the option `--recreate` should destroy the cache and create it again

### I have added a new transform and the build is not using its

Since persistify will only work on the files that have changed, and adding a transform
does not cause a file change it is better to just use `--recreate` after adding a new trasform or plugin

## Changelog

[Changelog](./changelog.md)

## License

[MIT](./LICENSE)
