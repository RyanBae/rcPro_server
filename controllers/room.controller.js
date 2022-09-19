
const path = require("path")
const fs = require("fs")
const roomService = require('../service/room.service');

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
    return roomService.create(req, socketId);

}

/** 
 *  방 리스트 가져오기
 * 
 * */ 
exports.getRooms = async (req, res) => {
    console.log("[Controller] ====> getRooms");
    // console.log(req)
    // console.log(res)
    // console.log(socketService.findAll())
    //  console.log(await socketService.findAll())
    return await roomService.findAll();
    // return "";
}

/** 
* 방 정보 가져오기
* 
*/
exports.getRoom = async (req,res) =>{
    console.log("[Controller] ====> getRoom ");
    console.log(req)

    return await roomService.findOne(req);
}


/** 
 * 방 연결/해제시 카운터 
*/
exports.countUpDown = async (id, count, type) => {
    console.log("[Controller] ==> Room count Up Down");
    
    return await roomService.countUpdate(id, count, type);
}
