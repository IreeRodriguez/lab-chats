var app = require('express')();
var http = require('http').createServer(app);
var port = process.env.PORT || 3000;
var path = require('path');
var express = require('express');
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('assets'));

io.on('connection', function(socket){
  console.log('connected');  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
    console.log('mensaje');
    
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
