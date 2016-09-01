var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var init = require('../lib/init');
var pingpong = require('socket.io-pingpong');

module.exports = ({
    clientPort,
    serverPort,
    web
}) => {
    server.listen(clientPort, () => {
        if (web) {
            console.log(`http://localhost:${clientPort}`)
        }
    })

    app.use('/', express.static('public'));
    app.use('/pingpong.js', pingpong());

    io.on('connection', function(socket) {
        var Pandora
        socket = pingpong(socket);

        var connection = (err, server) => {
            if (err) {
                socket.emit('msg', 'warning', err, {
                    timeOut: 2000,
                });
                socket.emit('findServer', false)
            } else {
                Pandora = server;
                socket.emit('findServer', Pandora.ip)
            }
        }

        init(serverPort, connection)

        socket
            .on("reConnect", () => {
                init(serverPort, connection)
            })
            .on("hello", (ev) => {
                if (Pandora) {
                    console.log('hello')
                    Pandora.docker("hello", (hello) => {
                        console.log(hello)
                        socket.emit(ev, hello)
                    })
                }
            })
            .on('listContainers', (ev, data) => {
                Pandora.docker('listContainers', (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('listAllContainers', (ev, data) => {
                Pandora.docker('listAllContainers', (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('listImages', (ev, data) => {
                Pandora.docker('listImages', {
                    id: data
                }, (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('createContainer', (ev, data) => {
                Pandora.docker('suggestNameContainer', data.name, (newName) => {
                    var config = {
                        "Image": data.image,
                        "name": newName,
                        "ExposedPorts": {},
                        "HostConfig": {
                            "Binds": [],
                            "PortBindings": {}
                        }
                    }

                    data.ports.forEach((port) => {
                        var name = (port.remote.indexOf('/') > -1) ? port.remote : port.remote + '/tcp'
                        config.ExposedPorts[name] = {}
                        config.HostConfig.PortBindings[name] = [{
                            "HostPort": port.local
                        }]
                    })

                    data.volumes.forEach((volume) => {
                        config.HostConfig.Binds.push(volume.local + ':' + volume.remote)
                    })

                    Pandora.docker('createContainer', config, (container) => {
                        console.log(container)
                        socket.emit(ev, container)
                    })
                })
            })
            .on('getContainerId', (ev, id) => {
                Pandora.docker('getContainerId', id, (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('getContainerName', (ev, name) => {
                Pandora.docker('getContainerName', name, (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('containerToggle', (ev, id) => {
                Pandora.docker('containerToggle', id, (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('removeContainer', (ev, id) => {
                Pandora.docker('removeContainer', id, (result) => {
                    socket.emit(ev, result)
                })
            })
            .on('saveProject', (ev, data) => {
                console.log(data)
            })



    });

}
