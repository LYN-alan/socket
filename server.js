var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(8080);
var io = require('socket.io').listen(server);
var users = []; //保存所有的在线用户
app.use('/', express.static(__dirname + '/www'));

//socket部分
io.sockets.on('connection', function(socket) {
    //昵称设置
    socket.on('login', function(nickname) {
        if (users.indexOf(nickname) > -1) {
            socket.emit('nickExisted');
        } else {
            socket.userIndex = users.length;
            socket.nickname = nickname;
            users.push(nickname);
            socket.emit('loginSuccess');
            //向所有连接到服务器的客户端发送当前登录用户的昵称
            io.sockets.emit('system', nickname, users.length, 'login');
        }
    });
    socket.on('postMsg', function(msg, color) {
        socket.broadcast.emit('newMsg', socket.nickname, msg, color);
    });
    socket.on('postImg', function(imgData) {
        socket.broadcast.emit('newImg', socket.nickname, imgData);
    });
    //断开连接的事件
    socket.on('disconnect', function() {
        //将断开连接的用户删除
        users.splice(socket.userIndex, 1);
        //通知除自己以外的其他人
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout');
    })
})