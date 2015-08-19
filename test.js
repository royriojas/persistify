var persistify = require( './' );

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
