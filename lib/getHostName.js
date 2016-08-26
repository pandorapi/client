var spawn = require('child_process');              // spawn process
var os = require('os');                            // OS access

function getHostName(ip, callback){
		var hostname = '';

		switch(os.type().toLowerCase()){
			case 'linux':
				spawn.exec('avahi-resolve-address ' + ip +" | awk '{print $2}'", function (err, stdout, stderr){
					if(err) console.error('['+ip+' hostname not found]: '+stderr);
					else callback(stdout);

				});
				break;
			case 'darwin':
				spawn.exec('dig +short -x ' + ip +" -p 5353 @224.0.0.251", function (err, stdout, stderr){
					if(err) console.error('['+ip+' hostname not found]: '+stderr);
					else callback(stdout);
				});
				break;
		}
}

module.exports = getHostName;
