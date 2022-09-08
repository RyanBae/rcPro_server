const path = require("path")

const db = require("../models");
const Room = db.room;
const Op = db.Sequelize.Op;

exports.create = (req,socketId,res) =>{
    console.log(" Socket Service > Create");

    if (!req.title) {
        console.log("Title Undefind");
        // res.status(400).send({
        //   message: "Content can not be empty!"
        // });
        // return;
    }

    const room = {
        title : req.title,
        room_password : req.roomPassword,
        state : req.state ? req.state : false,
        owner_id : socketId
    };
        
    Room.create(room)
    .then(data => {
        // console.log('==============================  then')
        console.log(data)
        // console.log('==============================  then 2')
        // console.log(data.dataValues)
        // roomIndex = data.dataValues.id
        res.send(data);
    })
    .catch(err => {
        // console.log('==============================  catch')
        console.log(res);
        // console.log(Room.Op);
        // res.status(500).send({
            // message:
            //     err.message || "Some error occurred while creating the Room."
            // });
        });
        // console.log("=============================================")
        // console.log(room)
        // return roomIndex;
}

// Find a single Room with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Room.findByPk(id).then(data =>{
        res.send(data);
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
exports.findAll = (req, res) => {

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

