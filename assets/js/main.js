$(function() {
    var socket = pingpong(io.connect())

    var controller = new controllers(socket);

    socket.on('msg', infoTip)

    socket.on('findServer', function(ip) {
        if (!ip && window.connectionCount == limitConnection) {
            if (!window.abortReConnection) {
                infoTip('info', 'There have been many attempts to connect to Pandora without success.<br />You want to try again?<br /><br /><button type="button" class="btn infoTip remove btn-success event reconnect">Yes</button><button type="button" class="btn infoTip remove pull-right btn-danger">No</button>', {
                    "timeOut": 0,
                    "extendedTimeOut": 0
                });
            }
            window.abortReConnection = true;
            return;
        }

        if (ip) {
            new Vue({
                el: '.ip',
                data: {
                    ip
                }
            })

            loader.big(false);
            loader.logo(false);
            window.connectionCount = 0;
            window.abortVerificConnection = false;

            controller.listContainers()

            setTimeout(function() {
                if (!window.inVerCon) {
                    window.inVerCon = setInterval(function() {
                        if (window.abortReConnection) {
                            return;
                        }

                        var verificConnection = false;
                        socket.pp('hello', function(hello) {
                            verificConnection = hello
                        })
                        setTimeout(function() {
                            if (verificConnection == false) {
                                socket.emit('reConnect')
                            }
                        }, 1000)
                    }, 2000)
                }
            }, 3000)

        } else {
            window.connectionCount++
                if (window.connectionCount == (limitConnection / 2)) {
                    loader.big('start');
                }
            setTimeout(function() {
                socket.emit('reConnect')
            }, 3000)
        }
    })
})
