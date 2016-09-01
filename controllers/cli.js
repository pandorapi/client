var docker = require('./lib/docker');
var init = require('../lib/init');

module.exports = ({docker, serverPort}) => {
   if (docker) {
        init(serverPort, (err, data) => {
            if (err) {
                return console.error(err)
            }

            data.options = options;
            docker(data)
        })
    }
}
