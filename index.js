var http = require("http");
var Primus = require("primus");
var connect = require('connect')
var createStatic = require('connect-static');
var _ = require('lodash');
var app = connect();
var nums = _.range(1,101)
var num = _.range(1,101)
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
  socket.on('data', function(message) {
    console.log('recieved a new message', message);
    if(message.msg=='list'){
      nums = _.shuffle(nums);
      socket.write( {"msg":"list","nums": _.first(nums,25) });
    }
  });
});

game = setInterval(sendNewnum,50);
function sendNewnum(){
  num = _.shuffle(num);
  n = num.splice(0,1);
  console.log(n);
  primus.write(n);
  if(num.length==0){
    console.log('Game Over');
    clearInterval(game)
  }
}

server.listen(3000);
