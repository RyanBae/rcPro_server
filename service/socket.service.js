const path = require("path");
const db = require("../models");
const Room = db.room;
const Op = db.Sequelize.Op;
// const tran = db.Sequelize.transaction();
// const seq = db;

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
        open_yn : open_yn,
        max_count : req.maxCount,
        count : 0
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
exports.findOne = async (req, res) => {
    let result;
    // const getRoom = new Room;
    await Room.findOne({where:{id : {[Op.eq] : req}}, raw:true})
    .then(data =>{
        console.log("FindOne SuccessFully");
        result = data;
        
    }).catch(err =>{
        if(err){
            console.log("Find One Error");
            result = null;
        }
    });
    // console.log("================================")
    // console.log(result)
    return result;
  };
  
//   find All 방 리스트 가져오기
exports.findAll = async (req, res) => {
    // const state = 
    let condition = {state : {[Op.eq]: '1'}};
    let result = [];
    await Room.findAll({attributes:['id','title','open_yn','state','count','max_count'], where:condition, raw:true})
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

    return result;

    // console.log(rooms)
    // return rooms;
    // console.log(result);
    // return "Return";

}

exports.countUpdate = async (id, count, type) => {

    //* 트랜잭션 설정
    
    const tran = await db.sequelize.transaction();
    try{
        console.log("Count update !")
        if(type === 0){
            count = count-1;
        }else{
            count = count+1;
        }
        // console.log("Count : "+count);

        // 마지막 인원 나갈경우 방 close
        let state = 1;
        if(count === 0){
            state = 0;
        }

        let result;
        await Room.update(
            {count:count,state:state},
            {where:{id:id},
            transaction : tran
        }).then(data =>{
            if(data == 1){
                console.log("Count Up & Down SuccessFully");
            }else{
                console.log("Count Up & Down Fail");
            }
            result = data;
        }).catch(err =>{
            if(err){
                console.log("Count Update Error");
            }
        });

        await tran.commit();
        return result;

    }catch(err){
        console.log("Transaction Error")
        await tran.rollback();
    }
    
}

// 방 상태 변경
exports.update = (req, res)=>{
    const id = id;
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

