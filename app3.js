var fs = require('fs');
var express = require('express');
var logger = require('morgan');
var ejs = require("ejs")
var socketio = require('socket.io');
var _ = require('underscore');


// create the express app
var app = express();
app.use(express.static(__dirname + '/public'));
// connect the Morgan logging middleware to our app
app.use( logger('dev') );

// start a server listening on port 1234
var server = app.listen( 1234 );
var io = socketio.listen( server );
var pathList = [];
var clients = [];
var gearCount = 0;
app.set('view engine','ejs')

io.sockets.on('connection', function (socket) {
  socket.join('some room');
  clients.push(socket.client.id)
  console.dir(clients)
  socket.emit('project', { paths: pathList });
  socket.on('newPath', function (data) {
      console.log('added a new path. now at '+gearCount+' paths')
      pathList[gearCount]= data.newPath
      gearCount++
      io.sockets.emit('update',{paths:pathList})
  });
  socket.on('giveup',function(data){
      io.sockets.emit('erase')
      gearCount = 0;
      pathList = []
  });
  socket.on('disconnect',function(){
      clients.pop(socket.client.id)
  });
});

app.get('/', function (request, response) {
    response.render('mainView');
});

app.get('/:room', function (request, response) {
    console.dir(request.params.room)
    io.to('/'+request.params.room).emit('some event');
    //response.locals.room = request.params
    response.render( 'room',{room: request.params.room});
});
