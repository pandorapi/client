var docker = ({
    pp,
    utils,
    options
}, callback) => {
    if (options.list) {
        var list = options.all ? 'listAll' : 'list';
        utils.docker.container[list](callback)
    }

    if (options.stop) {
        utils.docker.basic(options, 'stop', callback)
    }

    if (options.start) {
        utils.docker.basic(options, 'start', 'listAll', callback)
    }

    if (options.inspect) {
        utils.docker.basic(options, 'inspect', 'listAll', callback)
    }

    if (options.create) {
        // {
        //     Image: 'hypriot/rpi-dockerui',
        //     name: 'dockerui',
        //     "ExposedPorts": {
        //         "9000/tcp:": {}
        //     },
        //     "HostConfig": {
        //         "Binds": ["/var/run/docker.sock:/var/run/docker.sock"],
        //         "PortBindings": {
        //             "9000/tcp": [{
        //                 "HostPort": "9000"
        //             }]
        //         }
        //     }
        // }

        pp('docker_create_conteiner', JSON.parse(options.create), callback)
    }

    if (options.pull) {
        pp('docker_pull', options.pull, callback)
    }

}

module.exports = docker;
