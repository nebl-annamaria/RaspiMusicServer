const dotenv = require("dotenv").config();
const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const app = express();
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  //for vue dev server
  cors: {
    origin: [
      process.env.LOCAL_STATIC_IP + ":8080",
      process.env.LOCAL_STATIC_IP + ":3000",
      "http://localhost:8080",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
    allowEIO3: true,
  },
});

let appState = {
  currentlyPlaying: "",
  playerState: "",
};

io.on("connection", (socket) => {
  console.log("a user connected by id:" + socket.id);

  //sending app state for new connected clients
  socket.emit("initial_data", appState);

  // sending vue emits to all client instances
  socket.onAny((eventName, args) => {
    io.emit(eventName, args);
  });

  //storing state on the server
  socket.on("player_state_change", (args) => {
    appState.playerState = args;
  });
  socket.on("song_select", (args) => {
    appState.currentlyPlaying = args.snippet.title;
  });

  socket.on("reboot", () => {
    exec("sudo reboot");
  });
  socket.on("shut_down", () => {
    exec("sudo shutdown -h now");
  });

  socket.on("volume_up", () => {
    exec("amixer -c 1 sset 'Headphone',0 100+");
  });
  socket.on("volume_down", () => {
    exec("amixer -c 1 sset 'Headphone',0 100-");
  });
});

app.use(cors());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));

const port = 3000;

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

server.listen(port, () => {
  console.log("listening on port" + port);
});
