let io;

function init(connection) {
  io = connection;
}

function emit(eventName, payload) {
  //
  io.emit(eventName, payload);
}

module.exports = {
  init,
  emit,
};
