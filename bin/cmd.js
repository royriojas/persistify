#!/usr/bin/env node

var fs = require( 'fs' );
var path = require( 'path' );
var outpipe = require( 'outpipe' );
var subarg = require( 'subarg' );

var nodeConsole = console;

function run() {
  var _argv = process.argv.slice( 2 );
  var persistifyArgs = subarg( _argv, {
    alias: {
      'n': 'never-cache',
      'd': 'cache-dir'
    }
  } );

  var watch = persistifyArgs.watch;
  var recreate = persistifyArgs.recreate;
  var neverCache = persistifyArgs[ 'never-cache' ];
  var cacheId = persistifyArgs[ 'cache-id' ];
  var cacheDir = persistifyArgs[ 'cache-dir' ];

  var w = require( '../' )( null, {
    cacheId: cacheId,
    cacheDir: cacheDir,
    command: _argv.join( ' ' ),
    neverCache: neverCache,
    watch: watch,
    recreate: recreate
  }, process.argv.slice( 2 ) );

  var outfile = w.argv.o || w.argv.outfile;
  var verbose = w.argv.v || w.argv.verbose;

  if ( w.argv.version ) {
    nodeConsole.error( 'persistify v' + require( '../package.json' ).version +
        ' (in ' + path.resolve( __dirname, '..' ) + ')'
    );
    nodeConsole.error( 'watchify v' + require( 'watchify/package.json' ).version +
        ' (in ' + path.dirname( require.resolve( 'watchify' ) ) + ')'
    );
    nodeConsole.error( 'browserify v' + require( 'browserify/package.json' ).version +
        ' (in ' + path.dirname( require.resolve( 'browserify' ) ) + ')'
    );
    return;
  }

  if ( !outfile ) {
    nodeConsole.error( 'You MUST specify an outfile with -o.' );
    process.exit( 1 ); //eslint-disable-line
  }

  var bytes, time;
  if ( watch ) {
    w.on( 'bytes', function ( b ) {
      bytes = b;
    } );
    w.on( 'time', function ( t ) {
      time = t;
    } );
  } else {
    w.on( 'bundle:done', function ( t ) {
      time = t;
    } );
  }

  w.on( 'skip:cache', function ( file ) {
    if ( !verbose ) {
      return;
    }
    nodeConsole.error( 'skip file from cache:', file );
  } );

  function bundle() {
    var didError = false;
    var outStream = process.platform === 'win32'
      ? fs.createWriteStream( outfile )
      : outpipe( outfile );

    var wb = w.bundle();
    wb.on( 'error', function ( err ) {
      nodeConsole.error( String( err ) );
      didError = true;
      outStream.end( 'console.error(' + JSON.stringify( String( err ) ) + ');' );
    } );
    wb.pipe( outStream );

    outStream.on( 'error', function ( err ) {
      nodeConsole.error( 'persistify error: ', err );
    } );
    outStream.on( 'close', function () {
      if ( didError && !watch ) {
        nodeConsole.error( 'persistify failed...' );
        process.exit( 1 ); //eslint-disable-line
      }
      if ( verbose && !didError ) {
        if ( watch ) {
          nodeConsole.error( bytes + ' bytes written to ' + outfile
              + ' (' + (time / 1000).toFixed( 2 ) + ' seconds)'
          );
        } else {
          nodeConsole.error( 'bundle done! '
              + ' (' + (time / 1000).toFixed( 2 ) + ' seconds)'
          );
        }
      }

    } );
  }

  w.on( 'update', bundle );
  bundle();
}

run();
