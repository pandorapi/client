controllers.prototype.listContainers = function() {
    var controllers = this;
    var socket = controllers.socket;

    socket.pp('listAllContainers', function(data) {
        var containers = [];

        data.forEach(function(value) {
            var container = {}
            container.name = value.Names[0].substring(1)
            container.id = value.Id
            container.action = !(value.Status.indexOf('Up') == 0)
            container.refresh = false
            container.removing = false
            containers.push(container)
        })

        containers.sort()

        controllers.cache.listContainers = new Vue({
            el: '#listContainers',
            data: {
                containers
            },
            methods: {
                "containerInfo": function(index) {
                    controllers.infoContainer(this.containers[index].id)
                },
                "containerToggle": function(index) {
                    if (!this.containers[index].refresh) {
                        this.containers[index].refresh = true
                        socket.pp('containerToggle', this.containers[index].id, function(data) {
                            controllers.cache.listContainers.containers[index].refresh = false
                            controllers.cache.listContainers.containers[index].action = !(data.Status.indexOf('Up') == 0)
                        })
                    }
                }
            }
        })
    })
}
