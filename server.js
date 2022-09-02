// src/server.js
const express = require("express");

const bodyParser = require("body-parser");
const fs = require("fs")
const cors = require("cors");
var path = require('path');


var app = express();

// var http = require('http').Server(app); 
// var io = require('socket.io')(http);    


app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
// const http = require("http").Server(app);
// const socket = require("socket.io")(http);

var corsOptions = {
  origin: "http://localhost:3031"
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");

db.sequelize.sync();
// 개발 중에는 기존 테이블을 삭제하고 데이터베이스를 다시 동기화해야 할 수 있습니다. force: true다음 코드로 사용
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("Drop and re-sync db.");
// });

// =========== Routes Add Area ===========
require("./routes/tutorial.routes")(app);
require("./routes/socket.routes")(app);

// =========== Routes Add Area ===========

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
 
module.exports = app;