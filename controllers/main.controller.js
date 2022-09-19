
const path = require("path")


/**
 * 채팅페이지 렌딩/SocketIO 연결
 * @param {*} res 
 * @param {*} req 
 */
 exports.chatPage = (req, res) =>{
    require("../socket");
    res.sendFile(path.join(__dirname, '..', 'views/client.html'));
}
