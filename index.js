'use strict';

var http = require("http"),
  connect = require('connect'),
  createStatic = require('connect-static'),
  _ = require('lodash'),
  app = connect(),
  nums = _.range(1, 101),
  num = _.range(1, 101),
  interval = 5000,
  size = 25,
  server = http.createServer(app),
  io = require('socket.io')(server);

var n;
var socketInfo = {};
var game;
var gameStaredFlag = false;

var options = {
  // followSymlinks: true,
  // cacheControlHeader: "max-age=0, must-revalidate"
};

createStatic(options, function(err, middleware) {
  if (err) {
    throw err;
  }
  app.use('/', middleware);
});

io.on('connection', function(socket) {
  console.log("client has connected");


  socket.on('register', function(message) {
    console.log('recieved a new message', message);
    var socketInfoObject = {};
    console.log("ID of the socket " + socket.id);
    console.log("Name of the user " + message.userName);

    socketInfoObject.userName = message.userName;
    socketInfoObject.bingoLeft = size;
    socketInfoObject.gameStatus = 0;
    socketInfo[socket.id] = socketInfoObject;

    nums = _.shuffle(nums);
    socket.emit('list', nums.slice(0, size));
    io.emit('update', socketInfo);

    if(!gameStaredFlag){
      gameStaredFlag = true;
      startTheGame();
    }

  });

  socket.on('bingoLeft', function(message) {
    var socketInfoObject = socketInfo[socket.id];
    socketInfoObject.bingoLeft = message;
    io.emit('update', socketInfo);
  });

  socket.on('bingoPressed', function(message) {
    var socketInfoObject = socketInfo[socket.id];
    socketInfoObject.gameStatus = message;
    io.emit('update', socketInfo);

    if(message === 1){
      gameOver();
    }
  });
});

function startTheGame (){
  game = setInterval(sendNewnum, interval);
}

function sendNewnum() {
  num = _.shuffle(num);
  n = num.splice(0, 1);
  console.log(n);
  io.emit('nextNumber', n);
  if (num.length === 0) {
    gameOver();
  }
}

function gameOver(){
  io.emit('gameOver', socketInfo);
  socketInfo = {};
  gameStaredFlag = false;
  console.log('Game Over. New Game Starts in 10 Sec');
  clearInterval(game);
  num = _.range(1, 101);
  setTimeout(function() {
    game = setInterval(sendNewnum, interval);
  }, 10000);
}

server.listen(3000);
