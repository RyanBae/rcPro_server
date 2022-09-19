
const path = require("path")
const fs = require("fs")
const socketService = require('../service/socket.service');
// const io  = require("../socket");

// var app = require('http').createServer(handler);
// fs = require('fs'); 
// const io = require('socket.io')(app); 
// const PORT = process.env.PORT || 3030;

<<<<<<< HEAD
=======
// fs.readFile(path.join(__dirname, '..', '..', 'foo.bar'))
exports.rooms = (res, req) =>{
    // require("../socket");
    // let ro = require("../server");
    
    // req.sendFile(path.join(__dirname, '..', 'views/rooms.html'));

}

/**
 * 채팅페이지 렌딩/SocketIO 연결
 * @param {*} res 
 * @param {*} req 
 */
exports.socketPage = (req, res) =>{
    console.log("Socket Page")
    require("../socket");
    // io.socketOn();
    // io.chatSpace
    console.log(req.session)
    res.sendFile(path.join(__dirname, '..', 'views/client.html'));
    // console.log("Process End ")
}

exports.connection = (res, req) => {
    console.log("[Controller] ====> Socket Connection ")
    // require("../socket");
    // io.socketOn();
}

>>>>>>> 4ed745f6a7217d3f1527ea04611b42ba1581bee7
/**
 * 
 * 방 생성
 * @param {Room} req 
 * @param {SocketId} socketId 
 * @param {*} res 
 * @returns 
 */
exports.registerRoom = (req, socketId, res) =>{
    console.log("Register Room ");
    console.log("req : ", req);
    // console.log("res : ", res);
    return socketService.create(req, socketId);

}

exports.getRooms = async (req, res) => {
    console.log("[Controller] ====> getRooms");
    // console.log(req)
    // console.log(res)
    // console.log(socketService.findAll())
    //  console.log(await socketService.findAll())
    return await socketService.findAll();
    // return "";
}

exports.getRoom = async (req,res) =>{
    console.log("[Controller] ====> getRoom ");
    console.log(req)

    return await socketService.findOne(req);
}

exports.countUpDown = (id, count, type) => {
    console.log("[Controller] ==> Room count Up Down");
    
    return socketService.countUpdate(id, count, type);
}
