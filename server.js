var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('Servidor Rodando...');
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
    connections.push(socket);
    console.log('Conectado: %s sockets conectados', connections.length);


    //DISCONECTAR
    socket.on('disconnect', function () {
        //if(!socket.username) return;
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("DISCONECTADO: %s sockets conectados", connections.length);
    });

    //Mandar mensagens
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message', {msg: data});
    })

    // new user
    socket.on('new user',function(data,callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
});