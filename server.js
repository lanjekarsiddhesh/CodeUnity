const express = require('express')
const app = express()
const http = require('http')
const {Server} = require('socket.io');
const ACTIONS = require('./src/Action');


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
        userSocketMap[socket.id] = username;
        socket.join(roomID);
        const client = getAllConnectedClients(roomID)
        console.log(client)
        client.forEach((socketID)=>{
            io.to(socketID).emit(ACTIONS.JOINED, {
                client,
                username,
                socketID: socket.id,
            })
        })
    })
})


const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>{console.log(`Listening on port ${PORT}`)})