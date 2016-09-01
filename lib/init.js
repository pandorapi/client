var findHostName = require('./findHostName');
var ftpd = require('./ftpd');
var flags = require('simple-flags');
var io = require('socket.io-client');
var ss = require('socket.io-stream');
var pingpong = require('socket.io-pingpong');
var docker = require('./docker');

var server = {
    "socket": null,
    "docker": null,
    "utils": null,
    "ip": null
}

module.exports = (port, callback) => {
    findHostName('raspberrypi', port, (pandoraIps) => {
        if (!pandoraIps || !pandoraIps.length) {
            callback("No Pandora found on the network.")
            return;
        }

        if (pandoraIps.length > 1) {
            callback("Many Pandora's were found in the network.")
            return;
        }

        server.ip = pandoraIps[0];

        server.socket = pingpong(ss(io.connect(`http://${server.ip}:${port}`)));

        server.docker = docker(server.socket);

        callback(null, server)
    });
}
