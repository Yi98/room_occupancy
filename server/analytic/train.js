const http = require('http');

const date = require('date-and-time');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let tempTrain = [];

const getAllRoomData = () => {

  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/rooms/5db583ed1c9d4400009a20f2/?period=yearly',
    method: 'GET'
  };

  http.request(options, function (res) {
    let results = '';

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      results += chunk;
    });

    res.on('end', function () {
      results = JSON.parse(results);

      for (let i = 0; i < results.room.people.length; i++) {
        const trainingData = {};

        trainingData.date = date.format(new Date(results.room.people[i].time), 'YYYY/MM/DD HH');
        trainingData.people = results.room.people[i].data;
        tempTrain.push(trainingData);
      }

      console.log(tempTrain);

      tempTrain.sort(function (a, b) {
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
      });

      writeToCsv(tempTrain);
    })

  }).end();
}


const writeToCsv = (data) => {
  const csvWriter = createCsvWriter({
    path: 'people.csv',
    header: [
      { id: 'date', title: 'Date' },
      { id: 'people', title: 'People' }
    ]
  });


  csvWriter.writeRecords(data)
    .then(() => {
      console.log('...Done');
    });
};


const trainAndPredict = () => {
  let results;

  var spawn = require("child_process").spawn;

  var process = spawn('python', ["arima.py"]);

  process.stdout.on('data', function (data) {
    results += data;
  })

  process.stdout.on('end', function (data) {
    console.log(results);
  })
};


// getAllRoomData();
// writeToCsv();
trainAndPredict();