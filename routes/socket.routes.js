
module.exports = app => {
    const socket = require('../controllers/socket.controller')

      
    var router = require("express").Router();
  
    router.get("/", socket.socketPage);
    // Connection Socket
    router.get("/con", socket.connection);

    app.use("/api/socket", router);
}