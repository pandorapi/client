var getHostName = require('./getHostName.js')
var scan = require("scan-neighbors")


module.exports = (name, port, callback) => {
    var pandoraServer = [],
        key = 0;

    if(!callback){
        callback = port;
        port = 22
    }

    scan.scanNodes(port, function(err, nodes) {
        if (!nodes) {
            return;
        }

        var find = (name, callback) => {
            if (!nodes[key]) {
                key = 0;
                callback(pandoraServer)
                return;
            }

            getHostName(nodes[key], (hostname) => {
                if (hostname.indexOf(name) > -1) {
                    pandoraServer.push(nodes[key])
                }

                ++key;

                find(name, callback);
            })
        }

        find(name, callback);

    });
}
