
const path = require("path")


/**
 * 채팅페이지 렌딩/SocketIO 연결
 * @param {*} res 
 * @param {*} req 
 */
 exports.chatPage = (req, res) =>{
    // console.log("Socket Page")
    require("../socket");
    // io.socketOn();
    // io.chatSpace
    
    res.sendFile(path.join(__dirname, '..', 'views/client.html'));
    // console.log("Process End ")
}
