var express = require('express');
var app = express();
var init = require('./init');
var docker = require('./docker');

module.exports = (clientPort, serverPort) => {
    var pandoraIp;
    var server = {}

    function option(opt){
        var data = server
        data.options = opt;
        return data;
    }

    app.listen(clientPort)

    app.use('/', express.static('public'));

    app.get('/connect', (req, res) => {
        console.log('connect')
        init(serverPort, (err, data) => {
            server = data;
            if (err) {
                return res.send(err)
            }

            pandoraIp = data.ip;
            res.json(pandoraIp)
        })
    })

    app.get('/docker/:action', (req, res) => {
        docker(option({
            [req.params.action] : true,
            all: req.query.all || false
        }), (containers) => {
            res.json(containers)
        })
    })
}
