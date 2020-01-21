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
    // if (msg.hasOwnProperty('payload')) {
        var t = typeOf(value);
        if (t == 'object') { // serialize object
	    var result = this.bencode(value);
            this._sendMessage(result, msg)
        } else if (Buffer.isBuffer(value)) { // parse buffer
            var foo = this
	    var result = this.bdecode(value);
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
    if (this.node.pattern.split(",").length === 1) {
        if (this.node.pattern.split("=>").length <= 1) {
            RED.util.setMessageProperty(m,this.node.property,payload);
        }
        else {
            RED.util.setMessageProperty(m,this.node.property,payload[this.node.pattern.split("=>")[1].trim()]);
        }
    }
    else {
        RED.util.setMessageProperty(m,this.node.property,payload);
    }
    m.original = msg.payload;
    this.node.send(m)
}

module.exports = function (runtime) {
    RED = runtime
    return BencodeNode
}
