const fork = require('child_process').fork;

let socket;

exports.connectSocket = (io) => {
  socket = io;

  io.on("connection", function (socket) {
    // console.log("forecast socket connected");
  })
}

exports.startForecast = () => {
  const predictiveModel = fork('./server/analytic/train.js');
  predictiveModel.send('start predicting');

  predictiveModel.on('message', result => {
    console.log(result);
    socket.emit('forecast', {result});
  });
}