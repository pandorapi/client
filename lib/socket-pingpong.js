function socketPingPong(socket) {
    return (name, ...args) => {
        var callback = args[args.length - 1];

        args.pop()
        if (args.length == 1) {
            args = args[0]
        }

        socket.emit(name, args)

        socket.on(name, callback);
        return this;
    };
}

module.exports = socketPingPong;
