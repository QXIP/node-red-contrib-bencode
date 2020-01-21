node-red-contrib-bencode
=======================

<a href="http://nodered.org" target="_new">Node-RED</a> function that takes the <b>msg.payload</b> and converts it to/from bencode data.

Installation
------------

Either use the Manage Palette option in the Node-RED Editor menu, or run the following command in your Node-RED user directory - typically `~/.node-red`

        npm i node-red-contrib-bencode

Usage
-----

If the input is a buffer it tries to parse it as bencode and creates a javascript object.
If the input is a javascript object it tries to serialize it as bencode and creates a buffer.

