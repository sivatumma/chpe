/*****************************************************************************
 *	This is the Cluster file that will run Pricing Engine application 
 *	to take advantage of many core processors. When we write scripts
 *  for docker environment - auto scalability, We can peacefully believe
 *  that the application is utilizing the resources optimistically and to 
 *	the fullest knowledge. Docker spans a machine, This module spawns our 
 *	apps into cores. Like that.
 * 
 *****************************************************************************/
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', function(worker, code, signal) {
    console.log('worker ' + worker.process.pid + ' died');
  });
} else {
	// Here we will use express module
	
  // Workers can share any TCP connection
  // In this case its a HTTP server
  http.createServer(function(req, res) {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
}
