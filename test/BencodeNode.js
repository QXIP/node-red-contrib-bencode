'use strict'
var RED = {
  settings: {},
  util: { cloneMessage: function (message) {return message}
  }
}

var Bencode = require('../lib/BencodeNode')(RED)
var assert = require('assert')
var typeOf = require('typeof')

var bencode_string = 'd6:string11:Hello World7:integeri12345e4:dictd3:key36:This is a string within a dictionarye4:listli1ei2ei3ei4e6:stringi5edeee';
var bencode_buffer = Buffer.from(benstring);
var bencode_object = {
  string: 'Hello World',
  integer: 12345,
  dict: {
    key: 'This is a string within a dictionary'
  },
  list: [ 1, 2, 3, 4, 'string', 5, {} ]
};

describe('Environment:', function () {
  it('is ready', function () {
    assert(Bencode)
  })
})

describe('BencodeNode:', function () {
  var node = {
    messageSent: null,
    send: function (message) {this.messageSent = message}
  }
  var pattern = 'b8 => integer, b32f => float'
  var bin = new Bencode(node, pattern)

  beforeEach(function () {
    node.messageSent = null
  })

  it('is created', function () {
    assert(bin.parser)
    assert(bin.serializer)
  })

  it('empty message', function () {
    var msg = {} // must have payload
    bin.handleInputEvent(msg)
    assert(node.messageSent == null)
  })

  it('invalid input', function () {
    var msg = {payload: 'invalid'} // must be object or buffer
    assert.throws(
      function () { bin.handleInputEvent(msg) },
      /invalid input/
    )
  })

  it('valid input', function () {
    var msg = {payload: bencode_object }
    bin.handleInputEvent(msg)
    assert(node.messageSent != null)
  })

  it('valid serialization', function () {
    var msg = {payload: bencode_object }
    bin.handleInputEvent(msg)
    var t = typeOf(node.messageSent.payload)
    assert.strictEqual(t, 'buffer')
    var ref = bencode_buffer;
    assert.equal(node.messageSent.payload.compare(ref), 0)
  })

  it('valid parsing', function () {
    var msg = {payload: bencode_buffer}
    bin.handleInputEvent(msg)
    var t = typeOf(node.messageSent.payload)
    assert.strictEqual(t, 'object')
  })
})
