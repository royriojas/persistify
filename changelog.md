
# persistify - Changelog
## v1.0.0
- **Build Scripts Changes**
  - Update to latest version of browserify and watchify - [ae8b4cc]( https://github.com/royriojas/persistify/commit/ae8b4cc ), [Roy Riojas](https://github.com/Roy Riojas), 21/11/2015 23:33:37

    
## v0.3.3
- **undefined**
  - option to set cacheDir - [12ff7fa]( https://github.com/royriojas/persistify/commit/12ff7fa ), [Joey Baker](https://github.com/Joey Baker), 05/11/2015 10:53:10

    
## v0.3.2
- **Bug Fixes**
  - make persistify fail with code 1 in case of errors. Fixes [#2](https://github.com/royriojas/persistify/issues/2) - [4cc4dc4]( https://github.com/royriojas/persistify/commit/4cc4dc4 ), [royriojas](https://github.com/royriojas), 02/11/2015 08:01:26

    
- **Build Scripts Changes**
  - Add test script to verify the code - [5ff8fdf]( https://github.com/royriojas/persistify/commit/5ff8fdf ), [royriojas](https://github.com/royriojas), 02/11/2015 08:00:34

    
## v0.3.1
- **Bug Fixes**
  - proper file formatting - [2904943]( https://github.com/royriojas/persistify/commit/2904943 ), [royriojas](https://github.com/royriojas), 30/10/2015 14:42:41

    
- **Enhancements**
  - Add --cache-id command line option - [9f31426]( https://github.com/royriojas/persistify/commit/9f31426 ), [Benjie Gillam](https://github.com/Benjie Gillam), 30/10/2015 05:39:15

    
## v0.3.0
- **Enhancements**
  - add `never-cache` and `command` options - [b81307d]( https://github.com/royriojas/persistify/commit/b81307d ), [royriojas](https://github.com/royriojas), 22/09/2015 00:18:57

    - `--never-cache`, `-n` option allows to specify patterns to match
    files that will never be included in the cache. Even if the files were
    in the cache already they will be ignored if the file matches the
    provided pattern. Multiple patterns can be specified by specifying this
    parameter multiple times.
    
    - `command` option can be used to pass the cli command used to execute
    persistify. If that command changes then the cache will be also be
    ignored
    
## v0.2.0
- **Features**
  - Remove deleted entries from the cache - [56544d3]( https://github.com/royriojas/persistify/commit/56544d3 ), [royriojas](https://github.com/royriojas), 04/09/2015 13:15:51

    
## v0.1.8
- **Documentation**
  - Add info about the CLI usage - [899e311]( https://github.com/royriojas/persistify/commit/899e311 ), [royriojas](https://github.com/royriojas), 31/08/2015 18:34:05

    
## v0.1.7
- **Documentation**
  - Add a note about cache usage and a comment about the browserify options - [cfd3fe5]( https://github.com/royriojas/persistify/commit/cfd3fe5 ), [Roy Riojas](https://github.com/Roy Riojas), 31/08/2015 18:18:45

    Update README.md
    
## v0.1.6
- **Bug Fixes**
  - missing browserify dependency to be able to use it without watch mode - [2abf988]( https://github.com/royriojas/persistify/commit/2abf988 ), [Roy Riojas](https://github.com/Roy Riojas), 22/08/2015 18:51:42

    
## v0.1.5
- **Build Scripts Changes**
  - Add keywords - [c91c7f7]( https://github.com/royriojas/persistify/commit/c91c7f7 ), [royriojas](https://github.com/royriojas), 19/08/2015 06:07:20

    
## v0.1.4
- **Documentation**
  - Add FAQ - [35a487a]( https://github.com/royriojas/persistify/commit/35a487a ), [royriojas](https://github.com/royriojas), 19/08/2015 06:04:07

    
## v0.1.3
- **Documentation**
  - Fixed code blocks style - [d5d7fcb]( https://github.com/royriojas/persistify/commit/d5d7fcb ), [royriojas](https://github.com/royriojas), 19/08/2015 05:47:42

    
## v0.1.2
- **Build Scripts Changes**
  - Add keywords - [d46de42]( https://github.com/royriojas/persistify/commit/d46de42 ), [royriojas](https://github.com/royriojas), 19/08/2015 05:46:28

    
## v0.1.1
- **Features**
  - first working version - [dad17de]( https://github.com/royriojas/persistify/commit/dad17de ), [royriojas](https://github.com/royriojas), 19/08/2015 05:45:00

    
- **Other changes**
  - Initial commit - [9acf98a]( https://github.com/royriojas/persistify/commit/9acf98a ), [Roy Riojas](https://github.com/Roy Riojas), 11/07/2015 18:51:33

    
