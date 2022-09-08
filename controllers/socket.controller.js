
const path = require("path")
const fs = require("fs")
const socketService = require('../service/socket.service');
// const io  = require("../socket");

// var app = require('http').createServer(handler);
// fs = require('fs'); 
// const io = require('socket.io')(app); 
// const PORT = process.env.PORT || 3030;

// fs.readFile(path.join(__dirname, '..', '..', 'foo.bar'))
exports.rooms = (res, req) =>{
    require("../socket");
    // let ro = require("../server");
    
    req.sendFile(path.join(__dirname, '..', 'views/rooms.html'));

}

exports.socketPage = (res, req) =>{
    // console.log("Socket Page")
    require("../socket");
    // io.socketOn();
    // io.chatSpace
    
    req.sendFile(path.join(__dirname, '..', 'views/client.html'));
    // console.log("Process End ")
}

exports.connection = (res, req) => {
    console.log("[Controller] ====> Socket Connection ")
    // require("../socket");
    // io.socketOn();
}

exports.registerRoom = (req, socketId, res) =>{
    console.log("Register Room ");
    console.log("req : ", req);
    // console.log("res : ", res);
    return socketService.create(req, socketId);

}


