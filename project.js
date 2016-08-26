var findHostName = require('./lib/findHostName');
var ftpd = require('./lib/ftpd');
var flags = require('simple-flags');
var io = require('socket.io-client');
var ss = require('socket.io-stream');

findHostName('raspberrypi.local', 22, (pandoraIps) => {
    if (!pandoraIps) {
        console.error("No Pandora found on the network.")
        return;
    }

    if (pandoraIps.length > 1) {
        console.error("Many Pandora's were found in the network.")
        return;
    }

    var pandoraIp = pandoraIps[0];

    console.log('Pandora found in: ' + pandoraIp)

    var options = flags({
        args: ['name', 'path'],
        "name" : "newProject",
        "path" : "/home/assis/Projects"
    });

    var socket = ss(io.connect(`http://${pandoraIp}:7777`));
    console.log(options)
    socket
        .emit('hello', 'client!')
        .on('hello', (data) => {
            console.log('Hello ' + data)
        })


});
