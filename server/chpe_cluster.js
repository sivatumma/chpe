var cluster = require('cluster'),
    http = require('http'),
    PORT = process.env.PORT || 1337,
    os = require('os'),
    server;

function forkClusters () {
    var cpuCount = os.cpus().length;
    // Create a worker for each CPU
    for (var i = 0; i < cpuCount ; i += 1) {
        cluster.fork();
    }
}

// Master Process
if (cluster.isMaster) {

    // You can also of course get a bit fancier about logging, and
    // implement whatever custom logic you need to prevent DoS
    // attacks and other bad behavior.
    //
    // See the options in the cluster documentation.
    //
    // The important thing is that the master does very little,
    // increasing our resilience to unexpected errors.

    forkClusters ()

    cluster.on('disconnect', function(worker) {
        console.error('disconnect!');
        cluster.fork();
    });

}
function handleError (d) {
    d.on('error', function(er) {
        console.error('error', er.stack);

        // Note: we're in dangerous territory!
        // By definition, something unexpected occurred,
        // which we probably didn't want.
        // Anything can happen now!Be very careful!

        try {
            // make sure we close down within 30 seconds
            var killtimer = setTimeout(function() {
                process.exit(1);
            }, 30000);
            // But don't keep the process open just for that!
            killtimer.unref();

            // stop taking new requests.
            server.close();

            // Let the master know we're dead.This will trigger a
            // 'disconnect' in the cluster master, and then it will fork
            // a new worker.
            cluster.worker.disconnect();
        } catch (er2) {
            // oh well, not much we can do at this point.
            console.error('Error sending 500!', er2.stack);
        }
    });
}
// child Process
if (cluster.isWorker) {
    // the worker
    //
    // This is where we put our bugs!

    var domain = require('domain');
    var express = require('express');
    var app = express();
    app.set('port', PORT);

    // See the cluster documentation for more details about using
    // worker processes to serve requests.How it works, caveats, etc.

    var d = domain.create();
    handleError(d);

    // Now run the handler function in the domain.
    //
    // put all code here. any code included outside of domain.run will not handle errors on the domain level, but will crash the app.
    //

    d.run(function() {
        // this is where we start our server
        server = http.createServer(app).listen(app.get('port'), function () {
            console.log('Cluster %s listening on port %s', cluster.worker.id, app.get('port'));
        });
    });
}