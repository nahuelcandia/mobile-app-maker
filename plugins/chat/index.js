module.exports = function(app, server, sockets) {
  app.locals.chat = {}
  app.locals.chat.textinput = function() {
    return read(__dirname + "/chat.html");
  };
  var chatui = sockets.io.of("/chat");

  chatui.on("connection", function(socket) {
    socket.on("keyup", function onKeyUp(data) {
      socket.broadcast.emit("keyup", data);
    });
    socket.on("message", function onKeyUp(data) {
      socket.emit("message", data);
      socket.broadcast.emit("message", data);
    });
  });
}