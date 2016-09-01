controllers.prototype.infoContainer = function(id) {
    var controllers = this;
    var socket = controllers.socket;

    socket.pp("getContainerId", id, function(container) {
        container.name = container.Names[0].substring(1)
        container.id = container.Id
        container.action = !(container.Status.indexOf('Up') == 0)

        if (!controllers.cache.infoContainer) {
            controllers.cache.infoContainer = new Vue({
                el: "#infoContainer",
                data: {
                    container,
                    containerJson: syntaxHighlight(container)
                },
                methods: {
                    removeContainer: function() {
                        confirm('To confirm removal, type the container name:', function() {
                            $('#infoContainer').modal('hide')

                            var id = content.container.Id;

                            controllers.cache.listContainers.containers.forEach(function(container, index) {
                                if (container.id == id) {
                                    controllers.cache.listContainers.containers[index].removing = true
                                }
                            })

                            socket.pp('removeContainer', id, function(data) {
                                if (data) {
                                    var containers = controller.cache.listContainers.containers.filter(function(container) {
                                        return (container.id != id)
                                    })

                                    controllers.cache.listContainers.containers = containers;
                                } else {
                                    controllers.cache.listContainers.containers.forEach(function(container, index) {
                                        if (container.id == id) {
                                            controller.listContainers.containers[index].removing = false
                                        }
                                    })
                                }
                            })
                        })
                    }
                }
            })
        } else {
            content.container = container
        }

        $("#infoContainer").modal('show')

    })
}
