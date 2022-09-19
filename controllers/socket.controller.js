
const path = require("path")
const fs = require("fs")
const socketService = require('../service/socket.service');
// const io  = require("../socket");

// var app = require('http').createServer(handler);
// fs = require('fs'); 
// const io = require('socket.io')(app); 
// const PORT = process.env.PORT || 3030;

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
