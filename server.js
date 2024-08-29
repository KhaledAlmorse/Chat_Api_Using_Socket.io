const express = require("express");
const cors = require("cors");

const { join } = require("path");
const http = require("http");

const app = express();
app.use(cors());

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "gttp://127.0.0.1:8080",
  },
});

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected with socket id", socket.id);

  socket.on("message", (msg) => {
    console.log("message: " + msg);

    io.emit("send_message_to_all_users", msg);
  });

  socket.on("Typing", () => {
    socket.broadcast.emit("Show_Typing_Status");
  });

  socket.on("Stop_Typing", () => {
    socket.broadcast.emit("Clear_Typing_Status");
  });

  socket.on("disconnect", () => {
    console.log("left the chat with socket id" + socket.id);
  });
});

/*
emit --> publish to an event using emit("eventname",data)

on --> listen to event using  .on("eventName", callback)
*/

server.listen(3000, () => {
  console.log(`Listening on http://localhost:3000`);
});
