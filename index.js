var http = require("http");
var Primus = require("primus");
var connect = require('connect')
var createStatic = require('connect-static');

var app = connect();
createStatic(options, function(err, middleware) {
  if (err) throw err;
  app.use('/', middleware);
});

var server = http.createServer(app);
var options = {
  transformer: "engine.io"
}
var primus = new Primus(server, options);

primus.on('connection', function(socket) {
  console.log("client has connected");
  socket.write("Hello Client, I am Server");
  socket.on('data', function(message) {
    console.log('recieved a new message', message);
    socket.write({
      ping: 'pong'
    });
  });
});

server.listen(3000);
