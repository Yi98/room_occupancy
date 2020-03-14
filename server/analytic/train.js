const http = require('http');
const date = require('date-and-time');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let tempTrain = [];

const getAllRoomData = () => {
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/rooms/5db043344a270c2b48ee776a/?period=yearly',
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
        return new Date(a.date) - new Date(b.date);
      });

      writeToCsv(tempTrain);
    })

  }).end();
}


async function writeToCsv(data, fileName) {
  const csvWriter = createCsvWriter({
    path: fileName,
    header: [
      { id: 'date', title: 'Date' },
      { id: 'people', title: 'People' }
    ]
  });

  csvWriter.writeRecords(data)
    .then(() => {
      console.log('Done writing data to csv');
      trainAndPredict();
    });
};


async function trainAndPredict() {
  let results;

  var spawn = require("child_process").spawn;

  var thread = spawn('python', ["./server/analytic/arima.py", './server/analytic/data/daily-minimum-temperatures.csv']);

  thread.stdout.on('data', function (data) {
    results += data;
  })

  thread.stdout.on('end', function (data) {
    console.log(results);
    // return results;
    process.send(results)
  })
};

async function generateDummyData() {
  const records = [];
  let min;
  let max;

  for (let k = 1; k <= 1; k++) { // a year (month)
    for (let i = 1; i <= 5; i++) { // a month (day)
      for (let j = 0; j < 24; j++) {  // a day (hour)

        // simulate peak hour on 8pm everyday
        if (j == 20) {
          min = 40;
          max = 50;
        }
        else if (j == 8 || j == 14) {
          min = 30;
          max = 40;
        }
        else {
          min = 5;
          max = 20;
        }

        const record = {};
        record.date = i + '/1' + '/2020 ' + j + ':00';
        record.people = Math.floor(Math.random() * (max - min + 1) + min);

        records.push(record);
      }
    }
  }

  writeToCsv(records, './server/analytic/data/dummy.csv');
};

process.on('message', message => {
  generateDummyData();
});