var utils = ({
    pp
}) => {
    var utils = {
        "docker": {
            "container": {
                "list": (callback) => {
                    pp('docker_list_conteiners', false, (containers) => {
                        callback(containers)
                    })
                },
                "listAll": (callback) => {
                    pp('docker_list_conteiners', true, (containers) => {
                        callback(containers)
                    })
                },
                "findId": (id, conteiners, callback) => {
                    for (var key in conteiners) {
                        if (conteiners[key].Id == id) {
                            return callback(conteiners[key])
                        }
                    }

                    callback(null)
                },
                "findName": (name, conteiners, callback) => {
                    for (var key in conteiners) {
                        if (conteiners[key].Names[0] == '/' + name) {
                            return callback(conteiners[key])
                        }
                    }

                    callback(null)
                },
                "start": (container, callback) => {
                    pp('docker_conteiners_start', container, (container) => {
                        callback(container)
                    })
                },
                "stop": (container, callback) => {
                    pp('docker_conteiners_stop', container, (container) => {
                        callback(container)
                    })
                },
                "inspect": (container, callback) => {
                    pp('docker_conteiners_inspect', container, (container) => {
                        callback(container)
                    })
                }
            },
            "basic": (options, action, list, callback) => {
                if(typeof list == 'function'){
                    callback = list;
                    list = 'list';
                }

                if (options.all) {
                    utils.docker.container[list]((containers) => {
                        containers.forEach((container) => {
                            utils.docker.container[action](container, callback)
                        })
                    })
                } else {
                    utils.docker.container[list]((containers) => {
                        if (containers.length) {
                            if (options.id) {
                                utils.docker.container.findId(options.id, containers, (container) => {
                                    utils.docker.container[action](container, callback)
                                })
                            } else if (options.name) {
                                utils.docker.container.findName(options.name, containers, (container) => {
                                    utils.docker.container[action](container, callback)
                                })
                            }
                        } else {
                            callback(null)
                        }
                    })
                }
            }
        }
    }

    return utils;
}

module.exports = utils;
