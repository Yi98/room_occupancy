const fork = require('child_process').fork;

let socket;

exports.connectSocket = (io) => {
  socket = io;

  io.on("connection", function (socket) {
    // console.log("forecast socket connected");
  })
}

exports.forecastDailyPeople = (req, res) => {
  const roomId = req.query.roomId;

  const predictiveModel = fork('./server/analytic/train.js', [roomId]);
  predictiveModel.send('start predicting');

  predictiveModel.on('message', result => {
    console.log(result);
    res.status(200).json({
      result
    });
    
    socket.emit('forecast', { result });
  });
}