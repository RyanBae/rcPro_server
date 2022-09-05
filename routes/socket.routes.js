
module.exports = app => {
    const socket = require('../controllers/socket.controller')
    // const de = require('../server')

      
    var router = require("express").Router();
  
    router.get("/", socket.socketPage);
    // Connection Socket
    router.get("/con", socket.connection);
    router.get("/rooms", socket.rooms);
    // router.get("/debug", de.debu);

    app.use("/api/socket", router);
}