// Room Model
module.exports = (sequelize, Sequelize)=>{
    const Room = sequelize.define("room", {
        title:{type: Sequelize.STRING},
        room_password:{type: Sequelize.STRING},
        state:{type: Sequelize.BOOLEAN},
        owner_id:{type: Sequelize.STRING}
        // owner_id:{}
    });

    return Room;
}