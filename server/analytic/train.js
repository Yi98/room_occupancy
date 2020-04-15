const http = require('http');
const https = require('https');
const date = require('date-and-time');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const getRoomData = (roomId) => {
  // change host
  var options = {
    // host: 'localhost',
    host: '192.168.99.100',
    port: 3000,
    // host: 'roomoccupancy.herokuapp.com',
    path: `/api/rooms/${roomId}/?period=trainingWeek`,
    // path: `/api/rooms/${roomId}/?period=custom&start=2020-01-01&end=2020-11-30`,
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

      const tempTrain = [];
      const today = new Date();
      const parsedToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      for (let i = 0; i < results.room.people.length; i++) {
        const currentDate = new Date(results.room.people[i].time);
        const parsedCurrent = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const threshold = date.subtract(parsedToday, parsedCurrent).toHours();

        // last 168 horus (7 days) -> next 24 hours
        if (threshold > 0 && threshold <= 168) {
          let formattedDate = date.format(new Date(results.room.people[i].time), 'YYYY-MM-DD HH:00');
          let found = false;

          for (let j = 0; j < tempTrain.length; j++) {
            if (tempTrain[j].date == formattedDate) {
              tempTrain[j].people = (tempTrain[j].people + results.room.people[i].data) / 2;
              found = true;
            }
          }

          if (!found) {
            const newData = { date: formattedDate, people: results.room.people[i].data };
            tempTrain.push(newData);
          }
        }
      }

      // sort the date
      tempTrain.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
      });

      writeToCsv(tempTrain, './server/analytic/data/dummy.csv');
    })
  }).end();
}


function writeToCsv(data, filePath) {
  const csvWriter = createCsvWriter({
    path: filePath,
    header: [
      { id: 'date', title: 'Date' },
      { id: 'people', title: 'People' }
    ]
  });

  csvWriter.writeRecords(data)
    .then(() => {
      console.log('Done writing data to csv');
      trainAndPredict(filePath);
    });
};


function generateDummyData() {
  const records = [];
  let min;
  let max;

  for (let k = 1; k <= 1; k++) { // a year (month)
    for (let i = 1; i <= 17; i++) { // a month (day)
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
        // record.date = i + '/1' + '/2020 ' + j + ':00';
        record.date = '2020-01-' + i + ' ' + j + ':00';
        record.people = Math.floor(Math.random() * (max - min + 1) + min);

        records.push(record);
      }
    }
  }

  writeToCsv(records, './server/analytic/data/research.csv');
};


function trainAndPredict(filePath) {
  let results;

  var spawn = require("child_process").spawn;

  var thread = spawn('python', ["./server/analytic/arima.py", filePath]);

  thread.stdout.on('data', function (data) {
    results += data;
  })

  thread.stdout.on('end', function (data) {
    const forecastResult = [];
    results = results.replace('undefined', '');
    results = results.replace('" "', '');

    const stringifyResults = results.split('\r\n');

    for (let i = 0; i < stringifyResults.length; i++) {
      if (stringifyResults[i] == '') {
        continue;
      }
      forecastResult.push(parseFloat(stringifyResults[i]));
    }
    process.send(forecastResult);
  })
};

process.on('message', message => {
  // generateDummyData();
  const roomId = process.argv[2];
  
  getRoomData(roomId);
});
