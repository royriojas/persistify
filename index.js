var through = require( 'through2' );
var watchify = require( 'watchify' );
var trim = require( 'jq-trim' );

module.exports = function ( browserifyOpts, opts, argv ) {
  browserifyOpts = browserifyOpts || { };
  opts = opts || { };
  var hash = require( 'hash-string' );

  var xtend = require( 'xtend' );

  var id = 'persistify_' + hash( process.cwd() + trim( opts.cacheId ) );
  var depsCacheId = 'deps-cx-' + id;

  var flatCache = require( 'flat-cache' );
  var fileEntryCache = require( 'file-entry-cache' );

  if ( opts.recreate ) {
    flatCache.clearCacheById( id );
    flatCache.clearCacheById( depsCacheId );
  }
  // load the cache with id
  var cache = flatCache.load( id );

  // load the file entry cache with id, or create a new
  // one if the previous one doesn't exist
  var depsCacheFile = fileEntryCache.create( depsCacheId );

  var persistifyCache = cache.getKey( 'persistifyArgs' ) || {
      cache: {}, packageCache: {}
    };

  //var browserify = require( 'browserify' );

  browserifyOpts.cache = persistifyCache.cache;
  browserifyOpts.packageCache = persistifyCache.packageCache;
  var fromArgs = require( 'browserify/bin/args' );

  var b = argv ? fromArgs( argv, browserifyOpts ) : require( 'browserify' )( browserifyOpts );

  function normalizeCache( removeDeletedOnly ) {
    var cachedFiles = Object.keys( browserifyOpts.cache );

    var res = depsCacheFile.analyzeFiles( cachedFiles );

    var changedFiles = res.changedFiles;
    var notFoundFiles = res.notFoundFiles;

    var changedOrNotFound = removeDeletedOnly ? notFoundFiles : changedFiles.concat( notFoundFiles );

    if ( changedOrNotFound.length > 0 ) {
      changedOrNotFound.forEach( function ( file ) {
        delete browserifyOpts.cache[ file ];
      } );
    }

    cache.setKey( 'persistifyArgs', {
      cache: browserifyOpts.cache,
      packageCache: browserifyOpts.packageCache
    } );
  }

  normalizeCache();

  function collect() {
    b.pipeline.get( 'deps' ).push( through.obj( function ( row, enc, next ) {
      var file = row.expose ? b._expose[ row.id ] : row.file;
      persistifyCache.cache[ file ] = {
        source: row.source,
        deps: xtend( { }, row.deps )
      };
      this.push( row );
      next();
    } ) );
  }

  if ( opts.watch ) {
    b = watchify( b );
  } else {
    collect();
    b.on( 'reset', collect );
  }

  var oldBundle = b.bundle;
  b.bundle = function () {
    var start = Date.now();
    var stream;
    try {
      stream = oldBundle.apply( b, arguments );
      stream.on( 'error', function ( err ) {
        console.error( err );
      } );
      stream.on( 'end', function () {
        setTimeout( function () {
          normalizeCache( true /* remove deleted only*/ );
          depsCacheFile.reconcile();
          cache.save();
        }, 0 );

        var end = Date.now() - start;
        b.emit( 'bundle:done', end );
      } );
    } catch (ex) {
      console.error( ex );
    }

    return stream;
  };

  return b;
};
