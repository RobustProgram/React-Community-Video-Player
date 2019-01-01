import openSocket from "socket.io-client";
const socket = openSocket("127.0.0.1:5000");

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Getting updated by the server
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

// cb is linked to a callback function]
// This function will fire when the server sends a notify type message to the
// client.
function notify(cb) {
    socket.on("notify", (message) => {
        console.log(message);
        cb(message);
    });
}

function confirmServer(cb) {
    socket.on("confirmserver", (serverID) => { cb(serverID); });
}

function confirmVideo(cb) {
    socket.on("confirmvideo", (videoURL) => { cb(videoURL); });
}

function confirmUpdateVideo(cb) {
    socket.on("confirmvideoupdate", (data) => { cb(data); });
}

function receiveMessageUpdate(cb) {
    socket.on("updatemessage", (data) => { cb(data); });
}

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// Update the server
// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

function createServer(data) { socket.emit("createserver", data); }
function leaveServer() { socket.emit("leaveserver"); }
function loadVideo(data) { socket.emit("loadvideo" , data); }
function updateVideo(data) { socket.emit("updatevideo" , data); }

function uploadMessage(data) { socket.emit("uploadmessage", data); }

export {
    notify, createServer, confirmServer, leaveServer, loadVideo, updateVideo,
    confirmUpdateVideo, confirmVideo, uploadMessage, receiveMessageUpdate
}
