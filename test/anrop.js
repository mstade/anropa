var expect = require('chai').expect
  , anrop  = require('..')

describe('Anrop', function() {
  describe('constructor', function() {
    it('should return a dispatcher object with sealed properties', function() {
      var ee = anrop()

      expect(ee).to.have.keys('on', 'off', 'once', 'emit', 'source')
      expect(Object.isFrozen(ee)).to.be.true
    })
  })

  describe('on', function() {
    it('should add a handler to the specified event type', function(done) {
      var ee = anrop()
      expect(ee.on('foo', done)).to.be.ok
      ee.emit('foo')
    })

    it('should support multiple handlers for events', function() {
      var ee = anrop()
        , a  = false
        , b  = false

      expect(ee.on('foo', function() { a = true })).to.be.ok
      expect(ee.on('foo', function() { b = true })).to.be.ok

      ee.emit('foo')

      expect(a).to.be.ok && expect(b).to.be.ok
    })

    it('should only add the handler once to avoid multiple dispatch', function() {
      var n   = 0
        , ee  = anrop()
        , inc = function() { n++ }
        
      expect(ee.on('foo', inc)).to.be.ok
      expect(ee.on('foo', inc)).to.not.be.ok
      ee.emit('foo')

      expect(ee.on('foo', function() {})).to.be.ok
      expect(ee.on('foo', inc)).to.not.be.ok
      ee.emit('foo')

      expect(n).to.equal(2)
    })
  })

  describe('off', function() {
    it('should remove the specified handler for the specified event type', function() {
      var n   = 0
        , ee  = anrop()
        , inc = function() { n++ }

      ee.on('foo', inc)
      ee.emit('foo')
      expect(ee.off('foo', inc)).to.be.ok
      ee.emit('foo')

      expect(n).to.equal(1)
    })

    it('should remove all handlers for the specified type if no handler is specified', function() {
      var n   = 0
        , ee  = anrop()

      ee.on('foo', function() { n++ })
      ee.on('foo', function() { n++ })
      ee.on('foo', function() { n++ })
      ee.emit('foo')

      expect(ee.off('foo')).to.be.ok
      ee.emit('foo')

      expect(n).to.equal(3)
    })

    it('should remove all handlers when no type and handler is specified', function() {
      var n   = 0
        , ee  = anrop()

      ee.on('foo', function() { n++ })
      ee.on('foo', function() { n++ })
      ee.on('foo', function() { n++ })
      ee.emit('foo')

      expect(ee.off()).to.be.ok
      ee.emit('foo')

      expect(n).to.equal(3)
    })
  })

  describe('once', function() {
    it('should add a one off handler to the specified event type', function() {
      var n  = 0
        , ee = anrop()

      expect(ee.once('foo', function() { n++ })).to.be.ok
      ee.emit('foo')
      ee.emit('foo')

      expect(n).to.equal(1)
    })
  })

  describe('emit', function() {
    it('should call all handlers with the supplied arguments', function() {
      var ee = anrop()

      ee.on('foo', function(a, b, c) {
        expect(a).to.equal(1)
        expect(b).to.equal('foo')
        expect(c).to.equal(null)
      })

      ee.emit(1, 'foo', null)
    })

    it('should bind `this` to the dispatcher object', function() {
      var disp = {}
        , ee   = anrop(disp)

      ee.on('foo', function() {
        expect(this).to.equal(disp)
      })

      ee.emit('foo')
    })
  })

  describe('mixin', function() {
    it('should add the `on` and `off` methods to the source object', function() {
      var disp = {}
        , ee   = anrop.mixin(disp)

      expect(disp.on).to.be.a('function')
      expect(disp.on).to.equal(ee.on)

      expect(disp.off).to.be.a('function')
      expect(disp.off).to.equal(ee.off)

      expect(disp.emit).to.equal(undefined)
    })
  })

  describe('usage example', function() {
    it('should work as advertised', function() {
      var source = { toString: function() { return 'Emitter' } }
        , emit   = anrop.mixin(source).emit

      source.on('data', function(msg) {
        expect(this).to.equal(source)
        expect(msg).to.equal('hello, world!')
      })

      emit('data', 'hello, world!')
    })
  })
})