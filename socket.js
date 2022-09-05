const SocketIO = require("socket.io");
const http = require("./server");

// console.log(http)
const io = SocketIO(http,{
    cors:{
        origin:"*",
        methods:["GET", "POST"]
    },
});

// io.on('connection', function(socket){
//     socket.emit('usercount', io.engine.clientsCount);
//     // socket.leave();
//     // socket.join("채팅방 1")
//     socket.on('getRooms', () => { 
//         console.log( io.sockets.adapter)
//         // 다른 네임스페이스의 객체에도 접근할 수 있다.
//         socket.emit('rooms', io.sockets.adapter.rooms);
//     });
// });

var count=1;
var rcount=1;
var roomName;
io.on('connection', function(socket){ 
    socket.emit('usercount', io.engine.clientsCount);
    console.log('User connected: ', socket.id);  
    var name = "user" + count++;                 
    io.to(socket.id).emit('change name',name);   

    // socket.join("채팅방 1")
    
    socket.on('joinRoom', function(msg){
        console.log(msg)
        socket.join(msg);
        roomName = msg
        console.log(io.sockets.adapter)
    });

    //  채팅방에 접속자 
    io.emit('receive message', name+" 님이 입장하였습니다.")
  
    socket.on('disconnect', function(){ //3-2
      console.log('user disconnected: ', socket.id);

      io.emit('receive message',name+" 님이 나가셨습니다.")
    });
  
    socket.on('send message', function(name,text){ //3-3
      var msg = name + ' : ' + text;
      console.log(msg);
      io.emit('receive message', msg);
    });

    socket.on('getRooms', () => { 
        // 다른 네임스페이스의 객체에도 접근할 수 있다.
        console.log(io.sockets.adapter)
        socket.emit('rooms', io.sockets.adapter.rooms)
      });
    
    const typingList = [];
    socket.on('send typing', function(name, type){
        if(type === 0){
            if(typingList.includes(name)){
                // console.log(" 있다")
                // typingList.push(name);
                let deleteIndex = typingList.indexOf(name);
                typingList.splice(deleteIndex);
            }
        }else{
            // console.log("1111")
            if(!typingList.includes(name)){
                typingList.push(name);
            }
        }
        console.log(typingList)
        io.emit('receive typing', typingList)
    });


  });

const newRoom = io.of("/newRoom");

newRoom.on('connection', (socket)=>{
    console.log("New Room ")
    let roomName = "채팅방_"+rcount++;
    let name = "user" + count++;     
    console.log("New Room");
    socket.leave("대기방")
    socket.join(roomName);
    console.log(roomName)
    socket.on('rooms', ()=>{
        io.to(roomName).emit('change name'+name);   

    })

})


const waitRoom = io.of("/wait")

waitRoom.on('connection', (socket)=>{
    socket.leave(socket.id)
    console.log("WaitRoom ====>")
    socket.emit('usercount', io.engine.clientsCount);
    socket.join("대기방")
});


const debug = io.of("/debug");

debug.on('connection', (socket)=>{
    console.log(" DeBug!!")
    socket.on('getRooms', () => { 
        // 다른 네임스페이스의 객체에도 접근할 수 있다.
        console.log(io.sockets.adapter)
        socket.emit('rooms', io.sockets.adapter.rooms)
      });
})


const chatSpace = io.of("/chat");
const globalSpace = io.of("/global");


chatSpace.on("connection", (socket) => {
    console.log("========Chat Space 1 ")
	const {watchJoin} = initSocket(socket);
    io.chatSpace;
	watchJoin();
	// watchSend();
	// watchByebye();
});

globalSpace.on("connection", (socket) => {
    console.log("========Global Space 1 ")
	const {} = initSocket(socket);
	// watchGlobal();
});

const initSocket = (socket) =>{
    console.log("New Socket Connected !")
	function watchEvent(event, func) {
		socket.on(event, func);
	}

    return {
		// 특정 room에 join
		watchJoin: () => {
			watchEvent("join", async (data) => {
				// const sizeof = require("object-sizeof");
				// const Chat = require("./schema/chathistory");
				// const { room } = data;
				// socket.join(room);
				// const chats = await Chat.find({ room }).limit(30).lean();

				// console.log(sizeof(chats));

				// console.log(socket.rooms.size);
				// notifyToChat("load", chats);
                console.log(" Join!")
			});
		}
    }
}


// exports.socketOn = (res, req) => {
//     console.log("======> Socket On ")
//     // io.on("connection", function(socket){
//     //     console.log("User Connected : ", socket.id);

//     // });
//     chatSpace;

// }


