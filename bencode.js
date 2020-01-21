
module.exports = function(RED) {
    "use strict";
    var Bencode = require('./lib/BencodeNode')(RED)

    function BencodeNode (config) {
        RED.nodes.createNode(this, config)

        // initialize node
        this.property = config.property || "payload";
        this.pattern = config.pattern;
        var bin = new Bencode(this, config.pattern)
        var node = this;

        // on input message
        this.on('input', function (msg) {
            node.status({fill:'yellow', shape:'dot', text:'processing'})
            try {
                bin.handleInputEvent(msg)
                node.status({fill:'green', shape:'dot',text:'success'})
            } catch (e) {
                node.error(e,msg)
                node.status({fill:'red', shape:'ring', text:e.message})
            }
        })

        // on close
        this.on('close', function () {
            bin.handleCloseEvent()
        })
    }

    RED.nodes.registerType('bencode', BencodeNode)
}
