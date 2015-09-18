    var wsServer = require('ws').Server,
        wss = new wsServer({
            port: 8001
        });

    wss.on('connection', function(ws) {
        console.log("Web Socket is listening on 8001");
        ws.on('message', function(message) {
            console.log('received: %s', message);
        });
        setInterval(function() {
            try {
                ws.send(Math.floor(Math.random() * 100) + "");
            } catch (e) {}
        }, 100);
    });
