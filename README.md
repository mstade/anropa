anrop
=====

Turn any object into an event dispatcher.

Usage
-----

```javascript
var source = { toString: function() { return 'Emitter' } }
  , emit   = require('anrop').mixin(source).emit

source.on('data', function(msg) {
  console.log(this + ' says ' + msg)
})

emit('data', 'hello, world!')
```