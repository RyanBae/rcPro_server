
var app = require('../server');
var http = require('http').Server(app);
const io = require("socket.io")(http);
const path = require("path")
const fs = require("fs")
// var app = require('http').createServer(handler);
// fs = require('fs'); 
// const io = require('socket.io')(app); 
// const PORT = process.env.PORT || 3030;

// fs.readFile(path.join(__dirname, '..', '..', 'foo.bar'))
exports.socketPage = (res, req) =>{
    console.log("Socket Page")
    // console.log(path.join(__dirname, '..', 'views/client.html'))

    console.log(http)
    
    req.sendFile(path.join(__dirname, '..', 'views/client.html'));
    console.log("Process End ")
}

exports.connection = (res, req) => {
    console.log("[Controller] ====> Socket Connection ")
    io.on('connection', function(socket){ //3
        console.log('user connected: ', socket.id);  //3-1
        var name = "user" + count++;                 //3-1
        io.to(socket.id).emit('change name',name);   //3-1
      
        socket.on('disconnect', function(){ //3-2
          console.log('user disconnected: ', socket.id);
        });
      
        socket.on('send message', function(name,text){ //3-3
          var msg = name + ' : ' + text;
          console.log(msg);
          io.emit('receive message', msg);
        });
      });


}


http.listen(() => {
    console.log(`Server is running on.`);


    // socket.on('connection', function(socket){
    //     console.log('user connected: ', socket.id);  //3-1
    //     var name = "user" + count++;                 //3-1
    //     io.to(socket.id).emit('change name',name);   //3-1

    //     socket.on('disconnect', function(){ //3-2
    //         console.log('user disconnected: ', socket.id);
    //       });

    //     socket.on('send message', function(name,text){ //3-3
    //     var msg = name + ' : ' + text;
    //     console.log(msg);
    //     io.emit('receive message', msg);
    //     });
    // })
    // console.log(" listen ===")


  });