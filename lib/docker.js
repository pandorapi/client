var docker = (server) => {

    var handle = (type, args, callback) => {
        if (typeof args == 'function') {
            callback = args
            args = undefined
        }

        if (type == 'listContainers') {
            server.pp('docker_list_conteiners', callback)
        }

        if (type == 'listAllContainers') {
            server.pp('docker_list_conteiners', {
                all: true
            }, (containers) => {
                callback(containers)
            })
        }

        if (type == 'listImages') {
            server.pp('docker_list_images', callback)
        }

        if (type == "stop") {
            server.pp('docker_conteiners_stop', args, (container) => {
                handle('getContainerId', container.Id, callback)
            })
        }

        if (type == "start") {
            server.pp('docker_conteiners_start', args, (container) => {
                handle('getContainerId', container.Id, callback)
            })
        }

        if (type == "inspect") {
            server.pp('docker_conteiners_inspect', args, callback)
        }

        if (type == "getContainerId") {
            handle('listAllContainers', (conteiners) => {
                for (var key in conteiners) {
                    if (conteiners[key].Id == args) {
                        return callback(conteiners[key])
                    }
                }

                callback(null)
            })
        }

        if (type == "suggestNameContainer") {
            handle('listAllContainers', (conteiners) => {
                var name = args;
                var key = 0;

                for (var key in conteiners) {
                    if (conteiners[key].Names.indexOf('/'+args) > -1) {
                        while(conteiners[key].Names.indexOf('/'+name) > -1){
                            ++key;
                            name = args + `-${key}`
                        }

                        callback(name);
                        break;
                    }
                }
            })
        }

        if (type == "hello") {
            server.pp('hello', callback)
        }

        if (type == "getContainerName") {
            handle('listAllContainers', (conteiners) => {
                for (var key in conteiners) {
                    if (conteiners[key].Names.indexOf('/'+args) > -1) {
                        return callback(conteiners[key])
                    }
                }

                callback(null)
            })
        }

        if (type == "createContainer") {
            server.pp('docker_create_conteiner', args, callback)
        }

        if (type == "removeContainer") {
            handle('getContainerId', args, (container) => {
                    server.pp('docker_conteiners_remove', container, callback)
            })
        }

        if (type == "dockerPull") {
            server.pp('docker_pull', args.pull, callback)
        }

        if(type == "containerToggle"){
            handle('listContainers', (conteiners) => {
                for (var key in conteiners) {
                    if (conteiners[key].Id == args) {
                        return handle('stop', conteiners[key], callback)
                    }
                }

                handle('listAllContainers', (conteiners) => {
                    for (var key in conteiners) {
                        if (conteiners[key].Id == args) {
                            return handle('start', conteiners[key], callback)
                        }
                    }
                })

            })
        }
    }

    return handle;

}

module.exports = docker;
