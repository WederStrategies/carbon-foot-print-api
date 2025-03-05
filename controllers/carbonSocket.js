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
    // console.log(dataJSON)
  });

  socket.on("join-room", (room) => {
    // console.log("Room Joined", room)
    socket.join(room);
  });

  socket.on("get-rooms", (data) => {
    const clients = io.sockets.adapter.rooms.get(dataJSON.unique_code);
    console.log(clients);
  });

  // Page 1
  // Change Page

  socket.on("language-change-option-server", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("language-change-option-client", data);
  });

  socket.on("change-page-server-1", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("change-page-client-1", data);
  });

  // Page 1
  // Change Name State
  socket.on("name-change-server-1", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("name-change-client-1", data);
  });

  // Page 2

  // Page 2
  // Change House State
  socket.on("page-2-update-house-server", data => {
    const dataJSON = JSON.parse(data)
    socket.to(dataJSON.room).emit("page-2-update-house-client", data)
  })

  // Page 3
  // Change Slider State
  socket.on("page-3-update-slider-server", data => {
    const dataJSON = JSON.parse(data)
    socket.to(dataJSON.room).emit("page-3-update-slider-client", data)
  })

  // Page 4
  // Change Slider State
  socket.on("page-update-slider-server", data => {
    const dataJSON = JSON.parse(data)
    socket.to(dataJSON.room).emit("page-update-slider-client", data)
  })

  // Page Change
  // Next page-prev-server
  socket.on("page-next-server", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("page-next-client", data);
  });

  // Skip
  socket.on("page-skip-server", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("page-skip-client", data);
  });

  // Prev
  socket.on("page-prev-server", (data) => {
    const dataJSON = JSON.parse(data);
    socket.to(dataJSON.room).emit("page-prev-client", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
};

module.exports = { carbonSocket };
