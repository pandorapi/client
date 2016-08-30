var utilsFn = require('./utils');
var findHostName = require('./findHostName');
var ftpd = require('./ftpd');
var flags = require('simple-flags');
var io = require('socket.io-client');
var ss = require('socket.io-stream');
var socketPingPong = require('./socket-pingpong');
var docker = require('./docker');

var server = {
    "socket": null,
    "pp": null,
    "utils": null,
    "ip": null
}

module.exports = (port, callback) => {
    findHostName('raspberrypi', port, (pandoraIps) => {
        if (!pandoraIps) {
            callback("No Pandora found on the network.")
            return;
        }

        if (pandoraIps.length > 1) {
            callback("Many Pandora's were found in the network.")
            return;
        }

        server.ip = pandoraIps[0];

        server.socket = ss(io.connect(`http://${server.ip}:${port}`));

        server.pp = socketPingPong(server.socket);

        server.utils = utilsFn(server);

        callback(null, server)
    });
}
