var findHostName = require('./lib/findHostName');
var ftpd = require('./lib/ftpd');
var flags = require('simple-flags');
var io = require('socket.io-client');
var ss = require('socket.io-stream');
var socketPingPong = require('./lib/socket-pingpong');
var utilsFn = require('./lib/utils');
var docker = require('./lib/docker');

// var pandoraPort = 24325
var pandoraPort = 24326
    // var pandoraPort = 22
    //
var pp, socket;
module.exports = () => {

    this.find = (callback) => {
        findHostName('raspberrypi', pandoraPort, (pandoraIps) => {
            if (!pandoraIps) {
                callback("No Pandora found on the network.")
                return;
            }

            if (pandoraIps.length > 1) {
                callback("Many Pandora's were found in the network.")
                return;
            }

            var pandoraIp = pandoraIps[0];

            console.log('Pandora found in: ' + pandoraIp)

            socket = ss(io.connect(`http://${pandoraIp}:${pandoraPort}`));

            pp = socketPingPong(socket);

            var utils = utilsFn({
                socket,
                pp
            });

            callback(null, pandoraIp)
        });
    }



    var options = flags({
        'all': false,
        'cli': true
    })

    if (options.cli) {
        if(options.docker){
            docker({utils, pp, options})
        }
    }
}
