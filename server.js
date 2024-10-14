const express = require('express')
const cors = require('cors');
const http = require('http')
const {Server} = require('socket.io');
const ACTIONS = require('./src/Action');

const app = express()

const corsOptions = {
    origin: 'http://localhost:3000', // Specify your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  };

  app.use(cors(corsOptions));


const server = http.createServer(app);

const io = new Server(server);

const userSocketMap = {}

function getAllConnectedClients(roomID){
    return Array.from(io.sockets.adapter.rooms.get(roomID) || []).map((socketID)=>{
        return {
            socketID,
            username: userSocketMap[socketID],
        }
    });
}

io.on('connection', (socket)=>{
    console.log(`socket connected ${socket.id}`)

    socket.on(ACTIONS.JOIN, ({roomID, username})=>{
        console.log(roomID,username, "ser")
        userSocketMap[socket.id] = username;
        socket.join(roomID);
        const clients = getAllConnectedClients(roomID)
        console.log()
        clients.forEach(({socketID})=>{
            io.to(socketID).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketID: socket.id,
            })
        })
    })

    socket.on(ACTIONS.CODE_CHANGE, ({roomID, code})=>{
        socket.in(roomID).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on(ACTIONS.SYNC_CODE, ({socketID, code})=>{
        io.to(socketID).emit(ACTIONS.CODE_CHANGE,{code});
    })

    socket.on('disconnecting',()=>{
        const rooms = [...socket.rooms]
        rooms.forEach((roomID)=>{
            socket.in(roomID).emit(ACTIONS.DISCONNECTED,{
                socketID: socket.id,
                username: userSocketMap[socket.id],
            });
        });

        delete userSocketMap[socket.id];
        socket.leave();
    })

})





const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)})