anropa
======

Turn any object into an event dispatcher.

Usage
-----

```javascript
var source = { toString: function() { return 'Emitter' } }
  , emit   = require('anropa').mixin(source).emit

source.on('data', function(msg) {
  console.log(this + ' says ' + msg)
})

emit('data', 'hello, world!')
```

Status
------

[![Build Status](https://travis-ci.org/mstade/anropa.png?branch=master)](https://travis-ci.org/mstade/anropa)
[![Coverage Status](https://coveralls.io/repos/mstade/anropa/badge.png)](https://coveralls.io/r/mstade/anropa)