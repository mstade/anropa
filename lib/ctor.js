module.exports = dispatcher

function dispatcher(source) {
  var events = {}

  source || (source = {})

  return Object.freeze(
    { on     : on
    , off    : off
    , once   : once
    , emit   : emit
    , source : source
    }
  )

  function on(type, handler) {
    if (typeof handler !== 'function') {
      throw new Error('Handler must be a function.')
    }

    var target = events[type]

    if (target === handler) {
      return false
    }

    if (target) {
      if (Array.isArray(target)) {
        if (!~target.indexOf(handler)) {
          return target.push(handler), true
        } else {
          return false
        }
      } else {
        events[type] = [target, handler]
        return true
      }
    } else {
      events[type] = handler
      return true
    }
  }

  function off(type, handler) {
    if (arguments.length === 0) {
      events = {}
      return true
    } else if (type in events === false) {
      return false
    }

    var target = events[type]

    if (!handler || target === handler) {
      return delete events[type]
    } else {
      var index = target.indexOf(handler)

      if (~index) {
        return !!target.splice(index, 1)
      }
    }
  }

  function once(type, handler) {
    return on(type, oneoff)

    function oneoff() {
      off(type, oneoff)
      handler.apply(this, [].slice.call(arguments))
    }
  }

  function emit(type /*, ... stuff*/) {
    if (!events[type]) return

    var target = events[type]
      , args   = [].slice.call(arguments, 1)

    Array.isArray(target)
      ? target.forEach(emit)
      : emit(target)

    function emit(target) {
      target.apply(source, args)
    }
  }
}

dispatcher.mixin = function(source) {
  var ee = dispatcher(source)

  source.on  = ee.on
  source.off = ee.off

  return ee
}