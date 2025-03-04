var defaultRoomName = "room-123";
const carbonSocket = (socket) => {
  console.log("New client connected:", socket.id);

  socket.emit("checkSocketC", "Hello Nigga");

  socket.on("checkSocket", (data) => {
    socket.emit("connectionWorks");
  });

  socket.on("page_mode", (data) => {
    const dataJSON = JSON.parse(data);

    socket.join(dataJSON.unique_code);
    console.log(dataJSON);
  });

  socket.on("join-room", (data) => {
    console.log("Room Joined");
    socket.join(defaultRoomName);
  });

  socket.on("get-rooms", (data) => {
    const clients = io.sockets.adapter.rooms.get(dataJSON.unique_code);
    console.log(clients);
  });

  socket.on("language-change-option-server", (data) => {
    const dataJSON = JSON.parse(data);

    console.log(dataJSON);

    socket.to(defaultRoomName).emit("language-change-option-client", data);
  });

  // Change Page
  socket.on("change-page-server-1", (data) => {
    socket.to(defaultRoomName).emit("change-page-client-1", data);
  });

  // Change Name State
  socket.on("name-change-server-1", (data) => {
    console.log("Name Change");
    socket.to(defaultRoomName).emit("name-change-client-1", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
};

module.exports = { carbonSocket };
