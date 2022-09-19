
module.exports = app => {
    const main = require('../controllers/main.controller')
    // const de = require('../server')

      
    var router = require("express").Router();
  
    // 채팅 페이지
    router.get("/", main.chatPage);

    app.use("/api", router);
}