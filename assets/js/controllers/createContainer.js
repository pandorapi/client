controllers.prototype.createContainer = function() {
    var controllers = this;
    var socket = controllers.socket;

    socket.pp('listImages', function(images) {
        images.unshift({
            text: "Select a image"
        })

        new Vue({
            el: '#project',
            data: {
                name: "DockerUi",
                images,
                volumes: [{
                    local: '/var/run/docker.sock',
                    remote: '/var/run/docker.sock'
                }],
                ports: [{
                    local: '9000',
                    remote: '9000'
                }]
            },
            watch: {
                "getImageId": function(id) {
                    socket.pp('dockerGetCotainerById', id, function(image) {
                        console.log(container)
                    })
                }
            },
            methods: {
                addVolume: function() {
                    this.volumes.push({
                        local: '',
                        remote: ''
                    })
                },
                removeVolume: function(index) {
                    this.volumes.splice(index, 1)
                },
                addPort: function() {
                    this.ports.push({
                        local: '',
                        remote: ''
                    })
                },
                removePort: function(index) {
                    this.ports.splice(index, 1)
                },
                onSubmit: function(e) {
                    e.preventDefault()
                    var data = $('#project').serializeObject();

                    data.volumes = []
                    data.ports = []

                    var conf = [
                        ['volumes', 'volume'],
                        ['ports', 'port']
                    ];

                    conf.forEach(function(targets) {
                        var target = targets[0]
                        var obj = targets[1]
                        if (data[obj + 'Local'] && data[obj + 'Remote']) {
                            if (typeof data[obj + 'Local'] != 'object') {
                                data[obj + 'Local'] = [data[obj + 'Local']]
                            }

                            if (typeof data[obj + 'Remote'] != 'Remote') {
                                data[obj + 'Remote'] = [data[obj + 'Remote']]
                            }

                            for (var i = 0; i < data[obj + 'Local'].length; i++) {
                                if (typeof data[obj + 'Remote'] == 'object') {
                                    data[target].push({
                                        local: data[obj + 'Local'][i],
                                        remote: data[obj + 'Remote'][i]
                                    })
                                }
                            }
                        }
                    })

                    delete data.volumeLocal;
                    delete data.volumeRemote;
                    delete data.portLocal;
                    delete data.portRemote;

                    socket.pp('createContainer', data, function(container) {
                        console.log(container)
                    })
                }
            }
        })
    })
}
