#!/usr/bin/env node

var fs = require( 'fs' );
var path = require( 'path' );
var outpipe = require( 'outpipe' );

function run() {
  var watch = process.argv.indexOf( '--watch' ) > -1;
  var w = require( '../' )( null, {
    // TODO: use minimist
    watch: watch,
    recreate: process.argv.indexOf( '--recreate' ) > -1
  }, process.argv.slice( 2 ) );

  var outfile = w.argv.o || w.argv.outfile;
  var verbose = w.argv.v || w.argv.verbose;

  if ( w.argv.version ) {
    console.error( 'persistify v' + require( '../package.json' ).version +
        ' (in ' + path.resolve( __dirname, '..' ) + ')'
    );
    console.error( 'watchify v' + require( 'watchify/package.json' ).version +
        ' (in ' + path.dirname( require.resolve( 'watchify' ) ) + ')'
    );
    console.error( 'browserify v' + require( 'browserify/package.json' ).version +
        ' (in ' + path.dirname( require.resolve( 'browserify' ) ) + ')'
    );
    return;
  }

  if ( !outfile ) {
    console.error( 'You MUST specify an outfile with -o.' );
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

  function bundle() {
    var didError = false;
    var outStream = process.platform === 'win32'
      ? fs.createWriteStream( outfile )
      : outpipe( outfile );

    var wb = w.bundle();
    wb.on( 'error', function ( err ) {
      console.error( String( err ) );
      didError = true;
      outStream.end( 'console.error(' + JSON.stringify( String( err ) ) + ');' );
    } );
    wb.pipe( outStream );

    outStream.on( 'error', function ( err ) {
      console.error( err );
    } );
    outStream.on( 'close', function () {
      if ( verbose && !didError ) {
        if ( watch ) {
          console.error( bytes + ' bytes written to ' + outfile
              + ' (' + (time / 1000).toFixed( 2 ) + ' seconds)'
          );
        } else {
          console.error( 'bundle done! '
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
