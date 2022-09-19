const SocketIO = require("socket.io");
const http = require("./server");
// const { instrument } = require("@socket.io/admin-ui");
// 소켓 내에서 세션데이터 접근 가능하도록하는 모듈
const ios = require("express-socket.io-session");
// const { rooms } = require("./controllers/socket.controller");
const socketController = require("./controllers/socket.controller");



 
// 소켓 구문 시작 




// console.log(http)
const io = SocketIO(http,{
    cors:{
        origin:["https://admin.socket.io","*"],
        methods:["GET", "POST"],
        credentials: true
    },
});

// console.log(sessionOption)
// 모듈과 세션 연결 
// io.use(ios(session, { autoSave:true }));  


// const adminNamespace = io.of("/admin");
// instrument(io, {
//     namespaceName: "/admin",
//     auth: {
//         type: "basic",
//         username: "admin",
//         password: "$2a$12$Ln/hFriz69dGkcVS0F2LN.NcNpAZLJivvH9YckXbRCi0hf3W6RPHW"
//     },
//   });

  function publicRooms(){
    const {
        sockets:{
            adapter:{
                sids, rooms
            }
        }
    } = io;

    // public room list 만들기 
    const publicRooms =[];
    rooms.forEach((_, key)=>{
        if(sids.get(key) === undefined){
            console.log(_)
            console.log(key)
            publicRooms.push(key);
        }
    });
    console.log("Public Rooms")
    // console.log(rooms)
    // console.log(publicRooms)
    return publicRooms;
  }

  function userFromRoom(roomname){
    const {
        sockets:{
            adapter:{
                sids, rooms
            }
        }
    } = io;

    // public room list 만들기 
    const userFromRoom =[];
    // console.log("roomName!!! : "+roomname)
    rooms.forEach((_, key)=>{
        if(key === roomname){
            // console.log("====================================")
            // console.log("_ : "+Array.from(_));
            // console.log("key : "+key);
            // console.log(rooms[key])
            userFromRoom.push(Array.from(_));
            // console.log("====================================")
        }
    });
    // console.log("userFrom Rooms")
    // console.log(rooms)
    // console.log(userFromRoom)
    return userFromRoom;
  }


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

