'use strict'
var RED
var typeOf = require('typeof')
var bencode = require('@qxip/bencode');

function BencodeNode (node, pattern) {
    var parser, serializer
    this.node = node
    // create bencode enc/dec
    this.bencode = bencode.encode;
    this.bdecode = bencode.decode;
}

BencodeNode.prototype.handleInputEvent = function (msg) {
    var value = RED.util.getMessageProperty(msg,this.node.property);
    if (value !== undefined) {
        var t = typeOf(value);
        if (t == 'object') { // serialize object
	    var result = this.bencode(value);
            this._sendMessage(result, msg)
        } else if (Buffer.isBuffer(value)) { // parse buffer
	    var result = this.bdecode(value, 'utf8');
            this._sendMessage(result, msg)
        } else if (t == 'string') { // parse bencode string
	    var result = this.bdecode(value, 'utf8');
            this._sendMessage(result, msg)
        } else {
            throw new Error('invalid input')
        }
    }
}

BencodeNode.prototype.handleCloseEvent = function () {}

BencodeNode.prototype._sendMessage = function (payload, msg) {
    // create message
    var m = RED.util.cloneMessage(msg);
    RED.util.setMessageProperty(m,this.node.property,payload);
    m.original = msg.payload;
    this.node.send(m)
}

module.exports = function (runtime) {
    RED = runtime
    return BencodeNode
}
