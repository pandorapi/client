var flags = require('simple-flags');
var init = require('./lib/init');


var options = flags({
    'all': false,
    'cli': false,
    'web': false,
    'serverPort': 24326,
    'clientPort': 24329,
})

options.cli = (options.docker)
options.electron = (!options.web && !options.cli);

if (options.cli) {
    require('./controllers/cli')(options)
} else if (options.electron) {
    require('./controllers/electron')(options)
} else if (options.web) {
    require('./controllers/web')(options)
}