// var _userName;
io.on('connection', function(socket){ 
    console.log("======================> Connection ");
    console.log(http._events.request)
    // console.log(socket.handshake)
    
    // 소켓 내에서 세션에 접근 
    // var userID = socket.handshake.session.adminID;  
    // 소켓 내에서 세션에 접근   
    // var DEPT_CD = socket.handshake.session.DEPT_CD; 
    var roomName;
    var _userName = "User_" + count++;   
    //default User id 
    io.to(socket.id).emit('getUserName', _userName);
    console.log('User Connected -> Socket ID: ', socket.id, ", UserName : ",_userName);
    // io.to(socket.id).emit('changeName', _userName);   

    // 유저 이름 변경 
    socket.on('setUserName', (chgName) => {
        if(_userName !== chgName){
            console.log(" Set User Name")
            // console.log("Sockid : "+socket.id)
            console.log("socket name 1 : "+socket.name);
            
            socket.name = chgName;
            console.log("socket name 2 : "+socket.name);

            _userName = chgName;
            // console.log('Change UserName -> Socket ID: ', socket.id, ", UserName : ",_userName);
            io.to(socket.id).emit('getUserName', _userName)
        }
    });

    // 클라이언트 유저 숫자 
    io.emit('userCount', io.engine.clientsCount);

    // 룸 리스트 가져오기
    socket.on('getRooms', async () => { 
        console.log(" GET Rooms >>>>>>>>>>")
        // 다른 네임스페이스의 객체에도 접근할 수 있다.
        // console.log(io.sockets.adapter)
        
        // console.log(publicRooms())
        // io.to(socket.id).emit('rooms', publicRooms());
        await io.to(socket.id).emit('rooms', await socketController.getRooms());
    });

    // 새로운방 만들고 접속
    socket.on('newRoom', (data)=>{
        console.log("New Room")
        console.log(data)
        // console.log(data.title)
        // console.log(data.roomPassword)
    
        socketController.registerRoom(data, socket.id);
        roomName = data.title
        socket.join(roomName);
        console.log("Sock ID : "+socket.id)
        console.log("Room Name : "+roomName)
        console.log('New Room -> Socket ID: ', socket.id, ", UserName : ",_userName);
        io.to(roomName).emit('joinRoom', roomName);
        
    });

    // 방 접속시 메세지
    socket.on('conRoom', async (roomId, roomPw, roomPermission)=>{
        console.log("Connection Room");
        // console.log(roomId);
        // console.log(roomPw);
        // console.log(roomPermission);
        let room = await socketController.getRoom(roomId);
        if(room !== null){
            if(roomPermission){
                if(room.max_count > room.count){
                    roomName = room.title;
                    // 오픈 방으로 무조건 조인 
                    // roomName = roomId;
                    socket.join(roomName);
                    io.to(roomName).emit('joinRoom', roomName);
                    // room count +1
                    socketController.countUpDown(roomId, room.count, 1);
                }else{
                    await io.to(socket.id).emit('systemMessage', "인원이 초과하였습니다.", "0");    
                    await io.to(socket.id).emit('rooms', await socketController.getRooms());
                }

            }else{
                if(roomPw.length > 0){
                    // 방 비밀번호 매칭 하여 같으면 조인
                    if(room.room_password === roomPw){
                        console.log(room.max_count)
                        console.log(room.count)
                        if(room.max_count > room.count){
                            roomName = room.title;
                            socket.join(roomName);
                            io.to(roomName).emit('joinRoom', roomName);
                        // room count +1
                            socketController.countUpDown(roomId, room.count, 1);
                        }else{
                            await io.to(socket.id).emit('systemMessage', "인원이 초과하였습니다.", "0");    
                            await io.to(socket.id).emit('rooms', await socketController.getRooms());
                        }
                        
                    }else{
                        io.to(socket.id).emit('systemMessage', "비밀번호를 확인해주세요.", "0");
                    }
                    
                }else{
                    io.to(socket.id).emit('systemMessage', "비밀번호를 확인해주세요.", "0");
                }
    
            }
        }else{
            io.to(socket.id).emit('systemMessage', "입력한 방 제목을 확인해주세요.", "0");
        }
    })

    // 연결이 종료 되었을경우
    // socket.on('disconnect', ()=>{ 
    //   console.log('User Disconnected -> Socket ID : ', socket.id," , UserName : ",_userName);
    //   socket.leave(roomName);
    //   console.log("disCon : "+roomName)
    //   io.to(roomName).emit('roomUserCount', userFromRoom(roomName)[0].length);
    //   io.to(roomName).emit('receiveMessage',_userName+" 님이 퇴장하였습니다.")
    // });

    // 방을 나갔을경우
    socket.on('reaveRoom', async (roomId, callback)=>{
        console.log('User Leave Room -> Socket ID : ', socket.id," , UserName : ",_userName);
        let room = await socketController.getRoom(roomId);
        
        let updateResult = await socketController.countUpDown(roomId, room.count, 0);
        console.log(">>> "+ updateResult)
        if(updateResult == 1){
            await socket.leave(roomName);
            console.log("reave Room : "+roomName)
            await io.to(roomName).emit('receiveMessage', _userName+" 님이 퇴장하였습니다.", 0);
            callback(true);
            // io.to(roomName).emit('roomUserCount', userFromRoom(roomName)[0].length);
        }

    })

    // 접속자 메세지 남기기
    socket.on('conUserMsg', ()=>{
        // console.log("Conn -- ", _userName)
        console.log('User Con User Message -> Socket ID : ', socket.id," , UserName : ",_userName);
        io.to(roomName).emit('receiveMessage', _userName+" 님이 입장하였습니다.", 0);
        io.to(roomName).emit('roomUserCount', userFromRoom(roomName)[0].length);
    });

    // 메세지 전송, 수정하기 
    socket.on('sendMessage', function(name,text){ //3-3
      var msg = name + ' : ' + text;
      console.log(msg);
      io.to(roomName).emit('receiveMessage', msg, 1, _userName);
    });

    socket.on('inUsers', ()=>{
        console.log("inUsers")
        // console.log(roomName);
        // console.log(userFromRoom(roomName))
        // console.log(userFromRoom(roomName).size)
        // userFromRoom(roomName);
        // userFromRoom(roomName);
        console.log(userFromRoom(roomName)[0].length)
        io.to(roomName).emit('roomUserCount', userFromRoom(roomName)[0].length);

    })


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



    // console.log('User connected: ', socket.id);  
    // var name = "user" + count++;                 
    // io.to(socket.id).emit('change name',name);   

    // // socket.join("채팅방 1")
    
    // socket.on('joinRoom', function(msg){
    //     console.log(msg)
    //     socket.join(msg);
    //     roomName = msg
    //     console.log(io.sockets.adapter)
    // });

    // //  채팅방에 접속자 
    // io.emit('receive message', name+" 님이 입장하였습니다.")
  
    // socket.on('disconnect', function(){ //3-2
    //   console.log('user disconnected: ', socket.id);

    //   io.emit('receive message',name+" 님이 나가셨습니다.")
    // });
  
    // socket.on('send message', function(name,text){ //3-3
    //   var msg = name + ' : ' + text;
    //   console.log(msg);
    //   io.emit('receive message', msg);
    // });

    // socket.on('getRooms', () => { 
    //     // 다른 네임스페이스의 객체에도 접근할 수 있다.
    //     console.log(io.sockets.adapter)
    //     socket.emit('rooms', io.sockets.adapter.rooms)
    //   });
    
    // const typingList = [];
    // socket.on('send typing', function(name, type){
    //     if(type === 0){
    //         if(typingList.includes(name)){
    //             // console.log(" 있다")
    //             // typingList.push(name);
    //             let deleteIndex = typingList.indexOf(name);
    //             typingList.splice(deleteIndex);
    //         }
    //     }else{
    //         // console.log("1111")
    //         if(!typingList.includes(name)){
    //             typingList.push(name);
    //         }
    //     }
    //     console.log(typingList)
    //     io.emit('receive typing', typingList)
    // });


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
        socket.to(socket.id).emit('rooms', publicRooms());
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


