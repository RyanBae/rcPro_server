
module.exports = app => {
    const socket = require('../controllers/socket.controller')
    // const de = require('../server')

      
    var router = require("express").Router();

    app.use("/api/socket", router);
}