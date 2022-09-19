
module.exports = app => {
    const room = require('../controllers/room.controller')
    // const de = require('../server')

    var router = require("express").Router();

    app.use("/api/room", router);
}