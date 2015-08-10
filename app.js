var fs = require('fs');
var express = require('express');
var logger = require('morgan');
var ejs = require("ejs")
var socketio = require('socket.io');
var _ = require('underscore');
var favicon = require('express-favicon');
// create the express app
var app = express();
app.use(express.static(__dirname + '/public'));
// connect the Morgan logging middleware to our app
app.use( logger('dev') );
app.use(favicon('favicon.ico'));
// start a server listening on port 1234
var server = app.listen( 1234 );
var io = socketio.listen( server );
var pathList = {};
var imgList = {};
var clients = [];
var gearCount = {};
app.set('view engine','ejs')

io.sockets.on('connection', function (socket) {
  socket.on('roomname',function(data){
    socket.join(data)
    if(pathList[data])
      io.to(data).emit('project', {paths: pathList[data]})
    else
      {
        pathList[data] = []
        gearCount[data] = 0
        console.log('room added')
      }
  });
  //socket.emit('project', { paths: pathList['/'] });
  socket.on('newPath', function (data) {
      room = data.room
      imgList[room] = data.img
      pathList[room][gearCount[room]]= data.newPath
      gearCount[room]++
      io.to(room).emit('update',{paths:pathList[room]})
  });

  socket.on('giveup',function(data){
      io.to(room).emit('erase')
      gearCount[room] = 0;
      pathList[room] = []
  });
});

app.get('/cheeseburgerbuns', function (request, response) {
    response.render('mainView', {rooms: Object.keys(pathList),imgs:imgList});
});

app.get('/cheeseburgerbuns/:room/delete', function (request, response) {
  if(pathList[request.params.room])
  {
    delete pathList[request.params.room]
    delete gearCount[request.params.room]
    delete imgList[request.params.room]
  }
  response.redirect('/cheeseburgerbuns');

});


app.get('/cheeseburgerbuns/:room', function (request, response) {
    //io.to('/'+request.params.room).emit('some event');
    //response.locals.room = request.params

    response.render( 'room',{room: request.params.room});
});
