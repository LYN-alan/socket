var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app).listen(8080);
var io = require('socket.io').listen(server);
app.use('/', express.static(__dirname + '/www'));

//socket部分
io.on('connection', function(socket) {
    //接收并处理客户发送的foo事件
    socket.on('foo', function(data) {
        //将消息输出到控制台
        console.log(data)
    })
})