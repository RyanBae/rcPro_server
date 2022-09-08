const path = require("path")

const db = require("../models");
const Room = db.room;
const Op = db.Sequelize.Op;

/**
 * 방 생성
 * @param {Room} req 
 * @param {SocketId} socketId 
 * @param {*} res 
 */
exports.create = (req,socketId,res) =>{
    console.log(" Socket Service > Create");

    if (!req.title) {
        console.log("Title Undefind");
        // res.status(400).send({
        //   message: "Content can not be empty!"
        // });
        // return;
    }

    let open_yn = false;
    if(req.roomPassword.length > 0){
        open_yn = true
    }

    const room = {
        title : req.title,
        room_password : req.roomPassword,
        state : req.state ? req.state : false,
        owner_id : socketId,
        open_yn : open_yn
    };
        
    Room.create(room)
    .then(data => {
        console.log(data)
        res.send(data);
    })
    .catch(err => {
        console.log(res);
        });
}

// Find a single Room with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Room.findByPk({id, raw:true})
    .then(data =>{
        console.log("Find One "+id);
        console.log("Result : "+ data)
        // res.json(data);
    }).catch(err =>{
        if(err){
            console.log("Find One Error");
        }
        // res.status(500).send({
        //     message: "Error retrieving Room with id=" +id
        //   });
    });
  };
  
//   find All 방 리스트 가져오기
exports.findAll = async (req, res) => {
    // const state = 
    let condition = {state : {[Op.eq]: '1'}};
    let result = [];
    await Room.findAll({attributes:['id','title','open_yn','state'], where:condition, raw:true})
    .then(data=>{
        console.log("FindAll SuccessFully");
        // console.log(data)
        result = data
        // return "Success!";
    })
    .catch(err=>{
        if(err){
            console.log(err)
            console.log("Rooms Find All Error");
            // return err
        }
    });
    console.log("==========================================")
    console.log(result)
    return result;

    // console.log(rooms)
    // return rooms;
    // console.log(result);
    // return "Return";

}

// 방 상태 변경
exports.update = (req, res)=>{
    const id = req.id;
    Room.update(req, {
        where:{id:id}
    })
    .then(num =>{
        if(num ==1){
          console.log(" Update SuccessFully")
        }
    }).catch(err =>{
        console.log("Error!!")
    })
}

