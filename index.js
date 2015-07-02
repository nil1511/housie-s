'use strict';

var http = require("http"),
connect = require('connect'),
createStatic = require('connect-static'),
_ = require('lodash'),
app = connect(),
nums = _.range(1,101),
num = _.range(1,101),
interval = 5000,
size = 25,
server = http.createServer(app),
io = require('socket.io')(server);

var n;
var options = {
  // followSymlinks: true,
  // cacheControlHeader: "max-age=0, must-revalidate"
};

createStatic(options, function(err, middleware) {
  if (err) {throw err;}
  app.use('/', middleware);
});

io.on('connection', function(socket) {
  console.log("client has connected");
  socket.on('getList', function(message) {
    console.log('recieved a new message', message);
      nums = _.shuffle(nums);
      socket.emit('list', nums.slice(0,size) );
  });
});

sendNewnum();
var game = setInterval(sendNewnum,interval);

function sendNewnum(){
  num = _.shuffle(num);
  n = num.splice(0,1);
  console.log(n);
  io.emit('nextNumber',n);
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
