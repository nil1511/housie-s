var http = require("http"),
Primus = require("primus"),
connect = require('connect'),
createStatic = require('connect-static'),
_ = require('lodash'),
app = connect(),
nums = _.range(1,101),
num = _.range(1,101),
interval = 5000,
size = 25,
server = http.createServer(app);

createStatic(options, function(err, middleware) {
  if (err) throw err;
  app.use('/', middleware);
});

var options = {
  transformer: "engine.io"
};

var primus = new Primus(server, options);
primus.on('connection', function(socket) {
  console.log("client has connected");
  socket.on('data', function(message) {
    console.log('recieved a new message', message);
    if(message.msg=='list'){
      nums = _.shuffle(nums);
      socket.write( {"msg":"list","nums": nums.slice(0,size) });
    }
  });
});

sendNewnum();
game = setInterval(sendNewnum,interval);
function sendNewnum(){
  num = _.shuffle(num);
  n = num.splice(0,1);
  console.log(n);
  primus.write(n);
  if(num.length===0){
    console.log('Game Over. New Game Starts in 10 Sec');
    clearInterval(game);
    num = _.range(1,101);
    setTimeout(function(){
      game = setInterval(sendNewnum,interval);
    },10000);
  }
}

server.listen(3000);
