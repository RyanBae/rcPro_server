
// var app = require('express')();
var http = require('http').Server();
const socket = require("socket.io")(http);
const path = require("path")
const fs = require("fs")

// fs.readFile(path.join(__dirname, '..', '..', 'foo.bar'))
exports.socketPage = (res, req) =>{
    console.log("Socket Page")
    console.log(path.join(__dirname, '..', 'views/client.html'))
    req.sendFile(path.join(__dirname, '..', 'views/client.html'));
    //  req.render('client', { title: 'Express' });
}

exports.connection = (res, req) => {
    console.log("[Controller] ====> Socket Connection ")
    socket.on('connection', function(socket){
        console.log('user connected: ', socket.id);  //3-1
        var name = "user" + count++;                 //3-1
        io.to(socket.id).emit('change name',name);   //3-1

        socket.on('disconnect', function(){ //3-2
            console.log('user disconnected: ', socket.id);
          });

        socket.on('send message', function(name,text){ //3-3
        var msg = name + ' : ' + text;
        console.log(msg);
        io.emit('receive message', msg);
        });
    })


}
