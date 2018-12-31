const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Maps the Unique ID of the room to a name, we will then use the name to store
// the password and number of users in the room in two other separate maps.
let serverUIDMap = {};
let serverPasswordMap = {};
let serverNumbersMap = {};

// Enable CORS
io.set("origins", "*:*");
io.on("connection", async (socket) => {
    console.log("Connection Established!");
    io.to(socket.id).emit("notify", "Welcome!");

    socket.on("createserver", async (message) => {
        console.log("Socket wants to create or join a server!");

        if (message["serverName"] === ""){
            console.log("Received a blank name for the server. Ignoring ...");
            return;
        }

        if (message["serverName"] in serverPasswordMap) {
            if (message["serverPass"] == serverPasswordMap[message["serverName"]]) {
                socket.join( message["serverName"] );
                serverUIDMap[socket.rooms[socket.id]] = message["serverName"];
                serverNumbersMap[message["serverName"]] =+ 1;
                // Notify the users
                io.to(message["serverName"]).emit('notify', "A user has joined the room!");
                io.to(socket.id).emit("notify", "You joined the room " + message["serverName"]);
                io.to(socket.id).emit("confirmserver", message["serverName"]);
            } else {
                io.to(socket.id).emit("notify", "Wrong passphrase.");
            }
        } else {
            // Allocate the variables
            serverPasswordMap[message["serverName"]] = message["serverPass"];
            socket.join( message["serverName"] );
            serverUIDMap[socket.rooms[socket.id]] = message["serverName"];
            serverNumbersMap[message["serverName"]] = 1;
            // Notify the users
            io.to(message["serverName"]).emit('notify', "A user has joined the room!");
            io.to(socket.id).emit("notify", "You joined the room " + message["serverName"]);
            io.to(socket.id).emit("confirmserver", message["serverName"]);
        }
    });

    function userLeaveRoom() {
        // Get the unique room id from the internal storage, find a name that
        // maps the unique room id and use that name to modify the other
        // variables.
        let roomUID = socket.rooms[socket.id];

        if (roomUID in serverUIDMap){
            let roomName = serverUIDMap[roomUID];
            serverNumbersMap[roomName] -= 1;

            if (serverNumbersMap[roomName] == 0) {
                delete serverUIDMap[roomUID];
                delete serverNumbersMap[roomName];
                delete serverPasswordMap[roomName];
            }
            socket.leave(roomName);
        }
    }

    socket.on("updatevideo", async (message) => {
        //console.log("Updating video");
        //console.log(message);
        let roomUID = socket.rooms[socket.id];

        if (roomUID in serverUIDMap){
            let roomName = serverUIDMap[roomUID];
            io.to(roomName).emit('confirmvideoupdate', message);
        } else {
            io.to(socket.id).emit("notify", "You need to be part of a room to update a room.");
        }
    });

    socket.on("leaveserver", async (message) => {
        console.log("Socket leaving room!");
        userLeaveRoom();
        io.to(socket.id).emit("notify", "You left the room!");
    });

    socket.on("disconnecting", async (message) => {
        userLeaveRoom();
    });

    socket.on("loadvideo", async (message) => {
        console.log("Load video to the room");
        let roomUID = socket.rooms[socket.id];
        let roomName = serverUIDMap[roomUID];
        io.to(roomName).emit("confirmvideo", message);
        io.to(roomName).emit('notify', "Loading new video!");
    })
})


server.listen(5000, '0.0.0.0', () => {
    console.log("Backend Server running on http://localhost:5000");
});
