// src/server.js
const express = require("express");
const Http = require("http");
const bodyParser = require("body-parser");
const fs = require("fs")
const cors = require("cors");
const path = require('path');


const app = express();
const http = Http.createServer(app);


app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));

// //
// var corsOptions = {
//   origin: "http://localhost:3031"
// };

app.use(cors());
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
// require("./socket");


// =========== Routes Add Area ===========

const PORT = process.env.PORT || 3030;

http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
 
module.exports = http;